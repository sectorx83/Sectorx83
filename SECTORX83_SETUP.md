# Sectorx83 community setup

The community is served at /sectorx83 inside the Sectorx83 Vercel application. The portfolio routes remain intact.

## Dedicated backend

Create a separate Supabase project for this community. Do not reuse the EDITH X1 database.

Apply the migrations in order: `20261108000000_comrade_community.sql`, `20261108000002_cipher_vault.sql`, then `20261108000003_order_classifications.sql`. They create member records, dispatches, comments, reports, suspensions and the private cipher vault, with row-level security enabled.

## Vercel environment

Set these variables for Production, Preview and Development:

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Use the community project's URL and publishable key. Never expose a service-role or secret key in browser code. Redeploy after setting variables.

## Admin function

Deploy supabase/functions/manage-member-role/index.ts as manage-member-role with JWT verification enabled. Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the Edge Function runtime. The function allows only the production Sectorx83 origin and the configured main-branch preview origin; update its explicit origin allowlist if the trusted domain changes.

Only a caller whose trusted Auth `app_metadata.role` is `admin` can list accounts or change roles. The service-role key stays inside the Edge Function. The Steward Desk is visible to members but its controls remain restricted by server-side role checks and database RLS.

## First administrator

1. Register your account at https://sectorx83.vercel.app/sectorx83.
2. Confirm your email if confirmation is enabled.
3. In the Supabase SQL Editor, replace the email below with your registered account and run:

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'YOUR_ACCOUNT_EMAIL';

4. Sign out and sign in again to refresh the trusted role claim.

Never use user-editable `user_metadata` for authorization. There is no shared admin password in frontend code; administration uses trusted Auth roles.

## Auth settings and checks

Set the Supabase Site URL to https://sectorx83.vercel.app and allow the production and preview redirect URLs you use. Keep email/password authentication enabled.

## Encryption model

- All browser-to-Supabase traffic uses HTTPS/TLS.
- Supabase manages database/storage encryption at rest.
- Cipher Vault entries are encrypted in the browser with AES-256-GCM. A per-entry random salt and IV are used, with a PBKDF2-SHA-256 key derived from the member's passphrase (310,000 iterations). Passphrases and plaintext are not uploaded. Losing a passphrase makes that entry unrecoverable.
- The shared Chamber feed, comments and member profiles are not end-to-end encrypted. Do not describe them as E2EE. Group E2EE would require a separate member key-distribution and device-recovery design.

Test normal registration, email confirmation, sign-in, profile creation, posting, comments, reports, member directory access and cipher-vault seal/unseal/delete. Membership does not collect gender or use gender as an eligibility rule. Then verify a normal member cannot publish announcements, ban users, review other members' reports or change roles. Test the administrator and moderator flows, then run Supabase Security and Performance Advisors before opening registration publicly.
