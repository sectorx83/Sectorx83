create index if not exists community_events_created_by_idx on public.community_events(created_by);
create index if not exists community_messages_author_idx on public.community_messages(author_id);
create index if not exists community_resources_created_by_idx on public.community_resources(created_by);
create index if not exists moderation_audit_actor_idx on public.moderation_audit_log(actor_id);
create index if not exists moderation_audit_target_idx on public.moderation_audit_log(target_user_id);
create index if not exists notifications_actor_idx on public.notifications(actor_id);

drop policy if exists "Moderators manage community events" on public.community_events;
create policy "Moderators create community events" on public.community_events
for insert to authenticated with check ((select private.is_moderator()) and created_by = (select auth.uid()));
create policy "Moderators update community events" on public.community_events
for update to authenticated using ((select private.is_moderator()))
with check ((select private.is_moderator()) and created_by = (select auth.uid()));
create policy "Moderators delete community events" on public.community_events
for delete to authenticated using ((select private.is_moderator()));

drop policy if exists "Moderators manage community resources" on public.community_resources;
create policy "Moderators create community resources" on public.community_resources
for insert to authenticated with check ((select private.is_moderator()) and created_by = (select auth.uid()));
create policy "Moderators update community resources" on public.community_resources
for update to authenticated using ((select private.is_moderator()))
with check ((select private.is_moderator()) and created_by = (select auth.uid()));
create policy "Moderators delete community resources" on public.community_resources
for delete to authenticated using ((select private.is_moderator()));
