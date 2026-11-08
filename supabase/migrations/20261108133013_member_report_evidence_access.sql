drop policy if exists "Moderators read reported direct messages" on public.direct_messages;
create policy "Moderators read reported direct messages" on public.direct_messages
for select to authenticated using (
  (select private.is_moderator())
  and exists (select 1 from public.message_reports r where r.message_id = direct_messages.id)
);