create table if not exists public.member_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id,blocked_id),
  constraint member_blocks_no_self check (blocker_id <> blocked_id)
);
alter table public.member_blocks enable row level security;
grant select,insert,delete on public.member_blocks to authenticated;
drop policy if exists "Members see own blocks" on public.member_blocks;
create policy "Members see own blocks" on public.member_blocks for select to authenticated using (blocker_id = (select auth.uid()));
drop policy if exists "Members block other members" on public.member_blocks;
create policy "Members block other members" on public.member_blocks for insert to authenticated with check (blocker_id = (select auth.uid()));
drop policy if exists "Members unblock members" on public.member_blocks;
create policy "Members unblock members" on public.member_blocks for delete to authenticated using (blocker_id = (select auth.uid()));

drop policy if exists "Members can send direct messages" on public.direct_messages;
create policy "Members can send direct messages" on public.direct_messages for insert to authenticated
with check (
  sender_id = (select auth.uid()) and sender_id <> recipient_id
  and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))
  and not exists (select 1 from public.member_blocks b
    where (b.blocker_id = sender_id and b.blocked_id = recipient_id)
       or (b.blocker_id = recipient_id and b.blocked_id = sender_id))
);

create table if not exists public.message_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  message_id uuid not null references public.direct_messages(id) on delete cascade,
  reason text not null check (char_length(reason) between 5 and 1000),
  status text not null default 'open' check (status in ('open','reviewed','resolved')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(reporter_id,message_id)
);
create index if not exists message_reports_status_idx on public.message_reports(status,created_at desc);
alter table public.message_reports enable row level security;
grant select,insert,update on public.message_reports to authenticated;
drop policy if exists "Members report direct messages" on public.message_reports;
create policy "Members report direct messages" on public.message_reports for insert to authenticated
with check (reporter_id = (select auth.uid()) and exists (
  select 1 from public.direct_messages m where m.id = message_id
  and (m.sender_id = (select auth.uid()) or m.recipient_id = (select auth.uid()))
));
drop policy if exists "Reporters and moderators read message reports" on public.message_reports;
create policy "Reporters and moderators read message reports" on public.message_reports for select to authenticated
using (reporter_id = (select auth.uid()) or (select private.is_moderator()));
drop policy if exists "Moderators review message reports" on public.message_reports;
create policy "Moderators review message reports" on public.message_reports for update to authenticated
using ((select private.is_moderator())) with check ((select private.is_moderator()));

create or replace function private.enforce_direct_message_rate_limit()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext(new.sender_id::text)::bigint);
  if exists (select 1 from public.direct_messages m where m.sender_id = new.sender_id and m.created_at > now() - interval '1500 milliseconds') then
    raise exception 'Please wait before sending another private message.';
  end if;
  if (select count(*) from public.direct_messages m where m.sender_id = new.sender_id and m.created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Private message rate limit reached. Try again shortly.';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_direct_message_rate_limit() from public, anon, authenticated;
drop trigger if exists direct_message_rate_limit on public.direct_messages;
create trigger direct_message_rate_limit before insert on public.direct_messages for each row execute function private.enforce_direct_message_rate_limit();

create or replace function private.enforce_community_chat_rate_limit()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext(new.author_id::text)::bigint);
  if exists (select 1 from public.community_messages m where m.author_id = new.author_id and m.created_at > now() - interval '1 second') then
    raise exception 'Please wait before sending another chat message.';
  end if;
  if (select count(*) from public.community_messages m where m.author_id = new.author_id and m.created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Community chat rate limit reached. Try again shortly.';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_community_chat_rate_limit() from public, anon, authenticated;
drop trigger if exists community_chat_rate_limit on public.community_messages;
create trigger community_chat_rate_limit before insert on public.community_messages for each row execute function private.enforce_community_chat_rate_limit();
