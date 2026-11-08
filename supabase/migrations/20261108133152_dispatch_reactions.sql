create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('support','insightful')),
  created_at timestamptz not null default now(),
  unique(post_id,user_id)
);
create index if not exists post_reactions_post_idx on public.post_reactions(post_id);
alter table public.post_reactions enable row level security;
grant select,insert,delete on public.post_reactions to authenticated;
drop policy if exists "Members read post reactions" on public.post_reactions;
create policy "Members read post reactions" on public.post_reactions for select to authenticated using (true);
drop policy if exists "Members react to posts" on public.post_reactions;
create policy "Members react to posts" on public.post_reactions for insert to authenticated
with check (user_id = (select auth.uid()) and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid())));
drop policy if exists "Members remove own post reactions" on public.post_reactions;
create policy "Members remove own post reactions" on public.post_reactions for delete to authenticated
using (user_id = (select auth.uid()));