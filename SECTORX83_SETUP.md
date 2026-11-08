# Sectorx83 community setup

Sectorx83 is served as the website root at https://sectorx83.vercel.app. There is no separate portfolio route or community subdirectory.

## Dedicated backend

Create a separate Supabase project for this community. Do not reuse the EDITH X1 database.

Apply the core community migrations in order: `20261108000000_comrade_community.sql` and `20261108000003_order_classifications.sql`. They create member records, dispatches, comments, reports and suspensions with row-level security enabled.

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

Test normal registration, sign-in, profile creation, posting, comments, reports, member directory access and community chat. Verify a normal member cannot publish announcements, ban users, review other members' reports or change roles. Test the administrator and moderator flows, then run Supabase Security and Performance Advisors before opening registration publicly.
