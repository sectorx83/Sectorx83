alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists location text check (char_length(coalesce(location,'')) <= 80),
  add column if not exists website_url text,
  add column if not exists skills text[] not null default '{}',
  add column if not exists interests text[] not null default '{}';

alter table public.profiles
  drop constraint if exists profiles_avatar_url_check,
  add constraint profiles_avatar_url_check check (avatar_url is null or avatar_url ~ '^https://'),
  drop constraint if exists profiles_website_url_check,
  add constraint profiles_website_url_check check (website_url is null or website_url ~ '^https://'),
  drop constraint if exists profiles_skills_count_check,
  add constraint profiles_skills_count_check check (cardinality(skills) <= 12),
  drop constraint if exists profiles_interests_count_check,
  add constraint profiles_interests_count_check check (cardinality(interests) <= 12);

grant update(display_name,bio,avatar_url,location,website_url,skills,interests) on public.profiles to authenticated;

alter table public.direct_messages add column if not exists read_at timestamptz;
grant update(read_at) on public.direct_messages to authenticated;
drop policy if exists "Recipients mark direct messages read" on public.direct_messages;
create policy "Recipients mark direct messages read" on public.direct_messages
for update to authenticated using (recipient_id = (select auth.uid()))
with check (recipient_id = (select auth.uid()));

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  kind text not null check (kind in ('direct_message','comment')),
  entity_id uuid not null,
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 240),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists notifications_user_created_idx on public.notifications(user_id,created_at desc);
alter table public.notifications enable row level security;
grant select on public.notifications to authenticated;
grant update(read_at) on public.notifications to authenticated;
drop policy if exists "Members read own notifications" on public.notifications;
create policy "Members read own notifications" on public.notifications
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Members mark own notifications read" on public.notifications;
create policy "Members mark own notifications read" on public.notifications
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create or replace function private.notify_direct_message()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.notifications(user_id,actor_id,kind,entity_id,title,body)
  values(new.recipient_id,new.sender_id,'direct_message',new.id,'New private message',
    left(coalesce((select p.display_name from public.profiles p where p.id = new.sender_id),'A member') || ': ' || new.body,240));
  return new;
end;
$$;
revoke all on function private.notify_direct_message() from public, anon, authenticated;
drop trigger if exists direct_message_notification on public.direct_messages;
create trigger direct_message_notification after insert on public.direct_messages
for each row execute function private.notify_direct_message();

create or replace function private.notify_post_comment()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare post_author uuid;
begin
  select p.author_id into post_author from public.posts p where p.id = new.post_id;
  if post_author is not null and post_author <> new.author_id then
    insert into public.notifications(user_id,actor_id,kind,entity_id,title,body)
    values(post_author,new.author_id,'comment',new.id,'New response to your dispatch',
      left(coalesce((select p.display_name from public.profiles p where p.id = new.author_id),'A member') || ': ' || new.body,240));
  end if;
  return new;
end;
$$;
revoke all on function private.notify_post_comment() from public, anon, authenticated;
drop trigger if exists comment_notification on public.comments;
create trigger comment_notification after insert on public.comments
for each row execute function private.notify_post_comment();

create table if not exists public.moderation_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('member_banned','member_unbanned','report_reviewed')),
  details text not null default '' check (char_length(details) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists moderation_audit_created_idx on public.moderation_audit_log(created_at desc);
alter table public.moderation_audit_log enable row level security;
grant select on public.moderation_audit_log to authenticated;
drop policy if exists "Moderators read moderation audit" on public.moderation_audit_log;
create policy "Moderators read moderation audit" on public.moderation_audit_log
for select to authenticated using ((select private.is_moderator()));

create or replace function private.audit_ban_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.moderation_audit_log(actor_id,target_user_id,action,details)
    values(new.banned_by,new.user_id,'member_banned',new.reason);
    return new;
  end if;
  insert into public.moderation_audit_log(actor_id,target_user_id,action,details)
  values(auth.uid(),old.user_id,'member_unbanned','Suspension lifted');
  return old;
end;
$$;
revoke all on function private.audit_ban_change() from public, anon, authenticated;
drop trigger if exists audit_banned_member_change on public.banned_members;
create trigger audit_banned_member_change after insert or delete on public.banned_members
for each row execute function private.audit_ban_change();

create or replace function private.audit_report_review()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if old.status is distinct from new.status then
    insert into public.moderation_audit_log(actor_id,target_user_id,action,details)
    values(new.reviewed_by,new.reporter_id,'report_reviewed','Report ' || old.status || ' → ' || new.status);
  end if;
  return new;
end;
$$;
revoke all on function private.audit_report_review() from public, anon, authenticated;
drop trigger if exists audit_report_review on public.reports;
create trigger audit_report_review after update of status on public.reports
for each row execute function private.audit_report_review();

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 3000),
  starts_at timestamptz not null,
  location text not null default 'Online' check (char_length(location) <= 160),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists community_events_starts_idx on public.community_events(starts_at);
alter table public.community_events enable row level security;
grant select,insert,update,delete on public.community_events to authenticated;
drop policy if exists "Members read community events" on public.community_events;
create policy "Members read community events" on public.community_events
for select to authenticated using (true);
drop policy if exists "Moderators manage community events" on public.community_events;
create policy "Moderators manage community events" on public.community_events
for all to authenticated using ((select private.is_moderator()))
with check ((select private.is_moderator()) and created_by = (select auth.uid()));

create table if not exists public.community_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  url text not null check (url ~ '^https://'),
  category text not null default 'REFERENCE' check (category in ('REFERENCE','DOCUMENT','GUIDE','POLICY')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists community_resources_created_idx on public.community_resources(created_at desc);
alter table public.community_resources enable row level security;
grant select,insert,update,delete on public.community_resources to authenticated;
drop policy if exists "Members read community resources" on public.community_resources;
create policy "Members read community resources" on public.community_resources
for select to authenticated using (true);
drop policy if exists "Moderators manage community resources" on public.community_resources;
create policy "Moderators manage community resources" on public.community_resources
for all to authenticated using ((select private.is_moderator()))
with check ((select private.is_moderator()) and created_by = (select auth.uid()));
