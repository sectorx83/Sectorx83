create or replace function private.is_member_blocked(first_member uuid, second_member uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.member_blocks b
    where (b.blocker_id = first_member and b.blocked_id = second_member)
       or (b.blocker_id = second_member and b.blocked_id = first_member)
  );
$$;
revoke all on function private.is_member_blocked(uuid,uuid) from public, anon;
grant execute on function private.is_member_blocked(uuid,uuid) to authenticated;

drop policy if exists "Members can send direct messages" on public.direct_messages;
create policy "Members can send direct messages" on public.direct_messages for insert to authenticated
with check (
  sender_id = (select auth.uid()) and sender_id <> recipient_id
  and not exists (select 1 from public.banned_members b where b.user_id = (select auth.uid()))
  and not private.is_member_blocked(sender_id,recipient_id)
);

revoke update on public.message_reports from authenticated;
grant update(status,reviewed_by,reviewed_at) on public.message_reports to authenticated;

alter table public.moderation_audit_log drop constraint if exists moderation_audit_log_action_check;
alter table public.moderation_audit_log add constraint moderation_audit_log_action_check
check (action in ('member_banned','member_unbanned','report_reviewed','message_report_reviewed'));

create or replace function private.audit_message_report_review()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare message_sender uuid;
begin
  if old.status is distinct from new.status then
    select m.sender_id into message_sender from public.direct_messages m where m.id = new.message_id;
    insert into public.moderation_audit_log(actor_id,target_user_id,action,details)
    values(new.reviewed_by,message_sender,'message_report_reviewed','Private message report ' || old.status || ' → ' || new.status);
  end if;
  return new;
end;
$$;
revoke all on function private.audit_message_report_review() from public, anon, authenticated;
drop trigger if exists audit_message_report_review on public.message_reports;
create trigger audit_message_report_review after update of status on public.message_reports
for each row execute function private.audit_message_report_review();
