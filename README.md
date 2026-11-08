# Sectorx83

**A member network for independent thinkers, builders and considered discussion.**

[Open the live network](https://sectorx83.vercel.app) · [Repository](https://github.com/sectorx83/Sectorx83)

## The platform

Sectorx83 is a community website with a single root entry point. It is not a developer portfolio.

- **Dispatches:** member posts, announcements and discussion.
- **Community Chat:** a separate realtime room for short-form conversation.
- **Members:** searchable member register and public profiles.
- **Command Desk:** moderator and administrator tools, protected by server-side role checks.
- **Guided introduction:** first-visit walkthrough with replay support.

The visual system uses aged ivory, matte black, crimson and antique gold, with a Soviet-inspired emblem and a classical Themis motif.

## Stack

- React 18 and TypeScript
- Vite
- Supabase Auth, Postgres, Row Level Security and Realtime
- Vercel deployment

## Local development

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

## Supabase setup

Configure the Supabase URL and publishable key in the Vercel project environment. Apply the migrations in `supabase/migrations` and deploy the `manage-member-role` Edge Function. See [SECTORX83_SETUP.md](./SECTORX83_SETUP.md) for setup and security procedures.

The member interface is served from `/`. Legacy `/sectorx83` and portfolio project paths redirect to the root.
