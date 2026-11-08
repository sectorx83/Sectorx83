create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists community_messages_created_idx
  on public.community_messages(created_at desc);

alter table public.community_messages enable row level security;

grant select, insert on public.community_messages to authenticated;

create policy "Members read community chat"
  on public.community_messages
  for select to authenticated
  using (true);

create policy "Members send community chat messages"
  on public.community_messages
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and not exists (
      select 1 from public.banned_members b
      where b.user_id = (select auth.uid())
    )
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_messages'
  ) then
    alter publication supabase_realtime add table public.community_messages;
  end if;
end
$$;
