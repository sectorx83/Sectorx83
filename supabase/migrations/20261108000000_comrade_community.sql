create extension if not exists pgcrypto;
create schema if not exists private;

create or replace function private.is_moderator()
returns boolean language sql stable set search_path = ''
as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' in ('admin','moderator'), false); $$;
create or replace function private.is_admin()
returns boolean language sql stable set search_path = ''
as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false); $$;
grant usage on schema private to authenticated;
grant execute on function private.is_moderator() to authenticated;
grant execute on function private.is_admin() to authenticated;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (char_length(username) between 3 and 32),
 display_name text not null check (char_length(display_name) between 1 and 48),
 bio text check (char_length(coalesce(bio,'')) <= 240),
 created_at timestamptz not null default now()
);
create table if not exists public.posts (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 body text not null check (char_length(body) between 1 and 10000),
 category text not null default 'GENERAL' check (category in ('GENERAL','CURRENT AFFAIRS','DISCUSSION')),
 is_announcement boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.comments (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.posts(id) on delete cascade,
 author_id uuid not null references public.profiles(id) on delete cascade,
 body text not null check (char_length(body) between 1 and 3000),
 created_at timestamptz not null default now()
);
create table if not exists public.banned_members (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 banned_by uuid not null references public.profiles(id),
 reason text not null default 'Community rules violation' check (char_length(reason) <= 500),
 created_at timestamptz not null default now()
);
create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references public.profiles(id) on delete cascade,
 post_id uuid references public.posts(id) on delete cascade,
 comment_id uuid references public.comments(id) on delete cascade,
 reason text not null check (char_length(reason) between 5 and 1000),
 status text not null default 'open' check (status in ('open','reviewed','resolved')),
 reviewed_by uuid references public.profiles(id),
 reviewed_at timestamptz,
 created_at timestamptz not null default now(),
 constraint reports_single_target check ((post_id is not null) <> (comment_id is not null))
);
create index if not exists posts_created_idx on public.posts(created_at desc);
create index if not exists comments_post_idx on public.comments(post_id,created_at);
create index if not exists reports_status_idx on public.reports(status,created_at desc);
create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists comments_author_idx on public.comments(author_id);
create index if not exists banned_members_banned_by_idx on public.banned_members(banned_by);
create index if not exists reports_comment_idx on public.reports(comment_id);
create index if not exists reports_post_idx on public.reports(post_id);
create index if not exists reports_reporter_idx on public.reports(reporter_id);
create index if not exists reports_reviewed_by_idx on public.reports(reviewed_by);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.banned_members enable row level security;
alter table public.reports enable row level security;

grant select on public.profiles to authenticated;
grant update(display_name,bio) on public.profiles to authenticated;
grant select,insert,update,delete on public.posts to authenticated;
grant select,insert,delete on public.comments to authenticated;
grant select,insert,delete on public.banned_members to authenticated;
grant select,insert,update on public.reports to authenticated;

create policy "Members read profiles" on public.profiles for select to authenticated using (true);
create policy "Members update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "Members read posts" on public.posts for select to authenticated using (true);
create policy "Members create discussions" on public.posts for insert to authenticated with check (
 author_id = (select auth.uid())
 and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))
 and (not is_announcement or (select private.is_moderator()))
);
create policy "Authors and moderators update posts" on public.posts for update to authenticated
using ((author_id = (select auth.uid()) and not is_announcement and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))) or (select private.is_moderator()))
with check ((author_id = (select auth.uid()) and not is_announcement and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))) or (select private.is_moderator()));
create policy "Authors and moderators delete posts" on public.posts for delete to authenticated
using ((author_id = (select auth.uid()) and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))) or (select private.is_moderator()));

create policy "Members read comments" on public.comments for select to authenticated using (true);
create policy "Members create comments" on public.comments for insert to authenticated with check (
 author_id = (select auth.uid()) and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))
);
create policy "Authors and moderators delete comments" on public.comments for delete to authenticated
using ((author_id = (select auth.uid()) and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))) or (select private.is_moderator()));

create policy "Members see own ban status" on public.banned_members for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_moderator()));
create policy "Admins add bans" on public.banned_members for insert to authenticated
with check ((select private.is_admin()) and banned_by = (select auth.uid()));
create policy "Admins remove bans" on public.banned_members for delete to authenticated using ((select private.is_admin()));

create policy "Members file reports" on public.reports for insert to authenticated with check (reporter_id = (select auth.uid()));
create policy "Reporters and moderators read reports" on public.reports for select to authenticated
using (reporter_id = (select auth.uid()) or (select private.is_moderator()));
create policy "Moderators review reports" on public.reports for update to authenticated
using ((select private.is_moderator())) with check ((select private.is_moderator()));

create or replace function private.handle_new_comrade()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
 raw_name text;
 safe_name text;
 display text;
begin
 raw_name := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username',''), '[^a-zA-Z0-9_]', '', 'g'));
 display := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name','Community member')),48);
 if char_length(raw_name) < 3 then raw_name := 'member'; end if;
 safe_name := left(raw_name,24);
 if exists (select 1 from public.profiles p where p.username = safe_name) then
   safe_name := left(safe_name,24) || '_' || left(replace(new.id::text,'-',''),6);
 end if;
 insert into public.profiles(id,username,display_name)
 values(new.id,safe_name,coalesce(nullif(display,''),'Community member'))
 on conflict(id) do nothing;
 return new;
end;
$$;
revoke all on function private.handle_new_comrade() from public,anon,authenticated;
drop trigger if exists on_auth_user_created_comrade on auth.users;
create trigger on_auth_user_created_comrade after insert on auth.users for each row execute function private.handle_new_comrade();
