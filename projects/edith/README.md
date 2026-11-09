# EDITH X1

**Status:** Live application  
**Category:** AI / Assistant platform  
**Repository:** https://github.com/sectorx83/edithx1  
**Live app:** https://www.edithx1.vercel.app

EDITH X1 is a multi-user AI assistant web application built with React, TypeScript, TanStack Start, Vite, and Supabase. It brings conversational AI, voice interaction, configurable behavior, and connected workflows into one interface.

## Product structure

| Area | Responsibility |
| --- | --- |
| Web application | Responsive multi-user chat experience |
| Sessions | Anonymous and authenticated session flows |
| AI provider | Groq-backed chat through server-side credentials |
| Voice | Voice input and speech playback, subject to browser/device support |
| Configuration | Adjustable assistant behavior |
| EDITH NETWORK | Execution layer for connected workflows |
| Backend services | Supabase-backed application services |

## Current capabilities

- AI chat with automatic anonymous sessions.
- Voice input and local speech playback.
- Configurable assistant behavior.
- EDITH NETWORK execution layer.
- Groq-backed chat using server-side credentials.

## Security and operational notes

Provider credentials must remain server-side and must never be exposed through client-side environment variables. Connected integrations should use explicit permissions and return clear execution feedback. A live application does not mean every external integration is enabled by default.

## Setup

Use the upstream repository's Setup Guide for Supabase configuration, Groq setup, local development, testing, and deployment. The upstream repository is the source of truth for current environment variable names and deployment steps.

## Next engineering focus

Continue improving voice reliability, integration permissions, and transparent execution feedback across connected workflows.
