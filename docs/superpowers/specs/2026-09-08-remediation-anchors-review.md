# Remediation anchors — review list

**Generated:** 2026-09-08 · `node scripts/generate-remediation-anchors.mjs`
**Critical questions:** 65
**Confidence:** HIGH 41 · MEDIUM 15 · LOW 9 · NONE 0

## How to review

Each row proposes the slide a learner is sent back to re-read after failing that critical question.
**A wrong anchor is worse than no anchor** — it sends the learner to unrelated material and the platform
then asserts they reviewed the source. If a proposal looks wrong and no better slide exists, set it to `NONE`;
the gate degrades to a module-overview link and still requires the written corrective action.

Edit the **Verdict** column only:

- `OK` — proposal is correct
- `<slide-id>` — wrong; use this slide instead (e.g. `PI-14-s07`)
- `NONE` — no single slide teaches this; ship unanchored

`HIGH` rows are worth a skim. **`MEDIUM`, `LOW` and `NONE` rows are the ones that need you.**

## Needs review — 24 rows

| Verdict | Question | Module | Topic | Proposed slide | Conf | Runner-up |
|---|---|---|---|---|---|---|
| | `mod01-q3` | MOD-01 | Licensing Authority | `MOD-01-s03` 42 USC 1983 — Civil Liability Under Color of Law (2.12) | **LOW** | `MOD-01-s06` Module Summary — Legal Foundations (1.98) |
| | `mod02-q5` | MOD-02 | Prohibited Force | `MOD-02-s03` OCGA 17-4-20 — Deadly Force and the Power of Arrest (2.07) | **LOW** | `MOD-02-s01` OCGA 16-3-21 — Use of Force in Defense of Self and Others (1.81) |
| | `mod09-q4` | MOD-09 | Weapon Qualification Requirement | `MOD-09-s05` Module Summary — Range Qualification Standards (3.23) | **LOW** | `MOD-09-s04` Scoring and Qualification Standards (2.91) |
| | `mod-11-q3` | MOD-11 | Force Escalation Decision | `MOD-11-s01` The Use of Force Continuum (3.71) | **MEDIUM** | `MOD-11-s02` Resistance Levels and Appropriate Response (2.97) |
| | `mod-12-q2` | MOD-12 | Access Control and Verification | `MOD-12-s01` Social Engineering: The Human Attack Vector (1.8) | **LOW** | `MOD-12-s04` Recognizing and Reporting Cyber-Physical Threats (1.8) |
| | `mod-13-q2` | MOD-13 | Evidence Preservation Protocol | `MOD-13-s01` Chain of Custody: The Legal Standard (3.6) | **MEDIUM** | `MOD-13-s04` Legal Consequences of Evidence Mishandling (2.8) |
| | `pi04-q5` | PI-04 | Criminal Exposure | `PI-04-s01` Misdemeanors: Classification, Penalties, and PI Exposure (6.76) | **LOW** | `PI-04-s04` Crimes a PI Can Inadvertently Commit: Stalking, Trespass, Impersonation (6.55) |
| | `pi24-q3` | PI-24 | Federal Law | `PI-24-s01` Surveillance Law Summary: The Rules That Govern Every Assignment (2.06) | **MEDIUM** | `PI-24-s00` Capstone Review: Legal Authority, Ethics, and Evidentiary Standards (1.37) |
| | `pi24-q7` | PI-24 | Perjury | `PI-24-s00` Capstone Review: Legal Authority, Ethics, and Evidentiary Standards (2.33) | **MEDIUM** | `PI-24-s01` Surveillance Law Summary: The Rules That Govern Every Assignment (0.93) |
| | `pi24-q9` | PI-24 | Arrest Authority | `PI-24-s00` Capstone Review: Legal Authority, Ethics, and Evidentiary Standards (1.99) | **MEDIUM** | `PI-24-s01` Surveillance Law Summary: The Rules That Govern Every Assignment (1.55) |
| | `uas01-q1` | UAS-01 | legal-authority | `UAS-01-s00` Who You Are: A Private Security Officer, Not a Police Officer (4.62) | **MEDIUM** | `UAS-01-s02` Scope of Employment: Authority Bounded by Your Post (3.75) |
| | `uas03-q1` | UAS-03 | ethics | `UAS-03-s00` Integrity: The Non-Negotiable Foundation (2.67) | **MEDIUM** | `UAS-03-s02` Impartiality & Non-Discrimination (1.94) |
| | `uas03-q3` | UAS-03 | ethics | `UAS-03-s00` Integrity: The Non-Negotiable Foundation (2.91) | **MEDIUM** | `UAS-03-s02` Impartiality & Non-Discrimination (2.01) |
| | `uas04-q4` | UAS-04 | civil-liability | `UAS-04-s02` Civil Liability: The Other Way a Security Incident Ends Careers (2.52) | **MEDIUM** | `UAS-04-s03` Merchant Protection Statute: OCGA 51-7-60 (1.15) |
| | `uas04-q5` | UAS-04 | civil-liability | `UAS-04-s03` Merchant Protection Statute: OCGA 51-7-60 (2.84) | **MEDIUM** | `UAS-04-s02` Civil Liability: The Other Way a Security Incident Ends Careers (1.53) |
| | `uas06-q2` | UAS-06 | search-seizure | `UAS-06-s01` Consensual Searches: The Only Search You Should Conduct (3.46) | **MEDIUM** | `UAS-06-s02` What You Cannot Search: Hard Limits for Security Officers (2.6) |
| | `uas07-q3` | UAS-07 | use-of-force | `UAS-07-s01` Imminent Threat Standard: When Physical Force Is Justified (3.5) | **LOW** | `UAS-07-s02` Permitted Physical Responses for Unarmed Security Officers (3.5) |
| | `uas12-q1` | UAS-12 | emergency-procedures | `UAS-12-s02` Medical Emergency Response: Your Role Before EMS Arrives (3.33) | **MEDIUM** | `UAS-12-s00` The Security Officer's Role in Emergency Response (2.77) |
| | `uas12-q5` | UAS-12 | emergency-procedures | `UAS-12-s00` The Security Officer's Role in Emergency Response (4.59) | **MEDIUM** | `UAS-12-s02` Medical Emergency Response: Your Role Before EMS Arrives (3.96) |
| | `uas16-q3` | UAS-16 | crowd-management | `UAS-16-s03` Scenario: The Concert Crowd Surge (3.1) | **MEDIUM** | `UAS-16-s01` Crowd Density, Crush Prevention & Ingress/Egress Management (2.58) |
| | `uas20-q3` | UAS-20 | trespass | `UAS-20-s01` Property Owner Authority & Security Officer's Role (4.38) | **LOW** | `UAS-20-s04` Trespass & Banning Procedure Checklist (4.17) |
| | `uas24-q3` | UAS-24 | use-of-force | `UAS-24-s01` What Georgia Law Requires of You — A Final Review (1.61) | **LOW** | `UAS-24-s02` Critical Questions — What They Test & Why (0.69) |
| | `uas24-q7` | UAS-24 | emergency-procedures | `UAS-24-s02` Critical Questions — What They Test & Why (1.6) | **LOW** | `UAS-24-s01` What Georgia Law Requires of You — A Final Review (0.37) |
| | `uas24-q9` | UAS-24 | ethics | `UAS-24-s01` What Georgia Law Requires of You — A Final Review (2.14) | **MEDIUM** | `UAS-24-s00` UAS Final Accreditation Examination — Overview (0.94) |

### Question text for the rows above

- `mod01-q3` — A security officer's PDSC license has lapsed by 30 days and they continue working armed. What is the primary legal risk?
- `mod02-q5` — A security officer fires a warning shot to stop a fleeing shoplifter. Under the MJM 2026 standard, this constitutes:
- `mod09-q4` — An officer qualifies with a full-size duty pistol but carries a compact version of the same model daily. Under MJM 2026, this is:
- `mod-11-q3` — A terminated employee is advancing rapidly toward a secured door while shouting threats. The officer has deployed verbal commands with no effect. The subject reaches out and physically grabs the officer's arm to push past. Under the Use of Force Continuum, this now constitutes:
- `mod-12-q2` — A security officer observes a person in a technician's uniform near a network communications closet in a restricted area. The person claims to be from IT and says they were sent to check the router. The officer does not see them on the authorized visitor list. What is the CORRECT response?
- `mod-13-q2` — A security officer arrives first on scene at a workplace altercation and observes a knife on the floor near the involved parties. What is the CORRECT immediate action regarding the knife?
- `pi04-q5` — A PI who enters an unfenced private backyard to get a better camera angle during surveillance — without permission from the property owner — has committed:
- `pi24-q3` — A Georgia PI who accesses a subject personal email account using credentials provided by the client, without the account owner consent or a court order, has committed:
- `pi24-q7` — Perjury under OCGA 16-10-70 cannot be excused by which of the following:
- `pi24-q9` — A citizen arrest under OCGA 17-4-60 is lawful for a PI when:
- `uas01-q1` — What is the PRIMARY source of a security officer's authority to act on private property?
- `uas03-q1` — A person you are holding offers you $50 to let them go and not file a report. The correct response is:
- `uas03-q3` — You witness a fellow security officer falsifying entries in the patrol log to cover for time they spent off-post. Your ethical and professional obligation is to:
- `uas04-q4` — The legal concept of respondeat superior means that in a civil lawsuit arising from a security officer's on-duty conduct:
- `uas04-q5` — A security officer detains a person for 45 minutes based solely on a coworker's unverified claim that the person looked suspicious near the register. This detention most likely constitutes:
- `uas06-q2` — A person consents to a bag search and then says "stop, I revoke my consent" while the officer is mid-search. The officer MUST:
- `uas07-q3` — After any use of physical force, an unarmed security officer's IMMEDIATE obligations include:
- `uas12-q1` — In an emergency situation, a security officer's FIRST priority is always:
- `uas12-q5` — A mass casualty incident occurs on your property. Law enforcement and EMS are en route. Your immediate role is:
- `uas16-q3` — A crowd crush can kill people who are standing upright because:
- `uas20-q3` — A property manager directs a security officer to ban all persons of a specific nationality from the shopping center. The officer should:
- `uas24-q3` — An unarmed security officer is confronted by a person who is verbally threatening but has made no physical movement. Physical force at this moment would be:
- `uas24-q7` — The life-safety priority hierarchy at an emergency scene places which action FIRST?
- `uas24-q9` — The GBPDSA Code of Conduct confidentiality obligation requires security officers to:

## High confidence — 41 rows (skim)

| Verdict | Question | Module | Topic | Proposed slide | Conf | Runner-up |
|---|---|---|---|---|---|---|
| | `mod01-q1` | MOD-01 | GBPDSA Compliance | `MOD-01-s00` Program Authority: Who Governs Armed Security in Georgia (8.54) | **HIGH** | `MOD-01-s01` The 16-Hour Training Mandate (6.32) |
| | `mod02-q1` | MOD-02 | Fleeing Suspect Doctrine | `MOD-02-s03` OCGA 17-4-20 — Deadly Force and the Power of Arrest (8.25) | **HIGH** | `MOD-02-s00` What Is Deadly Force? (3.88) |
| | `mod02-q4` | MOD-02 | Deadly Force Threshold | `MOD-02-s01` OCGA 16-3-21 — Use of Force in Defense of Self and Others (10.54) | **HIGH** | `MOD-02-s02` Three Situations Justifying Deadly Force (9.43) |
| | `mod03-q2` | MOD-03 | Graham v. Connor | `MOD-03-s01` Graham v. Connor (1989) — The Supreme Court Standard (11.49) | **HIGH** | `MOD-03-s00` The Reasonable Man Standard (2.94) |
| | `mod03-q3` | MOD-03 | Graham Three-Factor Test | `MOD-03-s02` The Three Graham Factors (7.83) | **HIGH** | `MOD-03-s06` Module Summary — The Reasonable Man Doctrine (4.38) |
| | `mod03-q4` | MOD-03 | Objective vs. Subjective Standard | `MOD-03-s00` The Reasonable Man Standard (7.77) | **HIGH** | `MOD-03-s01` Graham v. Connor (1989) — The Supreme Court Standard (3.88) |
| | `mod07-q1` | MOD-07 | Cardinal Rule 3 — Trigger Discipline | `MOD-07-s02` Rule 3 — Keep Your Finger Off the Trigger Until On Target with Intent to Fire (7.5) | **HIGH** | `MOD-07-s06` Module Summary — The Four Cardinal Rules (4.02) |
| | `mod07-q2` | MOD-07 | Cardinal Rule 1 | `MOD-07-s00` Rule 1 — Treat Every Weapon as if It Is Loaded (6.63) | **HIGH** | `MOD-07-s06` Module Summary — The Four Cardinal Rules (4.85) |
| | `mod07-q3` | MOD-07 | Cardinal Rule 3 — Critical Application | `MOD-07-s02` Rule 3 — Keep Your Finger Off the Trigger Until On Target with Intent to Fire (4.47) | **HIGH** | `MOD-07-s06` Module Summary — The Four Cardinal Rules (3.13) |
| | `mod07-q5` | MOD-07 | Cardinal Rules Enforcement | `MOD-07-s06` Module Summary — The Four Cardinal Rules (3.61) | **HIGH** | `MOD-07-s00` Rule 1 — Treat Every Weapon as if It Is Loaded (2.32) |
| | `mod09-q3` | MOD-09 | Minimum Standards | `MOD-09-s04` Scoring and Qualification Standards (7.91) | **HIGH** | `MOD-09-s05` Module Summary — Range Qualification Standards (4.87) |
| | `mod-10-q2` | MOD-10 | Dual Licensure Requirement | `MOD-10-s01` License Categories: What You Need to Carry (4.26) | **HIGH** | `MOD-10-s02` The 16-Hour Annual Training Mandate (1.71) |
| | `mod-14-q3` | MOD-14 | Counter-Surveillance and Threat Recognition | `MOD-14-s02` Counter-Surveillance and Pre-Attack Indicators (5.21) | **HIGH** | `MOD-14-s03` Weapon Retention in Close Protection (1.67) |
| | `mod-15-q1` | MOD-15 | AOJ Doctrine — Lethal Force Standard | `MOD-15-s00` Applying AOJ: The Standard for Lethal Force (9.98) | **HIGH** | `MOD-15-s05` After Action: The Tactical Review Standard (1.16) |
| | `mod-16-q2` | MOD-16 | Graham v. Connor Standard | `MOD-16-s01` Legal Framework — Key Provisions Recap (3.88) | **HIGH** | `MOD-16-s03` Professional Standards — The Spartan Standard (1.94) |
| | `pi01-q1` | PI-01 | Licensing | `PI-01-s01` Georgia Licensing: What Title 43 Requires Before You Work (9.75) | **HIGH** | `PI-01-s00` Origins: From Pinkerton to GBPDSA (3.25) |
| | `pi02-q1` | PI-02 | Ethics | `PI-02-s03` GBPDSA Code of Conduct: Violations That End Careers (8.78) | **HIGH** | `PI-02-s00` Honesty: The Absolute Prohibition on Misrepresentation (8.26) |
| | `pi02-q3` | PI-02 | Ethics | `PI-02-s00` Honesty: The Absolute Prohibition on Misrepresentation (5.96) | **HIGH** | `PI-02-s03` GBPDSA Code of Conduct: Violations That End Careers (4.59) |
| | `pi04-q4` | PI-04 | Surveillance Law | `PI-04-s05` OCGA 16-11-62: Georgia Eavesdropping Statute (11.5) | **HIGH** | `PI-04-s01` Misdemeanors: Classification, Penalties, and PI Exposure (4) |
| | `pi05-q1` | PI-05 | Arrest Authority | `PI-05-s00` Citizen Arrest Under OCGA 17-4-60: What It Is and Is Not (11.93) | **HIGH** | `PI-05-s01` Private vs. Peace Officer Authority: The Critical Gap (5.27) |
| | `pi05-q5` | PI-05 | Use of Force | `PI-05-s04` Use of Force by PIs: Strict Self-Defense Standard Only (9.35) | **HIGH** | `PI-05-s01` Private vs. Peace Officer Authority: The Critical Gap (3.92) |
| | `pi06-q2` | PI-06 | Recording Law | `PI-06-s03` OCGA 16-11-62 Redux: Consent, Recording, and Evidence Admissibility (8) | **HIGH** | `PI-06-s00` The 4th Amendment: Why It Matters Even to Private Actors (2.18) |
| | `pi08-q4` | PI-08 | Coercion | `PI-08-s03` Coercion and Duress: The Absolute Line (5.09) | **HIGH** | `PI-08-s01` Cognitive Interview Technique: Memory Enhancement Protocol (0.73) |
| | `pi09-q2` | PI-09 | Process Serving | `PI-09-s01` Personal vs. Substituted Service: Requirements and Validity (9.19) | **HIGH** | `PI-09-s02` Civil Suits, Subpoenas, and Summonses: Types of Process (4.01) |
| | `pi10-q3` | PI-10 | Federal Law | `PI-10-s02` DPPA: Federal Restrictions on DMV Data (8.52) | **HIGH** | `PI-10-s00` Public Records: What Is Available and How to Access It (4.65) |
| | `pi11-q2` | PI-11 | Recording Law | `PI-11-s01` Consent Recording: One-Party vs. Two-Party States (8.95) | **HIGH** | `PI-11-s00` Surveillance Law Foundations: OCGA 16-11-62 Deep Dive (2.6) |
| | `pi11-q5` | PI-11 | GPS Law | `PI-11-s04` GPS Tracking: When It Is Legal in Georgia (5.88) | **HIGH** | `PI-11-s07` Night Operations: Equipment, Safety, and Legal Exposure (1.87) |
| | `pi14-q3` | PI-14 | Chain of Custody | `PI-14-s02` Chain of Custody Documentation: Every Handoff, Every Time (11.09) | **HIGH** | `PI-14-s01` The Investigative Report: Structure, Tone, and Legal Standards (1.94) |
| | `pi15-q4` | PI-15 | Perjury | `PI-15-s03` Perjury: The Absolute Line — Truth Over Client Loyalty (8.13) | **HIGH** | `PI-15-s00` Expert vs. Fact Witness: What Role a PI Typically Plays (0.35) |
| | `pi18-q2` | PI-18 | Entrapment | `PI-18-s01` Entrapment Doctrine: The Absolute Prohibition (6.67) | **HIGH** | `PI-18-s00` Legal Framework: When Deception Is and Is Not Permitted (2.33) |
| | `pi19-q2` | PI-19 | Stalking Law | `PI-19-s01` GA Stalking Law OCGA 16-5-90: Where Surveillance Becomes Criminal (13.94) | **HIGH** | `PI-19-s02` Working with Family Law Attorneys: Admissibility of Evidence (1.55) |
| | `uas02-q1` | UAS-02 | licensing | `UAS-02-s01` The 24-Hour Training Mandate: GA Admin Code 509-3-.01 (8.22) | **HIGH** | `UAS-02-s00` The Georgia Board: Your Licensing Authority (2.53) |
| | `uas05-q1` | UAS-05 | arrest-authority | `UAS-05-s00` OCGA 17-4-60: The Only Arrest Authority You Have (13.1) | **HIGH** | `UAS-05-s01` The Felony-in-Presence Requirement: What It Actually Means (7.22) |
| | `uas05-q5` | UAS-05 | arrest-authority | `UAS-05-s00` OCGA 17-4-60: The Only Arrest Authority You Have (4.47) | **HIGH** | `UAS-05-s03` False Imprisonment: When Your Detention Becomes a Crime (1.79) |
| | `uas07-q1` | UAS-07 | use-of-force | `UAS-07-s00` The Use-of-Force Continuum: A Legal Framework, Not a Checklist (4.62) | **HIGH** | `UAS-07-s01` Imminent Threat Standard: When Physical Force Is Justified (2.02) |
| | `uas08-q4` | UAS-08 | de-escalation | `UAS-08-s00` Why De-escalation Is a Security Skill, Not a Soft Skill (3.5) | **HIGH** | `UAS-08-s03` Pre-Attack Indicators: Recognizing When De-escalation Has Failed (1.5) |
| | `uas10-q2` | UAS-10 | access-control | `UAS-10-s02` Tailgating & Piggybacking: The Access Control Bypass (7.23) | **HIGH** | `UAS-10-s01` Credential Verification Procedures (6.2) |
| | `uas13-q2` | UAS-13 | terrorism-awareness | `UAS-13-s03` Prohibited Profiling — What SAR Is Not (6.13) | **HIGH** | `UAS-13-s05` SAR Field Checklist (2.59) |
| | `uas14-q1` | UAS-14 | bomb-threat | `UAS-14-s01` Bomb Threat Call Procedure — DHS Checklist (7.23) | **HIGH** | `UAS-14-s05` Bomb Threat & Suspicious Package Response Checklist (5.68) |
| | `uas17-q2` | UAS-17 | workplace-violence | `UAS-17-s01` Threat Red Flags & Behavioral Warning Signs (7.07) | **HIGH** | `UAS-17-s00` The Four Types of Workplace Violence (5.42) |
| | `uas18-q4` | UAS-18 | incident-response | `UAS-18-s03` Law Enforcement Handoff — Transferring Scene Control (10.26) | **HIGH** | `UAS-18-s05` Incident Response & Scene Management Checklist (5.89) |
