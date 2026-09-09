# SPARTAN TRAINING — COORDINATOR OPERATIONS GUIDE
**Classification:** MJM 2026 · GBPDSA Accreditation Platform  
**Platform URL:** https://spartantraining.live  
**Last Updated:** 2026-05-19  
**Issued to:** Platform Coordinators & Lead Facilitators  

---

## YOUR ROLE AT A GLANCE

As a **Coordinator**, you have full Senior Oversight access to the platform — everything except Super Admin functions (role assignments, server configuration). You can enroll students, monitor all progress, manage promo codes, generate login links, and access all course content directly.

**Your role badge in the platform:** `COORDINATOR · SENIOR OVERSIGHT` (green dot)

---

## PART 1 — LOGGING IN

### First-Time Login (Magic Link)

When your account was created, you received (or your admin sent you) a **magic login link**.

1. Click the link — it opens `spartantraining.live` and logs you in automatically
2. You land on the **Command Dashboard** (`/dashboard`)
3. **Immediately set your passphrase** — go to **Settings** (sidebar → SET) → enter and confirm a new passphrase
4. Future logins: go to `spartantraining.live/sign-in` → enter your email + passphrase

### Returning Login

1. Navigate to: `https://spartantraining.live/sign-in`
2. Enter your **email address** and **passphrase**
3. Complete the **Cloudflare security check** (tick the checkbox widget)
4. Click **Issue Credential →**

### Forgot Your Passphrase?

On the sign-in page, click **"No passphrase set? Request a login link →"**  
Enter your email → a one-time login link will be sent to your inbox.  
Click the link → you're in. Then go to Settings and set a new passphrase.

### Still Locked Out?

Contact the Super Admin: **ciso@shelinfosec.com** — they can generate a fresh login link from the Admin Panel in seconds.

### Rate Limiting

The platform enforces **5 sign-in attempts per 15 minutes** per email. If blocked, wait 15 minutes and try again.

---

## PART 2 — THE DASHBOARD LAYOUT

After login you see the **Command Dashboard**. The interface has three zones:

```
┌─────────────┬──────────────────────────────────────────┐
│             │  TOP BAR — Your ID · Role · Progress Rings│
│  SIDEBAR    ├──────────────────────────────────────────┤
│  NAVIGATION │                                          │
│             │                                          │
│  CMD  CUR   │         MAIN CONTENT AREA                │
│  LIB  REC   │                                          │
│  EXM  LDR   │                                          │
│  CRD  SET   │                                          │
│  ─────────  │                                          │
│  ADM  CRS   │                                          │
│  (Coord+)   │                                          │
└─────────────┴──────────────────────────────────────────┘
```

### Sidebar Navigation Keys

| Key | Page | Purpose |
|-----|------|---------|
| **CMD** | Command | Your personal overview — progress, recent activity |
| **CUR** | Curriculum | All modules across all 3 tracks with your progress |
| **LIB** | Library | Resource library (coming soon) |
| **REC** | Records | Detailed records view (coming soon) |
| **EXM** | Exams | Final exam eligibility status per track |
| **LDR** | Leaderboard | Operator rankings |
| **CRD** | Credentials | Accreditation status and certificate previews |
| **SET** | Settings | Your profile, passphrase update |
| **ADM** | Admin Panel | **Coordinator access — full student management** |
| **CRS** | Course Content | Module editor, quiz generator |

On **mobile**: tap the **hamburger menu (≡)** top-left to open the sidebar. Tap outside or navigate to close it.

### Top Bar

- **Left:** Hamburger menu (mobile only) + your Operator ID
- **Center:** Progress rings (one per enrolled track — fills as you complete modules)
- **Right:** Profile dropdown — shows your name, role, sign-out option

---

## PART 3 — THE ADMIN PANEL (`/dashboard/admin`)

Access via **ADM** in the sidebar. This is your primary operational workspace.

At the top: **stat strip** showing platform-wide totals:
- Total enrolled operators
- Modules linked to SCORM Cloud
- Total competencies earned
- Critical Fails (red if any — take action)

The panel has **4 tabs** — scroll the tab bar horizontally on mobile if needed.

---

### TAB 1 — MODULES

View and manage all **64 course modules** across 3 tracks.

**Each row shows:**
- Sequence number, Module ID, Title
- SCORM status (`● LINKED` = video linked, `○ TBD` = pending)
- Passing score percentage
- Quiz question count

**What you can do:**

**Edit a module** — click Edit → modify title, description, SCORM ID, passing score, duration → Save

**Generate quiz questions (AI)** — select question count (5/8/10/15/20) → click **Gen Quiz** next to the module. Claude AI generates questions from the slide content. Confirm the count updates.

---

### TAB 2 — OPERATORS

Your **student management hub**. Every enrolled student, their tracks, progress, and login access.

#### Roster Overview

Each row shows:
- Operator ID (`ST-26-XXXX`)
- Full name, email
- Enrollment date
- Track badges (color-coded: gold = Armed, blue = Unarmed, green = Private Detective)
- Role (read-only for coordinators)

Click any row to **expand** for full detail.

#### Expanded Operator View

**Enrolled Tracks section:**
- Shows which tracks the student is in
- **Manage** button → checkboxes to add/remove tracks → Save

**Module Progress Grid:**
Color heat map of every module the student has or hasn't touched:
- Green = Competent (passed, gates unlocked)
- Gold = In Progress
- Red = Failed / Critical Fail
- Dark grey = Not Started

Hover (or long-press on mobile) any cell to see module ID, status, and score.

**Get Login Link:**
Click **Get Login Link** → a one-time magic link generates → click **Copy** → send to student.  
The link logs them in immediately when clicked. Generate a new one each time they need access.

#### Enrolling a New Student

1. Click **+ Enroll New Operator** (top right of Operators tab)
2. Complete the form:

| Field | What to enter |
|-------|---------------|
| Full Name | Student's legal name |
| Email Address | Their email — becomes their login identity |
| Track(s) | Tick Armed Security / Private Detective / Unarmed Security (can tick multiple) |
| Payment Method | Stripe / Manual / EFT / Cash / Complimentary |
| Promo Code | Optional — enter code, discount auto-validates and displays |
| Notes | Internal notes only — not visible to student |

3. Click **Enroll Operator**

The system automatically:
- Creates their secure login account
- Assigns an Operator ID
- Enrolls them in selected tracks
- Sends them an enrollment confirmation email
- Returns a **magic login link** to copy and send them

**Copy the link and send it to the student.** They click it to access the platform.

#### Updating a Student's Tracks

1. Expand their row
2. Click **Manage** → check/uncheck tracks → **Save**

Changes take effect immediately.

---

### TAB 3 — AUDIT LOG

The complete activity record of the platform — last 200 events.

**Key events to watch:**

| Event | Meaning |
|-------|---------|
| `ENROLLMENT_COMPLETE` | Student enrolled successfully |
| `QUIZ_PASS` | Module quiz passed — student progresses |
| `QUIZ_FAIL` | Quiz failed — can retry (check if cooldown applies) |
| `CRITICAL_FAIL` | Critical question answered wrong — 24hr lockout triggered |
| `QUIZ_TAB_VIOLATION` | Student switched tabs during a quiz (anti-cheat) |

Use this to:
- Investigate academic integrity issues (tab violations, critical fails)
- Confirm a student completed a specific module
- Audit who was enrolled and when
- Monitor critical fail incidents for follow-up

---

### TAB 4 — PROMO CODES

Create and manage discount codes for student enrollments.

#### Viewing Existing Codes

The table shows all codes with: code text, type, value, max uses, current usage, expiry, and active status.

#### Creating a New Code

Click **Create New Code** and fill in:

| Field | Example | Notes |
|-------|---------|-------|
| Code | `MAKTRAIN25` | Uppercase, letters/numbers/hyphens, 3–32 chars |
| Type | Percentage | Or "Fixed" dollar amount |
| Value | 25 | = 25% off, or $25 off if Fixed |
| Max Uses | 10 | Leave blank = unlimited |
| Applicable Tracks | (blank) | Blank = all tracks. Or select specific tracks |
| Expires At | 2026-12-31 | Optional — leave blank = no expiry |
| Notes | "MJM alumni discount" | Internal reference only |

Click **Create** — code is live immediately.

#### Applying a Code at Enrollment

In the **Enroll New Operator** form → enter the promo code → the system validates it and shows the discount. It gets recorded permanently on the enrollment record.

#### Current Process for Students Who Have a Code

Students cannot self-apply codes yet (coming with Stripe). Current flow:  
Student contacts you or Mak with their code → you apply it when enrolling them manually.

#### Deactivating a Code

Click **Deactivate** next to any code to disable it immediately (can be re-activated later).

---

## PART 4 — ACCESSING COURSE CONTENT

As a Coordinator, you **bypass all sequential module gates** — access any module in any order without prerequisites.

### Browsing Modules

Go to **CUR** (Curriculum) in the sidebar. All 64 modules display across 3 tracks. None are locked for you. Click any module name or **START →** to enter.

### The Lesson Player

Inside a module you see slides with narration:

- **Progress bar** (top): shows your position in the module
- **Dwell timer**: you must spend at least 20 seconds on each slide before Next is enabled
- **Narration button**: plays AI voice for the current slide — auto-plays on load where available. Click Play/Pause/Resume manually if needed
- **Next / Back**: navigate between slides
- **Progress saves** automatically every 1.5 seconds and on page close

When you return to a module, it resumes from where you left off.

### Knowledge Assessment (Quiz)

After the final slide, click **Begin Knowledge Assessment**.

Before the quiz starts:
- Read the anti-cheat briefing carefully
- The quiz goes fullscreen
- Have your device ready — do not switch tabs

During the quiz:
- **90 seconds** per question (timer visible on screen)
- Questions and options are **randomized** each attempt
- **3 tab switches** = auto-submit (even if not finished)
- Timer expires on a question = auto-submit that question

After submitting:
- Score displayed immediately
- Pass → module marked Competent, next module unlocked for students
- Fail → can retry (check cooldown)
- Critical Fail → 24-hour lockdown on that module

---

## PART 5 — COURSE CONTENT REFERENCE

### Track ALPHA — Armed Security Officer

- **Module IDs:** MOD-01 through MOD-16 (16 modules)
- **Total Duration:** 16 hours (8 online + 8 live-fire range)
- **Enrolment Price:** $249
- **Passing Score:** 80% per module
- **Georgia Compliance:** GBPDSA Title 43, Chapter 38

Key modules: Legal Foundations · Firearms Safety · Threat Assessment · Emergency Response · Final Accreditation Exam (MOD-16)

**Range Note:** 8 hours live-fire qualification with a GBPDSA-licensed Firearms Instructor at an approved range are required in addition to the online curriculum. Minimum 80% to qualify.

---

### Track BRAVO — Unarmed Security Officer

- **Module IDs:** UAS-01 through UAS-24 (24 modules)
- **Total Duration:** 24 hours (all online)
- **Enrolment Price:** $199
- **Passing Score:** 75–85% per module
- **Georgia Compliance:** OCGA Title 43 Ch. 38, GA Admin Code 509-3-.01

Key modules: Role & Legal Authority · GBPDSA Framework · Use of Force Continuum · De-escalation · Access Control · Incident Response · Final Accreditation Exam (UAS-24)

---

### Track CHARLIE — Private Detective

- **Module IDs:** PI-01 through PI-24 (24 modules)
- **Total Duration:** 70 hours (all online) — 66 h instruction + 4 h practical reports
- **Enrolment Price:** $849
- **Passing Score:** 70% per module
- **Georgia Compliance:** OCGA Title 43 Ch. 38, Title 16, Title 17

Key modules: Surveillance Techniques · Evidence Collection · OSINT · Skip Tracing · Background Investigations · Cyber Investigation Basics · Expert Witness Testimony · Final Accreditation Exam (PI-24)

---

### Upcoming Tracks (Not Yet Active)

| Code | Track | Status |
|------|-------|--------|
| DELTA | Professional Ethics (CEU — 2yr renewal) | Planned |
| ECHO | Anti-Terrorism (CEU — 2yr renewal) | Planned |
| FOXTROT | Executive Protection (24hr) | Planned |

---

## PART 6 — EXAMS & CREDENTIALS

### Exams Page (`/dashboard/exams` — sidebar: EXM)

Shows **your own** final exam eligibility per enrolled track.

States:
- **Locked** — one or more modules not yet complete
- **Attempt Final Examination** — all modules passed, exam available
- **Passed** — final exam completed

The assessment log shows all quiz attempts with score and date.

To view a **student's** exam status: Admin Panel → Operators → expand their row → Module Progress Grid.

### Credentials Page (`/dashboard/credentials` — sidebar: CRD)

Accreditation status per enrolled track:
- Progress bar toward completion
- Certificate preview (locked until all modules competent)
- Module competency table

**Certificates are on hold** — awaiting approval from MAJ Makropoulos. When approved, a certificate download/print flow will be activated.

---

## PART 7 — COORDINATOR PERMISSIONS

### What You CAN Do

- Enroll new students in any track
- View and manage all student progress across all tracks
- Generate login links for any student
- Add/remove student track enrollments
- Create, activate, and deactivate promo codes
- Apply promo codes at enrollment time
- Edit module titles, descriptions, SCORM IDs, passing scores, duration
- Generate AI quiz questions for any module
- Access all 64 modules without sequential gating
- View the full audit log (200 entries)
- Access admin panel stats (operator count, competencies, critical fails)

### Only SUPER ADMIN Can

- Change operator roles (agent / admin / coordinator / super_admin)
- Access Supabase database directly
- Modify server, Docker, Nginx, DNS configuration
- Manage GitHub Secrets and CI/CD pipeline
- Generate platform-level API keys

To request a role change: **ciso@shelinfosec.com**

---

## PART 8 — PAYMENTS (CURRENT STATUS)

**Stripe is not yet live.** Pending approval from MAJ Makropoulos.

### Current Manual Enrollment Process

1. Student contacts you or Mak to enroll
2. Collect payment via your preferred method (cash, EFT, bank transfer)
3. Go to Admin Panel → Operators → **Enroll New Operator**
4. Select payment method: `Manual`, `EFT`, or `Cash`
5. Apply promo code if applicable
6. Send student the magic login link

Payment method is recorded on their enrollment record for audit purposes.

### When Stripe Goes Live

- Students self-enroll at `/apply` with card payment
- Promo codes applied at checkout — fully automated
- You receive enrollment confirmation emails automatically
- Admin panel still shows all enrollments regardless of payment channel

---

## PART 9 — TROUBLESHOOTING

### Student can't log in

1. Admin Panel → Operators → find student → expand row
2. Click **Get Login Link** → **Copy**
3. Send the link to the student (email, text, WhatsApp)
4. Advise: after clicking, go to **Settings** (sidebar → SET) → set a passphrase for future logins

### Student locked out of a module quiz (24hr cooldown)

- They answered a **Critical question** wrong
- The 24-hour lockout is automatic and cannot be overridden — it's an academic integrity requirement
- Check Audit Log tab → look for `CRITICAL_FAIL` for their Operator ID to confirm timing
- After 24 hours from the fail event, they can retry the module quiz

### Student says the next module is locked

- They haven't achieved **Competent** status on the current module (must pass the quiz at the required score)
- They need to go back to the locked module's quiz and pass it
- Coordinators bypass this — you can access any module directly

### Student's narration audio isn't playing

- Browser may have blocked autoplay — they should click the **Play** button
- Ensure device volume is on and browser is not muted
- Chrome and Firefox work best — avoid Safari for audio-intensive use

### Promo code shows as invalid at enrollment

Check these in order:
1. Code is **active** (green in Promo Codes tab)
2. Code is not **expired** (check expiry date column)
3. Code hasn't hit **max uses** (uses_count < max_uses)
4. Code is **valid for the track** being enrolled (applicable_tracks — blank means all tracks)
5. Code format is correct: uppercase letters, numbers, hyphens, 3–32 characters

### Module manager shows "SCORM: TBD"

Normal — means the video SCORM package for that module hasn't been linked yet (Colossyan/SCORM Cloud integration pending). The slide content and quiz still function normally.

---

## PART 10 — KEY CONTACTS

| Person | Role | Contact |
|--------|------|---------|
| Sheldon L. Kuhn | Super Admin / CISO / Founding Faculty | ciso@shelinfosec.com |
| MAJ. Michael "Mak" Makropoulos | Head of Organization / Lead Instructor | mak@palisadeintl.com · 770-639-3939 |
| Dr. Tristan Searra | Director of Intelligence / Faculty | (via platform messaging) |
| Platform Support | Spartan Training Transactional | training@spartantraining.live |

---

## APPENDIX — QUICK REFERENCE

```
PLATFORM URL:   https://spartantraining.live
SIGN IN:        spartantraining.live/sign-in
ADMIN PANEL:    /dashboard/admin  (sidebar key: ADM)
CURRICULUM:     /dashboard/curriculum  (sidebar key: CUR)
SETTINGS:       /dashboard/settings  (sidebar key: SET)

ENROLL STUDENT:   ADM → Operators → + Enroll New Operator
GET LOGIN LINK:   ADM → Operators → expand row → Get Login Link
CREATE PROMO:     ADM → Promo Codes → Create New Code
AUDIT LOG:        ADM → Audit Log tab

TRACK DESIGNATORS:
  ALPHA   = Armed Security      MOD-01–16  16hr  $249
  BRAVO   = Unarmed Security    UAS-01–24  24hr  $199
  CHARLIE = Private Detective   PI-01–24   72hr  $849

OPERATOR ID FORMAT: ST-YY-NNNN  (e.g. ST-26-0001)

QUIZ RULES:
  - 90 seconds per question
  - Questions + options randomised each attempt
  - 3 tab switches = auto-submit
  - Critical Fail = wrong on marked question = 24hr lockout

WHAT REQUIRES SUPER ADMIN:
  - Changing user roles
  - Server / database / DNS access
```

---

*SPARTAN TRAINING LLC · Georgia PDSC001719 · CFTR001295 · MJM 2026*
