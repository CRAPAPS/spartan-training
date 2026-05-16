# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on port 7473 (Turbopack)
npm run build        # Production build
npm run type-check   # tsc --noEmit (run before every commit)
npm run lint         # ESLint
npm run db:generate-types  # Regenerate src/types/supabase.ts from live schema
```

No test suite exists. Type-check is the primary correctness gate.

## Architecture

### Stack
Next.js 16 App Router · Supabase Cloud (Postgres + Auth + Storage) · Docker + Nginx on Hostinger KVM · GitHub Actions CI/CD (push to `main` → build → GHCR → SSH deploy).

### Supabase client pattern — critical
The `sb_publishable_*` key format **silently breaks PostgREST** (all queries return null). **Every server-side DB query must use `supabaseAdmin`** (service role) from `src/lib/supabaseServer.ts`. The session-aware client (`createServerSupabaseClient`) is only used for `supabase.auth.getUser()`.

```ts
// Always:
import { supabaseAdmin, createServerSupabaseClient } from '@/lib/supabaseServer';
const supabase = await createServerSupabaseClient(); // auth only
const { data } = await supabaseAdmin.from('table')...  // all data
```

Never use `createClient` from `src/lib/supabaseClient.ts` (browser anon key) for server-side data fetches.

### Database schema (key tables)
| Table | Purpose |
|-------|---------|
| `mjm_modules` | Course module registry. Has `track` column (`armed-security`, `unarmed-security`, `private-detective`), `sequence_order`, `passing_score`, `critical_question_ids[]`, `scorm_course_id` |
| `module_lessons` | JSONB `slides` array per module. Slide schema defined in `src/types/lesson.ts` |
| `operators` | User profiles with `role`: `super_admin` / `coordinator` / `admin` / `agent` |
| `operator_progress` | Per-operator per-module progress. `upsert` on `(operator_id, module_id)` |
| `quiz_questions` | MCQ per module. `is_critical` = Critical Fail question |
| `quiz_sessions` | Every quiz attempt with `behavioral_data` JSONB timeline |
| `operator_leaderboard` | View — efficiency metrics |

### Role hierarchy
`super_admin` > `coordinator` > `admin` > `agent`. Privileged roles (admin+) bypass sequential module gating. Application-level gate is in each module page — do not rely on RLS alone.

### Slide types (`src/types/lesson.ts`)
Four types: `slide` | `scenario` | `checklist` | `video`. Each may have `narrationUrl` pointing to Supabase Storage `lesson-narrations/{moduleId}/{slideIndex}.mp3` (zero-indexed).

TTS voice convention: `narrate-all.mjs` (in repo root) handles batch generation. Voices rotate by module — Eric (MOD-02/05/08/11/14), Bella (MOD-03/06/09/12/15), Brian (MOD-04/07/10/13/16). Scenarios always use Bella; checklists always use Brian.

### Auth flow
Middleware (`src/middleware.ts`) guards `/dashboard/*` — redirects unauthenticated users to `/sign-in`. Module sequential gating is enforced in `src/app/dashboard/module/[id]/page.tsx` by checking `operator_progress.is_competent` for the previous module.

### Exam integrity (`src/app/dashboard/module/[id]/quiz/`)
- Fisher-Yates shuffle on load; `originalKey` bridges back to correct answer for grading
- 90-second per-question countdown, auto-submit on timeout
- Tab/focus loss: 3 strikes → auto-submit
- Critical Fail: wrong answer on `is_critical` question → 24-hour cooldown (`CooldownScreen`)
- All grading in API route (`/api/quiz/[moduleId]`) — never client-side

### Key API routes
| Route | Purpose |
|-------|---------|
| `POST /api/quiz/[moduleId]` | Grade quiz, write `operator_progress`, trigger critical-fail email |
| `POST /api/lesson/[moduleId]/progress` | Save slide position to `scorm_data` JSONB |
| `POST /api/admin/lesson/[moduleId]/narration/[slideIndex]` | Generate TTS or upload MP3; patches `narrationUrl` into slide JSONB |
| `POST /api/stripe/webhook` | Stripe enrollment webhook |
| `POST /api/scorm/complete` | SCORM Cloud completion callback → `hardGate.ts` |

### Adding a new course track
1. Add module rows to `mjm_modules` with `track = 'your-track-id'` and sequential `sequence_order`
2. Add slide content to `module_lessons` as a JSONB `slides` array
3. Add quiz questions to `quiz_questions` with `module_id` and `is_critical` flags
4. Run `node narrate-all.mjs` from `spartan-app/` to generate narration (skips already-narrated slides)
5. Update `src/app/curriculum/page.tsx` TRACKS array and public curriculum page

### Design tokens
Spartan Gold: `--brass: #C5A059`. UI components are in `src/components/primitives/` (`BrassButton`, `MonoLabel`, `Lockup`, `Rule`). Global CSS tokens in `src/app/globals.css`. No Tailwind — all styles are inline or via CSS variables.

### Deployment
- Prod: `spartantraining.live` (Hostinger KVM, IP 2.24.73.222, Docker on port 7473, Nginx reverse proxy)
- Push to `main` → GitHub Actions builds Docker image → pushes to GHCR → SSH deploys
- `.env.local` is not committed. `SUPABASE_SERVICE_ROLE_KEY` and `ELEVENLABS_API_KEY` must also be in GitHub Secrets
