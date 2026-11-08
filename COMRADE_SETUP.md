# The Comrade Community setup

The community is served at /sectorx83 inside the Sectorx83 Vercel application. The portfolio routes remain intact.

## Dedicated backend

Create a separate Supabase project for this community. Do not reuse the EDITH X1 database.

Run the SQL in supabase/migrations/20261108000000_comrade_community.sql in the new project's SQL Editor. It creates profiles, posts, comments, reports and suspensions, with RLS enabled.

## Vercel environment

Set these variables for Production, Preview and Development:

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Use the community project's URL and publishable key. Never expose a service-role or secret key in browser code. Redeploy after setting variables.

## Admin function

Deploy supabase/functions/manage-member-role/index.ts as manage-member-role with JWT verification enabled. Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the Edge Function runtime. The function allows only the production Sectorx83 origin and the configured main-branch preview origin; update its explicit origin allowlist if the trusted domain changes.

Only a caller whose trusted Auth app_metadata role is admin can list accounts or change roles. The service-role key stays inside the Edge Function.

## First administrator

1. Register your account at https://sectorx83.vercel.app/sectorx83.
2. Confirm your email if confirmation is enabled.
3. In the Supabase SQL Editor, replace the email below with your registered account and run:

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'YOUR_ACCOUNT_EMAIL';

4. Sign out and sign in again to refresh the trusted role claim.

Never use user-editable user_metadata for authorization.

## Auth settings and checks

Set the Supabase Site URL to https://sectorx83.vercel.app and allow the production and preview redirect URLs you use. Keep email/password authentication enabled.

Test normal registration, email confirmation, sign-in, profile creation, posting, comments, reports and member directory access. Membership does not collect gender or use gender as an eligibility rule. Then verify a normal member cannot publish announcements, ban users, review other members' reports or change roles. Test the administrator and moderator flows, then run Supabase Security and Performance Advisors before opening registration publicly.
