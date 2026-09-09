# Private Detective (PI) Course — Full Hour Breakdown & Reconciliation

> ## ⚠️ SUPERSEDED — THE ANSWER IS 70 HOURS
>
> This document was written on 2026-06-16, before the question was settled. Its central
> premise — that the mandated minimum is **72 hours** — is **wrong**, and its speculation
> about where the customer's "70 hours" came from is moot.
>
> **Ga. Comp. R. & Regs. R. 509-3-.06:** *"Effective July 1, 2022 a minimum of **seventy
> (70) hours** of classroom instruction is required for all private detective licensees and
> registered private detective employees."*
> [Cornell LII](https://www.law.cornell.edu/regulations/georgia/Ga-Comp-R-Regs-R-509-3-.06)
>
> The 72-hour figure in the MJM source PDF predates the July 2022 rule change. Confirmed by
> MAJ Makropoulos (licensing agent) on 2026-07-17 and again via Tristan on 2026-09-09.
>
> **The platform is correct at 70.0h** — 66h instruction plus the 4.0h of practical report
> assignments added by migration `025`. There is no shortfall to close.
>
> Kept for the reconciliation working and the itemised hour tables, which remain useful.
> **Do not cite its 72-hour conclusion.** Migration `031` removed the last 72-hour claims
> from student-facing content.

**Prepared:** 2026-06-16
**Source of truth:** *2026 MJM PRIVATE DETECTIVE TRAINING CLASS — GBPDSA Private Detective Training 72 hr* (Michael J. Makropoulos / GBPDSA, GA Admin Code § 509-3-.06)
**Our platform source:** migration `009_pi_module_registry.sql` (`mjm_modules.duration_hours`) — this is what the certificate sums and prints.

---

## 1. The three numbers, and what each one actually is

| Number | What it is | Where it comes from |
|---|---|---|
| **66 h** | What our platform **currently records & prints on the certificate** | Our 24 modules: 64 h content + 2 h final exam. **We never modeled the 1 h Registration & Orientation.** |
| **67 h** | What the official document **itemizes line-by-line** | 1 h Orientation + 64 h content (topics 1–23) + 2 h exam |
| **72 h** | The **mandated minimum** the course must legally deliver | Stated **twice** in the document (lines 16 & 28): *"A minimum of Seventy-two (72) hours of instruction is required."* GA 509-3-.06. |

**The customer's "70 hours" is not a printed figure anywhere in the document.** The document states **72** (total, mandated) and itemizes **67**. The most likely reading of "70": **72 total − 2 h final exam = ~70 hours of actual instruction/training**, with the exam counted separately as assessment. *This needs to be confirmed with him* — but on that reading, **he is essentially correct and our 66 is too low.**

---

## 2. Per-module / per-topic breakdown (side by side)

Our PI module hours match the official outline **hour-for-hour** on every content topic. The only gaps are the orientation hour and the regulatory top-up (see §3).

| Our Module | Title | Our Hours | Official Outline Topic | Doc Hours | Match |
|---|---|---|---|---|---|
| — | *(not modeled)* | 0 | **Registration & Orientation** | 1 | ❌ missing |
| PI-01 | History of Law Enforcement & the PI Industry | 2 | 1. History of Law Enforcement & PI Industry | 2 | ✅ |
| PI-02 | Ethics for Private Investigators | 2 | 2. Ethics | 2 | ✅ |
| PI-03 | Types of Investigations | 2 | 3. Types of Investigations | 2 | ✅ |
| PI-04 | Principal GA Misdemeanors & Felonies | 4 | 4. Principal GA Misdemeanors & Felonies | 4 | ✅ |
| PI-05 | Laws of Arrest | 4 | 5. Laws of Arrest | 4 | ✅ |
| PI-06 | Search & Seizure | 2 | 6. Search & Seizure; Lawful | 2 | ✅ |
| PI-07 | Crime Scene Investigation | 2 | 7. Crime Scene Investigation & Scientific Aids | 2 | ✅ |
| PI-08 | Interviewing Suspects & Witnesses | 2 | 8. Interviewing Suspects & Witnesses | 2 | ✅ |
| PI-09 | Process Serving | 2 | 9. Process Serving | 2 | ✅ |
| PI-10 | Sources of Information | 4 | 10. Sources of Information | 4 | ✅ |
| PI-11 | Surveillance | 8 | 11. Surveillance | 8 | ✅ |
| PI-12 | Basic Videography & Photography | 2 | 12. Basic Videography & Photography Methods | 2 | ✅ |
| PI-13 | Proper Note Taking | 2 | 13. Proper Note Taking & Recording | 2 | ✅ |
| PI-14 | Case Management & Report Writing | 4 | 14. Case Management & Report Writing | 4 | ✅ |
| PI-15 | Courtroom Testimony | 4 | 15. Courtroom Testimony | 4 | ✅ |
| PI-16 | Court Records Research | 4 | 16. Court Records Research | 4 | ✅ |
| PI-17 | Criminal Defense Investigation | 2 | 17. Criminal Defense Investigation | 2 | ✅ |
| PI-18 | Undercover Investigation | 2 | 18. Undercover Investigation | 2 | ✅ |
| PI-19 | Domestic Investigation | 2 | 19. Domestic Investigation | 2 | ✅ |
| PI-20 | Insurance Fraud Investigations | 2 | 20. Insurance Fraud Investigations | 2 | ✅ |
| PI-21 | White Collar Crime & Cyber Forensics | 2 | 21. White Collar Crime | 2 | ✅ |
| PI-22 | Executive Protection Services | 2 | 22. Executive Protection Services | 2 | ✅ |
| PI-23 | Proper Business Practices | 2 | 23. Proper Business Practices | 2 | ✅ |
| PI-24 | Final Accreditation Examination | 2 | Examination ("comprehensive, two (2) hour examination") | 2 | ✅ |

**Subtotals**
- Content topics 1–23: **64 h** (ours) = **64 h** (doc) ✅
- Final exam: **2 h** (ours) = **2 h** (doc) ✅
- Registration & Orientation: **0 h** (ours) vs **1 h** (doc) ❌
- **Our recorded total: 66 h**
- **Doc itemized total: 67 h**

---

## 3. Why the document says 72 but only lists 67

The outline **itemizes 67 hours** of specific named blocks, yet the course is **mandated at a 72-hour minimum**. The remaining **~5 hours** are **not broken out by topic** in the outline — under GBPDSA rules they are instructor-led contact hours (review, practical exercises, supervised application) that the **licensed instructor** allocates to satisfy the 72-hour floor.

So the full gap from our 66 h to the required 72 h is:

| Gap component | Hours | Status |
|---|---|---|
| Registration & Orientation (we omitted it) | 1 | Itemized in doc, just not modeled by us |
| Instructor-led review / practical contact (not itemized) | ~5 | **Allocation pending the Major / Michael Makropoulos** |
| **Total shortfall (66 → 72)** | **6** | — |

---

## 4. Bottom line — what to tell the customer

1. **Our content is correct and complete.** Every single subject topic in the official outline is present in our platform at the exact same hour count (64 h of content, matched line-for-line). Nothing is missing on the teaching side.
2. **We are short by the right reasons, not wrong content.** The certificate prints **66 h** because (a) we never added the **1 h Registration & Orientation**, and (b) we never added the **~5 h of instructor-led review/practical** that the document's 72-hour mandate assumes.
3. **The customer is effectively right that 66 is too low.** The document's own requirement is **72 hours total**. If he means "70 hours of training," that reads as **72 total − 2 h exam = ~70 instruction** — worth confirming with him, but it points the same direction.
4. **The correct target is 72 h total** (not 70) — that is the figure the document states twice and that GA § 509-3-.06 mandates. The certificate should ultimately read **72.0 Hours**.

---

## 5. What we must NOT do yet

- **Do not relabel the course/certificate to "70 h."** The document's legal floor is **72 h total**; 70 would itself be incorrect.
- **Do not fabricate the ~5 h split.** How the orientation hour and the ~5 instructor-led hours map onto modules is a **regulatory/accreditation decision** that belongs to the licensed instructor (the Major / Michael Makropoulos). This is currently **blocked pending his supplementary hour-allocation data.**
- Once that allocation is received, the fix is data-driven: update `mjm_modules.duration_hours` so the 24 modules sum to **72**, and the certificate will auto-recompute to **72.0** (it sums live — no hardcoding). See `pi-certificate-72hr-fix` task notes.

---

*Figures verified against `CertificationTraining material/pi72.txt` (extracted from the official PDF) and `spartan-app/supabase/migrations/009_pi_module_registry.sql`. Arithmetic confirmed: 66 = 64 content + 2 exam.*
