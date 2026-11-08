create index if not exists member_blocks_blocked_id_idx on public.member_blocks(blocked_id);
create index if not exists message_reports_message_id_idx on public.message_reports(message_id);
create index if not exists message_reports_reviewed_by_idx on public.message_reports(reviewed_by);

drop policy if exists "Participants can read direct messages" on public.direct_messages;
drop policy if exists "Moderators read reported direct messages" on public.direct_messages;
create policy "Participants and moderators read permitted direct messages" on public.direct_messages
for select to authenticated using (
  (select auth.uid()) = sender_id
  or (select auth.uid()) = recipient_id
  or (
    (select private.is_moderator())
    and exists (select 1 from public.message_reports r where r.message_id = direct_messages.id)
  )
);