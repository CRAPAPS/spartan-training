# SPARTAN TRAINING — PLATFORM READINESS REPORT
**Issued by:** Sheldon L. Kuhn, CISO / Platform Director — SHEL INFOSEC  
**Date:** 2026-05-01  
**Classification:** Confidential — Partner Distribution  
**Platform Version:** v1.3 (Build 2026.05)  
**Status:** DEVELOPMENT COMPLETE · CONTENT LOAD IN PROGRESS · PRODUCTION PENDING

---

## EXECUTIVE SUMMARY

Spartan Training is a fully custom Learning Management System purpose-built for the **MJM 2026 Armed Security Accreditation** — the Georgia 16-hour GBPDSA minimum training standard. The platform is functionally complete. Every major system — authentication, module sequencing, quiz engine, admin tooling, forensic audit, payment enrollment, and role-based access control — has been built, tested in development, and is ready for content and production deployment.

**What is done:** The platform itself. Every screen, every feature, every security gate.  
**What remains:** Content (Colossyan videos), Stripe keys, and the go-live deployment.

---

## SECTION 1 — BUILD STATUS MATRIX

| System | Feature | Status | Notes |
|---|---|---|---|
| **Authentication** | Email sign-in via Supabase Auth | ✅ Live | |
| | TOTP MFA (two-factor) | ✅ Live | Per-operator, settings-controlled |
| | Password recovery / reset | ✅ Live | Magic link via Supabase |
| | Session management + middleware guards | ✅ Live | All dashboard routes protected |
| **Enrollment** | Public enrollment form | ✅ Live | Multi-step stepper |
| | Stripe Checkout integration | ✅ Built | Keys pending (Sheldon) |
| | Auto-account creation on payment | ✅ Built | Stripe webhook → Supabase |
| | Magic link email to new enrollee | ✅ Built | Via Supabase Auth |
| **Curriculum Engine** | 16-module curriculum loaded | ✅ Live | All titles, descriptions, pass scores |
| | Hard Gate sequencing (DB-level) | ✅ Live | RLS policy — cannot be bypassed |
| | Module unlock on competency | ✅ Live | `is_competent = true` triggers unlock |
| | SCORM Cloud iframe player | ✅ Built | Awaiting SCORM packages from MAK |
| | SCORM completion webhook | ✅ Built | `/api/scorm/complete` route handler |
| **Quiz Engine** | Multiple-choice quiz system | ✅ Live | 4 options, instant grading |
| | Per-question feedback / explanation | ✅ Live | |
| | Score calculation + competency gate | ✅ Live | Server-side only |
| | Critical Fail detection | ✅ Live | Triggers Tactical Reset |
| | Tactical Reset (module restart) | ✅ Live | Progress wiped, re-attempt required |
| | Claude AI quiz generation | ✅ Live | Gen Quiz button in Admin Panel |
| | Quiz questions loaded (MOD-01–09) | ✅ Live | 44 questions · 14 Critical Fail triggers |
| | Quiz questions (MOD-10–16) | ⏳ Pending | Use Admin Panel Gen Quiz |
| **Admin Panel** | Module editor (title, desc, score, SCORM) | ✅ Live | |
| | Quiz generator (Claude AI) | ✅ Live | |
| | Operator roster with progress heatmap | ✅ Live | |
| | Forensic audit log viewer | ✅ Live | |
| | Role management (super_admin only) | ✅ Live | |
| **Role Hierarchy** | Four-tier model | ✅ Live | super_admin / coordinator / admin / agent |
| | CSO confirmation dialog (destructive ops) | ✅ Built | Passphrase re-auth before delete actions |
| | Coordinator bypass of Hard Gate | ✅ Live | MAK + Dr. Searra see all modules |
| | Admin limited audit view | ✅ Live | Auth/enrollment events only |
| **Dashboard Pages** | Command (home) | ✅ Live | Metric strip + module table + briefing video |
| | Curriculum | ✅ Live | 16-module list with progress + gate status |
| | Library | ✅ Live | Reference documents, legal statutes |
| | Records | ✅ Live | Session history, attempt log |
| | Exams | ✅ Live | Assessment history, module heatmap |
| | Credentials | ✅ Live | Accreditation status, certificate preview |
| | Settings | ✅ Live | Profile, password change |
| | Admin Panel | ✅ Live | Elevated roles only |
| **Marketing Site** | Landing page | ✅ Live | |
| | Curriculum overview | ✅ Live | |
| | Faculty page | ✅ Live | |
| | About page | ✅ Live | |
| | Contact page | ✅ Live | |
| **Security** | Row Level Security (RLS) on all tables | ✅ Live | PostgreSQL enforced |
| | Server-side score writes only | ✅ Live | Service role key never in browser |
| | Forensic audit log (append-only) | ✅ Live | PostgreSQL trigger, no update/delete |
| | SCORM webhook HMAC-SHA256 verification | ✅ Built | |
| | Content Security Policy headers | ✅ Live | |
| | Mobile responsive | ✅ Live | All pages, 768px breakpoint |
| **Video Content** | MAK accreditation briefing video | ✅ Live | On Command dashboard |
| | Colossyan AI module videos (per module) | ⏳ Pending | MAK to produce + upload to SCORM Cloud |
| **Production** | Production deployment (KVM) | ⏳ Pending | GitHub Actions CI/CD ready |
| | SSL / TLS certificate | ⏳ Pending | certbot on KVM |
| | Domain DNS (spartan.shelinfosec.com) | ⏳ Pending | Point to KVM IP |
| **Future Phase** | Certificate PDF generation | 🔜 Next | After first cohort completes |
| | Commander email on Critical Fail | 🔜 Next | Supabase Edge Function |
| | Stripe live keys active | 🔜 Next | Sheldon to add to .env.local |

---

## SECTION 2 — SECURITY ARCHITECTURE

### 2.1 Score Integrity Model

The platform is designed so that an operator's score **cannot be manipulated** by any client-side action. Here is the enforcement chain:

1. **Quiz delivery:** Questions are served from the database. Correct answers are never included in the API response — the client sees only the question text and options.
2. **Grading:** Occurs entirely in a Next.js Route Handler (server). The client submits selected answers, the server compares against the database record, and the server writes the result.
3. **Database writes:** `operator_progress` can only be written using the `SUPABASE_SERVICE_ROLE_KEY`. This key lives exclusively in server environment variables and is never exposed to the browser.
4. **RLS enforcement:** Even if an attacker obtained the anon key, Row Level Security on `operator_progress` has no INSERT policy for operators — only service role writes are permitted.

### 2.2 Hard Gate — Database Enforcement

The module sequencing gate is **not** a UI restriction. It is enforced at the PostgreSQL RLS layer:

```
An operator's query for MOD-02 will return zero rows
unless their operator_progress record for MOD-01 has is_competent = true.
The module does not exist in the response — there is nothing to bypass.
```

The policy (`hard_gate_module_access_v2`) evaluates a JOIN against `operator_progress` before returning any module row. Elevated roles (coordinator, admin, super_admin) bypass the sequence check to support administrative review.

### 2.3 Critical Fail / Tactical Reset

When an operator answers a life-safety designated question incorrectly:
- Their `operator_progress` row for that module is set to `status = 'reset'`, `is_competent = false`
- The module must be retaken from the beginning
- The event is written to the forensic audit log with the triggering question ID
- (Future) Commander email notification fires automatically

Critical Fail questions currently designated (14 total across MOD-01–09):
- MOD-01: 2 · MOD-02: 3 · MOD-03: 3 · MOD-07: 4 · MOD-09: 2

### 2.4 Forensic Audit Log

Every significant event is written to `spartan_audit_log` by a PostgreSQL trigger function (`fn_audit_progress_change`) running as `SECURITY DEFINER`. The trigger cannot be disabled by application code. No UPDATE or DELETE policy exists on this table — entries are permanently immutable.

Events captured: `LOGIN`, `LOGOUT`, `MODULE_START`, `SCORM_COMPLETE`, `SCORE_RECORDED`, `CRITICAL_FAIL`, `TACTICAL_RESET`, `MODULE_UNLOCK`, `MFA_ENABLED`, `AUTH_FAILED`, `ENROLLMENT_COMPLETE`

### 2.5 Role Hierarchy + Access Control

| Role | Level | Access |
|---|---|---|
| `super_admin` | CISO | Full platform control. Role management, destructive operations, all data. CSO passphrase confirmation required for delete/destructive actions. |
| `coordinator` | Senior Oversight | Read-all access. Module management, quiz generation, operator roster, full audit log. Advisory on all operations. Cannot modify user roles. |
| `admin` | Administration | Account support. Limited audit view (auth + enrollment events only). Operator roster view. |
| `agent` | Field Operative | Own dashboard only. Curriculum, progress, exams, credentials. Cannot access any other operator's data. |

### 2.6 Production Security Posture (Target)

- TLS 1.3 minimum, HTTP/2, HSTS header
- Nginx reverse proxy with security headers (CSP, X-Frame-Options, Referrer-Policy)
- UFW firewall: ports 22 (key-only SSH), 80, 443 only
- Supabase service role key: never in client bundle, never in logs
- SCORM webhook: HMAC-SHA256 signature verification on every inbound payload
- Daily KVM snapshot (Hostinger panel)

---

## SECTION 3 — OPERATIONS

### 3.1 How Enrollment Works (With Stripe Live)

```
1. Operator visits public site → clicks Enroll
2. Enrollment form: name, email, state, license number, track selection
3. Stripe Checkout page loads → operator pays
4. Stripe fires checkout.session.completed webhook to /api/stripe/webhook
5. Webhook handler:
   a. Creates Supabase Auth user (email confirmed)
   b. Creates operators row (role: 'agent', operator_id: ST-26-XXXX)
   c. Sends magic link email → operator sets their password
   d. Writes ENROLLMENT_COMPLETE to audit log
6. Operator clicks magic link → lands on dashboard
7. MOD-01 is immediately accessible (Hard Gate: sequence_order = 1 always passes)
```

### 3.2 How Quiz Generation Works (Admin Panel)

```
1. Log in as coordinator / admin / super_admin
2. Admin Panel → Modules tab → find module → click Edit
3. Ensure title and description accurately reflect curriculum content
4. Click Gen Quiz → select question count (recommended: 10)
5. Claude AI (claude-opus-4-7) reads the MJM certification PDF via document context
6. Generates N questions: 4 options, correct answer, explanation, Critical Fail flag
7. Questions are saved directly to quiz_questions table
8. Admin reviews questions, marks additional Critical Fail triggers as needed
```

### 3.3 SCORM Cloud Integration — Content Production by SHEL INFOSEC

SHEL INFOSEC manages the complete content production pipeline. MAK supplies curriculum authority and source material; SHEL INFOSEC converts it to deliverable digital content.

```
PRODUCTION PIPELINE (SHEL INFOSEC)
1. Receive curriculum source material (PDF / syllabus) from MAK for each module
2. Convert to interactive Colossyan AI video content
3. Export as SCORM 1.2 .zip package
4. Upload to SCORM Cloud (rustici.com) → note courseId
5. Enter courseId into Admin Panel → Module Edit → SCORM Course ID field

OPERATOR RUNTIME (Automated)
6. Platform creates SCORM registration: format operatorId__moduleId
7. Operator clicks Start Module → SCORM iframe loads the interactive video
8. On video completion: SCORM Cloud fires webhook to /api/scorm/complete
9. Server verifies HMAC signature, evaluates score, writes operator_progress
10. If score ≥ passing_score: is_competent = true → next module unlocks
11. If Critical Fail question answered wrong: Tactical Reset fires
```

### 3.4 Certificate Generation (Future Phase)

When an operator achieves `is_competent = true` on all 16 modules:
- Credentials page displays "ACCREDITED" status with full checklist
- Certificate preview is rendered immediately in the UI
- PDF generation (via Puppeteer or react-pdf) will be triggered for official issuance
- Certificate includes: operator name, operator ID, track, completion date, GBPDSA compliance statement, total training hours (16.0 hours)

---

## SECTION 4 — FEATURE DETAIL

### 4.1 Curriculum Engine

- **16 modules** across 3 phases: Legal Framework (01–03), Technical Proficiency/Ballistics (04–06), Tactical Execution/Range Safety (07–09), General Security Operations (10–16)
- Modules are **database-seeded** with real MJM 2026 syllabus titles, descriptions, passing scores (75–85%), and duration
- The Hard Gate is invisible to the operator — locked modules simply don't appear until earned
- Each module page shows: video player (SCORM), quiz access, attempt count, score history

### 4.2 Quiz System

- Questions stored in `quiz_questions` with TEXT primary keys (`mod01-q1`, etc.)
- Fields: question, option_a/b/c/d, correct (A/B/C/D), explanation, is_critical, topic, sequence
- Current question inventory: **44 questions across MOD-01–09** (Phase 1–3 complete)
- Pending: MOD-10–16 (use Admin Panel Gen Quiz)
- Gate 1.1 questions (MOD-02, Justification of Force) are loaded **verbatim from the official syllabus**
- Critical Fail designation: life-safety questions where wrong answer triggers automatic reset

### 4.3 Admin Panel

Three tabs:

**Modules Tab:**
- Lists all 16 modules with quiz count, SCORM link status, pass score
- Edit button: update title, description, SCORM courseId, passing score, duration
- Gen Quiz button: triggers Claude AI quiz generation for that module
- Expand each module to review existing questions

**Operators Tab:**
- Full roster with operator ID, name, email, enrollment date
- Progress bar showing X/16 modules completed
- Expandable heatmap: 16 colored cells showing per-module status
- Role selector (super_admin only): change any operator's role

**Audit Log Tab:**
- Last 200 entries, newest first
- Shows: timestamp, operator ID, event type, module, score, metadata
- Color-coded by event type (CRITICAL_FAIL in red, SCORM_COMPLETE in green)

### 4.4 Dashboard Pages

| Page | Content |
|---|---|
| **Command** | Metrics (modules done, score avg, hours), module progress table, MAK briefing video |
| **Curriculum** | 16-module list with gate status, descriptions, pass scores, attempt counts |
| **Library** | Legal reference documents: OCGA 16-3-21, OCGA 43-38, GBPDSA, Graham v. Connor, etc. |
| **Records** | Session history, attempt log, score timeline |
| **Exams** | Assessment history heatmap, per-quiz results, Critical Fail log |
| **Credentials** | Accreditation status counter (X/16), module competency checklist, certificate preview |
| **Settings** | Operator profile, passphrase update |
| **Admin Panel** | Elevated roles only — full content management |

---

## SECTION 5 — PENDING ITEMS TO GO LIVE

### Critical Path (Required for Enrollment to Function)

1. **Stripe live keys** — Add to server `.env.local`:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - Configure price IDs for each track in the enrollment form

2. **Production deployment** — Point `spartan.shelinfosec.com` DNS → KVM 4 IP, then push to `main` → GitHub Actions deploys automatically

3. **SSL certificate** — Run `certbot --nginx -d spartan.shelinfosec.com` on KVM after DNS propagates

### Content Path (Required for Full Training Delivery)

4. **Colossyan AI interactive videos** (SHEL INFOSEC) — Receive curriculum PDFs from MAK, convert to Colossyan AI interactive video, export SCORM 1.2 .zip, upload to SCORM Cloud, enter courseId per module in Admin Panel. **Delivered at $2,500 per course.** Each course includes: full database module build + interactive video production + SCORM packaging + platform integration.

5. **SCORM Cloud webhook** — Configure webhook URL: `https://spartan.shelinfosec.com/api/scorm/complete` in SCORM Cloud dashboard; add `SCORM_CLOUD_WEBHOOK_SECRET` to `.env.local`

6. **Quiz questions MOD-10–16** — Admin Panel Gen Quiz (coordinator or above); MAK to supply curriculum material and approve generated questions

### Next Phase Features (Post Launch)

7. **Certificate PDF generation** — Printable PDF certificate triggered on full 16-module completion
8. **Commander email on Critical Fail** — Supabase Edge Function (`notify-commander`) fires when Tactical Reset occurs
9. **MFA enforcement** — Currently optional; can be made mandatory for all agents at policy level

---

## SECTION 6 — BUSINESS READINESS FRAMEWORK

### 6.1 Platform as a Product

Spartan Training is deliverable as a **white-label LMS platform** for security training organizations. The core platform is complete and reusable. New tracks, new curricula, and new clients can be onboarded with zero additional engineering for the training engine itself.

**What SHEL INFOSEC owns:**
- The complete LMS codebase (Next.js + Supabase)
- The quiz engine with AI generation capability
- The Hard Gate sequencing mechanism
- The forensic audit system
- The SCORM Cloud integration layer
- The four-tier role security model

### 6.2 Pricing Models — Framework

The following framework is provided for partner discussion. Final pricing is at CISO discretion.

**Per-Operator Enrollment (Current Model)**

| Track | Duration | Suggested Price |
|---|---|---|
| Armed Security (16 modules, 16 hrs) | 16 hours | $199–$249/operator |
| Armed Security + Range Qualification | 16 hrs + range | $299–$349/operator |
| Private Detective Track (future, 70 hrs) | 70 hours | $499–$699/operator |
| Executive Protection Track (future) | TBD | TBD |

**Platform Licensing (For Training Organizations)**

| Tier | Seats | Annual |
|---|---|---|
| Standard | Up to 50 operators/year | $2,400/yr |
| Professional | Up to 200 operators/year | $7,200/yr |
| Enterprise | Unlimited operators | Custom |

Licensing includes: white-label branding, custom domain, dedicated Supabase instance, priority support, custom curriculum module additions.

**Content Production — SHEL INFOSEC Service (Per Course)**

Each course delivery by SHEL INFOSEC is a complete, turnkey package at a fixed rate.

| What's Included | Description |
|---|---|
| Database module build | Module hard-coded into the platform backend — title, description, pass score, Hard Gate sequencing, duration |
| Interactive video production | Colossyan AI-rendered interactive video from source PDF / curriculum material |
| SCORM packaging | Export as SCORM 1.2 .zip, upload to SCORM Cloud, webhook configuration |
| Platform integration | courseId linked in Admin Panel, module live and accessible on enrollment |
| Quiz set | Claude AI generates 10 curriculum-grounded questions with explanations and Critical Fail designations |
| **Total per course** | **$2,500** |

This applies to: ongoing MJM modules, additional modules, entirely new training tracks (Private Detective, Executive Protection, Cybersecurity), and annual curriculum updates.

| Service | Price |
|---|---|
| New course / module (full delivery) | **$2,500** |
| Annual curriculum refresh (questions + video update) | $1,500/track |
| Emergency content update (regulatory change) | $750/module |

### 6.3 Revenue Projection (MJM 2026 Cohort)

| Scenario | Operators | Revenue (@ $225 avg) |
|---|---|---|
| Conservative (first cohort) | 20 | $4,500 |
| Moderate | 50 | $11,250 |
| Full cohort (GBPDSA annual) | 100 | $22,500 |

These figures are per-cohort. A yearly operating cadence at 100 operators/year produces ~$22,500 recurring revenue on the armed security track alone, before PI and EP tracks.

### 6.4 Expanding the Platform

The engine is designed to grow:

- **New tracks**: Add a new curriculum set (Private Detective, Executive Protection, Cybersecurity) with a new module table and track identifier. The Hard Gate, quiz engine, audit system, and certificates all apply automatically.
- **New video content**: Re-upload a SCORM package and update the courseId in Admin Panel. No code changes required.
- **New quiz questions**: Gen Quiz runs on any module at any time. Old AI-generated questions are replaced; manually loaded questions are preserved.
- **New operators**: Enroll through the public site. No manual setup once Stripe is live.
- **New clients**: Spin up a new Supabase project, deploy the same codebase to a new subdomain, configure branding. Platform engineering is done.

---

## SECTION 7 — DEVELOPMENT TIMELINE SUMMARY

| Phase | Date | Deliverables |
|---|---|---|
| Phase 1 — Foundation | 2026-04-28 | Auth system, dashboard shell, marketing site, PostgreSQL schema, RLS policies |
| Phase 2 — Training Engine | 2026-04-30 | Quiz engine, Hard Gate, SCORM webhook, Stripe integration, Critical Fail / Tactical Reset, forensic audit trigger |
| Phase 3 — Admin & Responsive | 2026-05-01 (AM) | Admin Panel (3 tabs), Claude AI quiz generation, mobile-responsive design, all dashboard pages, briefing video integration |
| Phase 4 — Content & Roles | 2026-05-01 (PM) | MJM syllabus load (44 questions, 14 Critical Fail), four-tier role hierarchy, role hierarchy DB migration, CSO confirm dialog |
| **Phase 5 — Go Live** | **Pending** | **Stripe keys, SCORM content, DNS, SSL, KVM deployment** |
| Phase 6 — Full Operation | Post-launch | MOD-10–16 quizzes, certificate PDF, commander email, PI track curriculum |

---

## SECTION 8 — CONTACT / RESPONSIBILITIES

| Person | Role | Responsibility |
|---|---|---|
| **Sheldon L. Kuhn** | CISO / Platform Director — SHEL INFOSEC | Platform engineering, all content production (Colossyan AI video, SCORM packaging, DB module build), go-live deployment, Stripe keys, infrastructure |
| **MAJ. Michael Makropoulos** | Head Coordinator · Executive Specialist · Facilitator · Program Authority | The accreditation authority — his military credentials and training certifications underpin the legitimacy of all courses. Supplies curriculum source material, approves delivered content, chairs the training program. Funding partner for course delivery. |
| **Dr. Tristan Searra** | Coordinator — Intelligence, Counterintelligence & PI Specialist | MOD-12–14 domain authority (Cyber, Evidence, Executive Protection), PI track curriculum, Critical Fail designation for intelligence modules |

**Platform / technical:** ciso@shelinfosec.com  
**Program authority / curriculum:** mak@palisadeintl.com · 770-639-3939  
**Intelligence modules:** tristan@thiinkvp.com

---

## SECTION 9 — GO-LIVE CHECKLIST

```
PRE-LAUNCH (Sheldon)
[ ] Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.local
[ ] Configure Stripe price IDs in enrollment form
[ ] Point spartan.shelinfosec.com DNS A record → KVM 4 IP
[ ] Push to main branch → GitHub Actions deploys to KVM
[ ] Run: certbot --nginx -d spartan.shelinfosec.com
[ ] Verify HTTPS live and A+ on SSL Labs

CONTENT PRODUCTION (SHEL INFOSEC — per module, $2,500/course)
[ ] Receive MOD-01 curriculum source material from MAK
[ ] Produce Colossyan AI interactive video from PDF
[ ] Export as SCORM 1.2 .zip
[ ] Upload to SCORM Cloud → note courseId
[ ] Enter courseId in Admin Panel → MOD-01 Edit
[ ] Configure SCORM Cloud webhook: https://spartan.shelinfosec.com/api/scorm/complete
[ ] Add SCORM_CLOUD_WEBHOOK_SECRET to server .env
[ ] Repeat pipeline for MOD-02 through MOD-16 as curriculum material is authorized by MAK

CONTENT REVIEW (MAK · Program Authority)
[ ] Review Phase 1–3 questions (44 live) — confirm accuracy against MJM 2026 standards
[ ] Review and approve each delivered module video and quiz set
[ ] Authorize Gen Quiz run for MOD-10 through MOD-16
[ ] Confirm Critical Fail question designations reflect program standards

CONTENT REVIEW (Dr. Searra — MOD-12–14)
[ ] Review and refine MOD-12 (Cyber Awareness), MOD-13 (Evidence Handling), MOD-14 (Executive Protection)
[ ] Confirm Critical Fail designations for intelligence-domain modules

SMOKE TEST
[ ] Create a test operator account via enrollment form
[ ] Complete MOD-01 → confirm MOD-02 unlocks
[ ] Trigger a Critical Fail → confirm Tactical Reset fires
[ ] Verify audit log captures all events
[ ] Confirm SUPABASE_SERVICE_ROLE_KEY is absent from browser network traffic
```

---

*SPARTAN TRAINING — MJM 2026 ARMED SECURITY ACCREDITATION*  
*SHEL INFOSEC · GBPDSA Compliant · Georgia Code § 509-3-.01*  
*Platform Version: v1.3 · Report Date: 2026-05-01*
