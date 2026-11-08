# Sectorx83 community setup

Sectorx83 is served as the website root at https://sectorx83.vercel.app. There is no separate portfolio route or community subdirectory.

## Dedicated backend

Create a separate Supabase project for this community. Do not reuse the EDITH X1 database.

Apply the core community migrations in order: `20261108000000_comrade_community.sql`, `20261108000003_order_classifications.sql`, `20261108124357_community_chat.sql`, the `private_member_direct_messages` migration, `20261108132241_member_experience_upgrade.sql` and `20261108132542_member_experience_policy_indexes.sql`, `20261108132707_notification_realtime.sql` `20261108132807_member_safety_controls.sql` `20261108132939_member_block_enforcement_and_audit.sql` `20261108133013_member_report_evidence_access.sql` `20261108133110_direct_message_policy_consolidation.sql` and `20261108133152_dispatch_reactions.sql`. The member-experience migration adds profile metadata (avatar URL, location, website, skills and interests), recipient-only read receipts, private notifications for direct messages and dispatch responses, moderator-managed events and a resource library, plus a moderator-only audit trail for suspensions and report reviews. The safety migration adds member blocking, direct-message reports and database-enforced rate limits for private and public chat. New tables have row-level security enabled; notification and audit rows are written by restricted database triggers rather than client-side inserts.

The legacy Cipher Vault database migration/table may remain in an existing Supabase project for historical data compatibility, but the feature has been removed from the website and is no longer queried by the application. Do not drop the table unless you have independently confirmed that no retained records are needed.

## Vercel environment

Set these variables for Production, Preview and Development:

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Use the community project's URL and publishable key. Never expose a service-role or secret key in browser code. Redeploy after setting variables.

## Admin function

Deploy `supabase/functions/manage-member-role/index.ts` as `manage-member-role` with JWT verification enabled. Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the Edge Function runtime. The function allows only the production Sectorx83 origin and the configured main-branch preview origin; update its explicit origin allowlist if the trusted domain changes.

Only a caller whose trusted Auth `app_metadata.role` is `admin` can list accounts or change roles. The service-role key stays inside the Edge Function. The Command Desk is shown only to authorised moderators and administrators, and privileged actions remain restricted by server-side role checks and database RLS.

## First administrator

1. Register at https://sectorx83.vercel.app.
2. Confirm your email if confirmation is enabled.
3. In the Supabase SQL Editor, replace the email below with your registered account and run:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'YOUR_ACCOUNT_EMAIL';
```

4. Sign out and sign in again to refresh the trusted role claim.

Never use user-editable `user_metadata` for authorization. There is no shared admin password in frontend code; administration uses trusted Auth roles.

## Auth settings and checks

Set the Supabase Site URL to https://sectorx83.vercel.app and allow the production and preview redirect URLs you use. Keep email/password authentication enabled.

Test normal registration, sign-in, profile creation, posting, comments, reports, member directory access and community chat. For direct messaging, test with two ordinary member accounts: start a conversation from the member register, send messages in both directions, refresh the page and verify history persists. Confirm a third account cannot query either participant's messages, and confirm a suspended account cannot send a direct message. Verify a normal member cannot publish announcements, ban users, review other members' reports or change roles. Test the administrator and moderator flows, then run Supabase Security and Performance Advisors before opening registration publicly.


## Member experience features

- Members can maintain a public profile with an HTTPS avatar image, location, website, skills and interests. Skills and interests are comma-separated, with up to 12 entries each.
- The member register searches profile text and skills, and supports sorting by newest or name. Dispatches support member reactions (support or insightful); members can only change their own reaction.
- Direct messages expose recipient-only read receipts. Opening a conversation marks incoming messages read.
- The Notifications tab shows alerts for new direct messages and replies to a member's dispatches. Notification rows are visible only to their owner.
- Moderators can publish upcoming events and add HTTPS references to the resource library. Members can read these resources; only moderators can manage them.
- The Command Desk displays a database-generated audit trail for bans, unbans and report status changes. Audit records are readable only by moderators.

After applying the member-experience migration, test profile edits, search by skill/location, direct-message read receipts with two accounts, notification ownership and live delivery, block enforcement, direct-message reporting and moderator access to reported message evidence only, chat rate limits, moderator-only event/resource management, and audit visibility from both a moderator and an ordinary member account.