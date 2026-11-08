-- Private client-side encrypted vault. Plaintext and passphrases never reach Postgres.
create table if not exists public.cipher_vault (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Sealed note' check (char_length(label) between 1 and 60),
  ciphertext text not null check (char_length(ciphertext) <= 50000),
  iv text not null,
  salt text not null,
  created_at timestamptz not null default now()
);
create index if not exists cipher_vault_owner_created_idx on public.cipher_vault(owner_id, created_at desc);
alter table public.cipher_vault enable row level security;
grant select, insert, delete on public.cipher_vault to authenticated;
create policy "Members read own cipher entries" on public.cipher_vault
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "Members create own cipher entries" on public.cipher_vault
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Members delete own cipher entries" on public.cipher_vault
  for delete to authenticated using (owner_id = (select auth.uid()));
