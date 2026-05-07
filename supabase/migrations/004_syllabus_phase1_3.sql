-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 004: MJM 2026 Syllabus — Phases 1–3
-- Updates module metadata and replaces placeholder questions with
-- curriculum-grounded questions derived directly from the official
-- MJM 2026 Armed Security Accreditation syllabus.
--
-- Phase 1: Legal Framework & Use of Force         (MOD-01–03)
-- Phase 2: Technical Proficiency & Ballistics     (MOD-04–06)
-- Phase 3: Tactical Execution & Range Safety      (MOD-07–09)
--
-- Gate 1.1 questions (Justification of Force) are verbatim from the
-- official knowledge check provided in the syllabus.
-- ════════════════════════════════════════════════════════════════════

-- ── PHASE 1: Legal Framework & Use of Force ──────────────────────

UPDATE public.mjm_modules SET
  title         = 'Legal Accreditation, GBPDSA Standards & 42 USC § 1983',
  description   = 'Establishes the regulatory authority for armed security operations in Georgia. Covers the GBPDSA 16-hour minimum training mandate under GA Code § 509-3-.01, operator licensing requirements, and civil liability exposure under 42 USC § 1983 — deprivation of rights under color of law. Operators who act outside their legal authority expose themselves and their agency to federal civil liability.',
  passing_score = 80,
  duration_hours = 2.0
WHERE id = 'MOD-01';

UPDATE public.mjm_modules SET
  title         = 'Justification of Force — OCGA 16-3-21 & OCGA 17-4-20',
  description   = 'Deadly force is justified ONLY to prevent death, great bodily injury, or a forcible felony under OCGA 16-3-21. Covers the AOJ triad (Ability, Opportunity, Jeopardy), the Use of Force Continuum, the fleeing suspect doctrine under OCGA 17-4-20, and absolute prohibitions — warning shots and shooting to wound are violations of the mandate. This module carries the highest concentration of Critical Fail questions on the platform.',
  passing_score = 80,
  duration_hours = 1.5
WHERE id = 'MOD-02';

UPDATE public.mjm_modules SET
  title         = 'The Reasonable Man Doctrine',
  description   = 'An officer''s use of force must be judged by what a person of ordinary prudence would conclude under the same circumstances. Grounded in Graham v. Connor (1989), this module establishes the three-factor test for evaluating force: severity of the crime, whether the suspect poses an immediate threat, and whether the suspect is actively resisting or fleeing. A genuine but unreasonable belief does not justify force.',
  passing_score = 80,
  duration_hours = 1.5
WHERE id = 'MOD-03';

-- ── PHASE 2: Technical Proficiency & Ballistics ──────────────────

UPDATE public.mjm_modules SET
  title         = 'Terminal Ballistics & Cavitation',
  description   = 'The science of what occurs when a projectile enters tissue. Covers temporary cavity formation through radial stretching of tissue by high-velocity projectiles, permanent cavity wound channels, hollow-point expansion mechanics, and duty ammunition selection to minimize over-penetration in public environments. Maps to US 123515 — Handle and Use a Handgun.',
  passing_score = 75,
  duration_hours = 1.0
WHERE id = 'MOD-04';

UPDATE public.mjm_modules SET
  title         = 'Cycle of Operation — The 8 Phases',
  description   = 'The mechanical sequence every semi-automatic firearm completes with each round fired: 1. Feeding, 2. Chambering, 3. Locking, 4. Firing, 5. Unlocking, 6. Extracting, 7. Ejecting, 8. Cocking. Understanding the cycle is foundational to diagnosing malfunctions, applying immediate action drills, and safely handling the duty weapon.',
  passing_score = 75,
  duration_hours = 1.0
WHERE id = 'MOD-05';

UPDATE public.mjm_modules SET
  title         = 'Handgun Nomenclature & Mechanical Safety Systems',
  description   = 'Identification of all primary handgun components and the function of mechanical safety systems. Covers internal safeties (transfer bars, hammer blocks, firing pin blocks/drop safeties), external safeties (manual thumb safety, grip safety), and striker-fired vs. hammer-fired action types. An operator must understand their duty weapon''s safety architecture to handle it safely and legally.',
  passing_score = 75,
  duration_hours = 1.0
WHERE id = 'MOD-06';

-- ── PHASE 3: Tactical Execution & Range Safety ───────────────────

UPDATE public.mjm_modules SET
  title         = 'The Four Cardinal Rules of Firearms Safety',
  description   = 'The four non-negotiable rules governing every interaction with a firearm: 1. Treat every firearm as loaded. 2. Never point at anything you are unwilling to destroy. 3. Keep your finger straight and off the trigger until sights are on target and the decision to fire is made. 4. Know your target and what is beyond it. Any violation during live fire is an immediate Critical Fail and disqualification.',
  passing_score = 80,
  duration_hours = 1.0
WHERE id = 'MOD-07';

UPDATE public.mjm_modules SET
  title         = 'Weapon Retention — The Lindell Method',
  description   = 'Weapon retention is a life-safety skill. The Lindell Method prioritizes leverage over brute force. The three-phase sequence: Secure (establish weapon control — if the weapon is lost, all other actions are irrelevant), Move (use body mechanics to redirect the attacker''s force), Regain Control (return to a position of tactical advantage). Operators must demonstrate retention under physical pressure scenarios.',
  passing_score = 75,
  duration_hours = 1.0
WHERE id = 'MOD-08';

UPDATE public.mjm_modules SET
  title         = 'Range Qualification Standards',
  description   = 'Live fire qualification under the MJM 2026 standard. Requirements: 144 rounds minimum practice; qualification consists of two 48-round iterations with the highest score recorded; minimum 80% on both written examination and range qualification; operators must qualify with the same type of weapon they carry on duty. Any violation of the Four Cardinal Rules results in immediate disqualification.',
  passing_score = 80,
  duration_hours = 1.5
WHERE id = 'MOD-09';

-- ═══════════════════════════════════════════════════════════════════
-- QUIZ QUESTIONS
-- Clear all existing questions for MOD-01 through MOD-09
-- then insert curriculum-grounded replacements.
-- ═══════════════════════════════════════════════════════════════════

DELETE FROM public.quiz_questions
WHERE module_id IN ('MOD-01','MOD-02','MOD-03','MOD-04','MOD-05','MOD-06','MOD-07','MOD-08','MOD-09');


-- ────────────────────────────────────────────────────────────────
-- MOD-01: Legal Accreditation, GBPDSA Standards & 42 USC § 1983
-- Mapping: GA Code § 509-3-.01 · 42 USC § 1983
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod01-q1', 'MOD-01', 1,
   'What is the minimum annual training requirement for Armed Security Officers under GA Code § 509-3-.01?',
   '8 hours', '16 hours', '24 hours', '40 hours', 'B',
   'GA Code § 509-3-.01 mandates a minimum of 16 hours of annual training for armed security officers under the GBPDSA standard. This is the foundational requirement of the MJM 2026 accreditation program.',
   true, 'GBPDSA Compliance'),

  ('mod01-q2', 'MOD-01', 2,
   'Under 42 USC § 1983, what must be proven to establish a civil rights violation against a security officer?',
   'That a crime was committed under any circumstances',
   'That the officer acted with malice aforethought',
   'That rights secured by the Constitution were deprived under color of state law',
   'That documented physical injury resulted from the officer''s actions',
   'C',
   '42 USC § 1983 requires proving: (1) the defendant acted under color of law, and (2) the conduct deprived a person of a right secured by the Constitution or federal law. Physical injury is not required to state a claim.',
   false, 'Civil Liability'),

  ('mod01-q3', 'MOD-01', 3,
   'A security officer''s PDSC license has lapsed by 30 days and they continue working armed. What is the primary legal risk?',
   'A warning citation from GBPDSA only',
   'They may be operating outside legal authority, exposing themselves to civil and criminal liability',
   'Their employer bears sole responsibility for the lapsed license',
   'No risk exists if the officer plans to renew within 60 days',
   'B',
   'Operating with a lapsed license means the officer is no longer covered by their legal authority to carry or act as a security officer. This creates personal civil and criminal exposure — the employer''s license does not shield an unlicensed individual operator.',
   true, 'Licensing Authority'),

  ('mod01-q4', 'MOD-01', 4,
   'What does "acting under color of law" mean in the context of 42 USC § 1983?',
   'Wearing an official uniform while performing security duties',
   'Following direct orders from a supervisor during an incident',
   'Using power or authority granted by government or state law to act in an official capacity',
   'Operating within the geographic boundaries of a licensed state',
   'C',
   '"Color of law" means using authority derived from government power — a badge, title, or legal authority — to take an action. Private security officers may qualify if they have been given law enforcement-equivalent authority by statute.',
   false, 'Civil Liability'),

  ('mod01-q5', 'MOD-01', 5,
   'The GBPDSA 16-hour minimum training standard for armed security officers is codified under which Georgia regulation?',
   'OCGA 16-3-21', 'OCGA 43-38', 'GA Code § 509-3-.01', 'OCGA 17-4-20', 'C',
   'GA Code § 509-3-.01 is the Board of Private Detectives and Security Agencies rule establishing the 16-hour minimum training standard. OCGA 43-38 covers the broader licensing authority for security agencies.',
   false, 'GBPDSA Compliance');


-- ────────────────────────────────────────────────────────────────
-- MOD-02: Justification of Force — OCGA 16-3-21 & OCGA 17-4-20
-- Gate 1.1 questions are verbatim from the official MJM 2026
-- Knowledge Check provided in the syllabus.
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod02-q1', 'MOD-02', 1,
   'According to OCGA 17-4-20, when may a Security Officer use deadly force against a fleeing suspect?',
   'When they have stolen property exceeding $500',
   'When the officer reasonably believes the suspect possesses a deadly weapon and poses an immediate threat of physical violence',
   'Whenever a felony has been committed',
   'When the suspect refuses multiple verbal commands to stop',
   'B',
   'OCGA 17-4-20 permits deadly force against a fleeing suspect only when the officer has probable cause to believe the suspect poses an imminent deadly threat. Flight alone, property theft, or command refusal does not meet this threshold.',
   true, 'Fleeing Suspect Doctrine'),

  ('mod02-q2', 'MOD-02', 2,
   'Define the "AOJ" triad required to justify the use of force.',
   'Action, Objective, Judgment',
   'Ability, Opportunity, Jeopardy',
   'Assault, Offense, Jurisprudence',
   'Authority, Obligation, Justification',
   'B',
   'AOJ: Ability (the threat has the means to cause harm), Opportunity (they are in a position to use that ability), and Jeopardy (they are demonstrating intent to cause harm). All three elements must be present simultaneously to justify force.',
   false, 'Use of Force Justification'),

  ('mod02-q3', 'MOD-02', 3,
   'A subject lies on the ground and refuses to move. According to the Use of Force Continuum, what level of resistance is this?',
   'Defensive Resistance',
   'Active Resistance',
   'Passive Resistance',
   'Assaultive Resistance',
   'C',
   'Passive Resistance is non-cooperation without physical aggression. The subject is not following commands but is not actively fighting or threatening. It does not justify significant force escalation.',
   false, 'Use of Force Continuum'),

  ('mod02-q4', 'MOD-02', 4,
   'Under OCGA 16-3-21, deadly force is ONLY justified to prevent which of the following?',
   'Any felony offense',
   'Theft of a motor vehicle',
   'Death, great bodily injury, or a forcible felony',
   'Trespassing with intent to commit a crime',
   'C',
   'OCGA 16-3-21 restricts deadly force to preventing death, great bodily injury, or a forcible felony. It does not authorize deadly force to protect property or to prevent any felony — only forcible felonies qualify.',
   true, 'Deadly Force Threshold'),

  ('mod02-q5', 'MOD-02', 5,
   'A security officer fires a warning shot to stop a fleeing shoplifter. Under the MJM 2026 standard, this constitutes:',
   'Acceptable use of force if the shoplifter is a repeat offender',
   'A Critical Fail violation of the use of force mandate',
   'A misdemeanor under Georgia law only',
   'Appropriate response if verbal commands were first issued',
   'B',
   'Warning shots are explicitly prohibited under the MJM 2026 mandate. They constitute uncontrolled deadly force. Deadly force requires imminent threat of death or great bodily injury — property protection does not meet this threshold.',
   true, 'Prohibited Force');


-- ────────────────────────────────────────────────────────────────
-- MOD-03: The Reasonable Man Doctrine
-- Mapping: Graham v. Connor (1989) · Objective Reasonableness
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod03-q1', 'MOD-03', 1,
   'The "Reasonable Man" standard requires that an officer''s belief be based on what?',
   'Their personal past experiences with similar suspects',
   'What a person of ordinary prudence would conclude under the same circumstances',
   'What their supervisor instructed them to do in similar situations',
   'The totality of the suspect''s criminal history',
   'B',
   'The Reasonable Man standard is objective — it asks what a person of ordinary prudence would conclude, not what this specific officer believed. Personal bias, past experience, or supervisor instructions do not satisfy the standard.',
   false, 'Objective Reasonableness'),

  ('mod03-q2', 'MOD-03', 2,
   'In Graham v. Connor (1989), the Supreme Court established that use-of-force claims must be analyzed under which constitutional standard?',
   '14th Amendment — substantive due process',
   '8th Amendment — cruel and unusual punishment',
   '4th Amendment — objective reasonableness',
   '5th Amendment — self-incrimination protection',
   'C',
   'Graham v. Connor held that all use-of-force claims by free citizens must be analyzed under the 4th Amendment''s objective reasonableness standard, not the 14th Amendment substantive due process analysis that lower courts had been applying.',
   true, 'Graham v. Connor'),

  ('mod03-q3', 'MOD-03', 3,
   'Which three factors does Graham v. Connor identify for evaluating whether force was reasonable?',
   'Intent of the officer, weapon type used, and severity of injury caused',
   'Severity of the crime, whether the suspect poses an immediate threat, and whether the suspect is actively resisting or fleeing',
   'Officer training level, suspect age, and crime location',
   'Verbal commands given, backup availability, and response time',
   'B',
   'The Graham three-factor test: (1) the severity of the crime at issue, (2) whether the suspect poses an immediate threat to officers or others, and (3) whether the suspect is actively resisting arrest or attempting to evade by flight.',
   true, 'Graham Three-Factor Test'),

  ('mod03-q4', 'MOD-03', 4,
   'An officer acts on a genuine but objectively unreasonable belief that force was necessary. Under the Reasonable Man Doctrine, their use of force is:',
   'Justified — they genuinely believed it was necessary',
   'Justified if their supervisor would have made the same decision',
   'Unjustified — belief must be both genuine and objectively reasonable',
   'Evaluated solely by the outcome and any injuries caused',
   'C',
   'The standard is objective, not subjective. A sincere personal belief is not sufficient if a reasonable officer in the same situation would not have reached the same conclusion. This is one of the most frequently litigated concepts in use-of-force law.',
   true, 'Objective vs. Subjective Standard');


-- ────────────────────────────────────────────────────────────────
-- MOD-04: Terminal Ballistics & Cavitation
-- Mapping: US 123515 — Handle and Use a Handgun
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod04-q1', 'MOD-04', 1,
   'What is a "temporary cavity" in terminal ballistics?',
   'The permanent wound channel created by a bullet''s passage through tissue',
   'A void created by radial stretching of tissue as a high-velocity projectile transfers energy outward',
   'The space inside a hollow-point bullet before it expands on impact',
   'The area of reduced air pressure immediately behind a moving projectile',
   'B',
   'A temporary cavity forms as the projectile transfers kinetic energy outward, radially stretching surrounding tissue. It is temporary because elastic tissue rebounds. The permanent cavity is the actual wound channel that remains.',
   false, 'Wound Ballistics'),

  ('mod04-q2', 'MOD-04', 2,
   'Which projectile type is specifically designed to expand upon impact, increasing energy transfer and reducing over-penetration?',
   'Full metal jacket (FMJ)',
   'Armor-piercing',
   'Hollow-point',
   'Wadcutter',
   'C',
   'Hollow-point ammunition expands upon impact, increasing bullet diameter, transferring more energy, and reducing over-penetration risk. FMJ rounds do not expand and present a higher through-and-through risk in public settings.',
   false, 'Duty Ammunition'),

  ('mod04-q3', 'MOD-04', 3,
   'What is the primary factor that determines the size of a temporary cavity?',
   'Bullet weight', 'Bullet diameter', 'Projectile velocity', 'Barrel length', 'C',
   'Velocity dominates temporary cavity formation because kinetic energy is proportional to the square of velocity (KE = ½mv²). A small increase in velocity has a far greater effect on energy transfer — and cavity size — than an equivalent increase in mass.',
   false, 'Wound Ballistics'),

  ('mod04-q4', 'MOD-04', 4,
   'For duty carry where the public is present, which ammunition characteristic is most important to minimize collateral risk?',
   'Maximum velocity for immediate incapacitation',
   'Controlled expansion to reduce over-penetration risk',
   'Full metal jacket construction for reliable feeding',
   'Maximum bullet weight for deep penetration',
   'B',
   'In public environments, controlled expansion reduces the risk of a round passing through the target and injuring bystanders. Over-penetration is the primary ammunition-related concern in populated settings.',
   false, 'Duty Ammunition Selection'),

  ('mod04-q5', 'MOD-04', 5,
   'The permanent cavity in a wound track is determined primarily by which factor?',
   'Projectile velocity',
   'Size of the temporary cavity',
   'Bullet diameter and construction',
   'Distance from muzzle to target',
   'C',
   'The permanent cavity is the tissue structurally displaced by the bullet''s passage — determined by bullet diameter and whether it expands. The temporary cavity is a radial stretch injury; the permanent cavity is the lasting structural damage.',
   false, 'Wound Ballistics');


-- ────────────────────────────────────────────────────────────────
-- MOD-05: Cycle of Operation — The 8 Phases
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod05-q1', 'MOD-05', 1,
   'What is the correct sequence of all 8 phases in the cycle of operation?',
   'Feeding, Firing, Chambering, Locking, Unlocking, Extracting, Ejecting, Cocking',
   'Feeding, Chambering, Locking, Firing, Unlocking, Extracting, Ejecting, Cocking',
   'Chambering, Feeding, Locking, Firing, Extracting, Unlocking, Cocking, Ejecting',
   'Firing, Feeding, Chambering, Locking, Ejecting, Extracting, Unlocking, Cocking',
   'B',
   'The correct sequence: 1-Feeding, 2-Chambering, 3-Locking, 4-Firing, 5-Unlocking, 6-Extracting, 7-Ejecting, 8-Cocking. Memorizing this sequence is foundational for malfunction diagnosis and immediate action drills.',
   false, 'Cycle of Operation'),

  ('mod05-q2', 'MOD-05', 2,
   'Which phase seats the cartridge fully into the chamber?',
   'Feeding', 'Chambering', 'Locking', 'Cocking', 'B',
   'Chambering is phase 2. Feeding (phase 1) strips the round from the magazine; Chambering delivers it into the chamber as the slide or bolt moves forward.',
   false, 'Cycle of Operation'),

  ('mod05-q3', 'MOD-05', 3,
   'What phase immediately follows the Firing phase?',
   'Extracting', 'Ejecting', 'Unlocking', 'Cocking', 'C',
   'After Firing (phase 4), gas pressure must be relieved before the bolt moves rearward. Unlocking (phase 5) disengages the bolt or slide from battery, enabling Extracting in phase 6.',
   false, 'Cycle of Operation'),

  ('mod05-q4', 'MOD-05', 4,
   'A shooter hears a click instead of a bang. After Tap-Rack-Assess, the pistol still does not fire. This is most consistent with:',
   'A failure to feed — round not fully chambered',
   'A stovepipe — spent case caught in the ejection port',
   'A double feed — two rounds attempting to chamber simultaneously',
   'A failure to fire requiring full clearance: lock, strip, rack three times, reload',
   'D',
   'If Tap-Rack-Assess does not clear the malfunction, a double feed or failure to extract a fired case is likely. The correct clearance is: lock the slide open, strip the magazine, rack three times to clear the chamber, then reload.',
   false, 'Malfunction Clearance'),

  ('mod05-q5', 'MOD-05', 5,
   'During which phase is the striker or hammer reset for the next round?',
   'Extracting', 'Ejecting', 'Unlocking', 'Cocking', 'D',
   'Cocking is the final phase (8). The rearward travel of the slide resets the striker or cocks the hammer, preparing the weapon to fire again when the slide returns to battery on the next cycle.',
   false, 'Cycle of Operation');


-- ────────────────────────────────────────────────────────────────
-- MOD-06: Handgun Nomenclature & Mechanical Safety Systems
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod06-q1', 'MOD-06', 1,
   'What is the function of a "transfer bar" safety on a revolver?',
   'It locks the cylinder in place during firing',
   'It prevents the hammer from contacting the firing pin unless the trigger is fully pressed',
   'It transfers trigger pull weight directly to the firing pin',
   'It physically blocks the barrel when the external safety lever is engaged',
   'B',
   'A transfer bar interposes between the hammer and firing pin only when the trigger is fully depressed. Without a complete trigger press, the hammer cannot reach the firing pin — preventing discharge if the revolver is dropped.',
   false, 'Internal Safety Systems'),

  ('mod06-q2', 'MOD-06', 2,
   'A striker-fired pistol differs from a hammer-fired pistol in which fundamental way?',
   'It cannot incorporate any manual external safety system',
   'It uses a spring-loaded striker instead of a hammer to initiate primer ignition',
   'It mechanically requires a heavier trigger pull for safety',
   'It can only fire in double-action mode',
   'B',
   'Striker-fired pistols (e.g., Glock, M&P) use a partially or fully pre-cocked spring-loaded striker released by the trigger, rather than a hammer falling on a firing pin. They typically have consistent trigger pulls and rely on internal passive safeties.',
   false, 'Action Types'),

  ('mod06-q3', 'MOD-06', 3,
   'Which component guides a cartridge from the magazine into proper alignment with the chamber during the feeding phase?',
   'The slide stop', 'The ejector', 'The feed ramp', 'The extractor', 'C',
   'The feed ramp is a polished inclined surface at the chamber entrance that guides the round upward from the magazine lips into the chamber. A damaged or fouled feed ramp is a common cause of failure-to-feed malfunctions.',
   false, 'Firearm Components'),

  ('mod06-q4', 'MOD-06', 4,
   'What is the primary function of the extractor in a semi-automatic pistol?',
   'Strips a cartridge from the magazine and guides it toward the chamber',
   'Hooks onto the cartridge rim and pulls the spent case rearward out of the chamber',
   'Throws the spent case clear of the ejection port',
   'Holds the slide open after the last round is fired',
   'B',
   'The extractor is a spring-loaded hook that grips the cartridge rim as the round chambers, then pulls the spent case rearward during the extracting phase. The ejector — a fixed post inside the frame — knocks the case out through the ejection port.',
   false, 'Firearm Components'),

  ('mod06-q5', 'MOD-06', 5,
   'A "firing pin block" or "drop safety" functions to:',
   'Prevent the hammer from falling when the external safety lever is engaged',
   'Lock the cylinder against rotation when the action is open',
   'Physically block the firing pin channel until the trigger is fully pressed',
   'Disconnect the trigger from the sear after each shot',
   'C',
   'A firing pin block physically obstructs the firing pin channel until the trigger is pressed. This prevents discharge if the pistol is dropped — even if impact force is sufficient to drive the firing pin forward without the trigger being engaged.',
   false, 'Internal Safety Systems');


-- ────────────────────────────────────────────────────────────────
-- MOD-07: The Four Cardinal Rules of Firearms Safety
-- Critical Fail: Rules 1, 2, 3 violations; any violation on range
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod07-q1', 'MOD-07', 1,
   'According to the Four Cardinal Rules, at what point should a finger enter the trigger guard?',
   'When the officer has decided to draw the weapon from the holster',
   'When the threat has been verbally identified',
   'Only when sights are on target AND the decision to fire has been finalized',
   'As soon as the weapon clears the holster',
   'C',
   'Cardinal Rule 3 is absolute: the trigger finger remains straight along the frame outside the trigger guard until the sights are on target and the conscious decision to fire has been made. Earlier placement risks unintentional discharge.',
   true, 'Cardinal Rule 3 — Trigger Discipline'),

  ('mod07-q2', 'MOD-07', 2,
   'Which of the Four Cardinal Rules requires treating every firearm as loaded at all times?',
   'Rule 2 — Never point at anything you are unwilling to destroy',
   'Rule 3 — Keep your finger off the trigger until ready to shoot',
   'Rule 1 — Treat every firearm as if it is loaded',
   'Rule 4 — Know your target and what is beyond it',
   'C',
   'Rule 1 is the foundational rule. It eliminates the concept of an "unloaded" gun. If every firearm is always treated as loaded, the other three rules follow naturally. Most negligent discharges begin with certainty that a weapon is unloaded.',
   true, 'Cardinal Rule 1'),

  ('mod07-q3', 'MOD-07', 3,
   'An officer places their trigger finger inside the trigger guard while holstering after a drill. Under MJM 2026, this constitutes:',
   'Acceptable practice if the manual safety is engaged',
   'A violation of Cardinal Rule 3 resulting in immediate Critical Fail and disqualification from the range session',
   'Normal technique for striker-fired pistols without external safeties',
   'Acceptable if the officer moves slowly and deliberately',
   'B',
   'Trigger discipline applies equally during holstering as during presentation. The finger must remain outside the guard until fully holstered. Negligent discharges during holstering are among the most common range accidents.',
   true, 'Cardinal Rule 3 — Critical Application'),

  ('mod07-q4', 'MOD-07', 4,
   'Cardinal Rule 4 — "Know your target and what is beyond it" — primarily addresses which concern?',
   'Correctly identifying the suspect in a crowd',
   'Ensuring the firearm''s sights are properly zeroed for the engagement distance',
   'Preventing injury to unintended persons if a round passes through or misses the target',
   'Confirming the threat is still active before engaging',
   'C',
   'A round that misses, passes through the target, or ricochets will travel until it strikes something or someone. The operator is responsible for every round fired. Rule 4 requires knowing what is in the projectile''s path.',
   false, 'Cardinal Rule 4'),

  ('mod07-q5', 'MOD-07', 5,
   'A violation of any Cardinal Rule during a live fire range session results in:',
   'A verbal warning for the first offense',
   'Removal from the firing line and a score reduction',
   'Immediate disqualification and Critical Fail of the range qualification',
   'A mandatory remedial session before continuing the same day',
   'C',
   'The Cardinal Rules exist because a single violation can cause death or serious injury. There is no warning system on a live fire range — any cardinal rule violation results in immediate disqualification. This is a non-negotiable safety standard under MJM 2026.',
   true, 'Cardinal Rules Enforcement');


-- ────────────────────────────────────────────────────────────────
-- MOD-08: Weapon Retention — The Lindell Method
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod08-q1', 'MOD-08', 1,
   'What is the fundamental operational principle underlying the Lindell Method of weapon retention?',
   'Creating distance from the attacker before the weapon is drawn',
   'Using leverage and body mechanics over brute muscular strength',
   'Issuing verbal commands while transitioning to a secondary weapon',
   'Drawing and presenting the weapon before physical contact occurs',
   'B',
   'The Lindell Method is built on biomechanical leverage. Trying to overpower an attacker with brute strength is unreliable under stress and against larger opponents. Leverage and body rotation are consistent and effective regardless of size differential.',
   false, 'Lindell Method Principle'),

  ('mod08-q2', 'MOD-08', 2,
   'In the Lindell Method, what are the three core sequential actions?',
   'Draw, Retain, Strike',
   'Secure, Move, and Regain Control',
   'Block, Counter, Disengage',
   'Clinch, Rotate, Retreat',
   'B',
   'Secure: establish immediate weapon control. Move: use body mechanics to redirect the attacker''s force and break their grip. Regain Control: return to a position of tactical advantage and assess the threat.',
   false, 'Lindell Three-Phase Sequence'),

  ('mod08-q3', 'MOD-08', 3,
   'Why is "Secure" designated as the first action in the Lindell retention sequence?',
   'It creates time for backup to arrive before escalating to physical contact',
   'Because if the weapon is lost, all subsequent actions become irrelevant',
   'Because verbal commands must be exhausted before physical retention begins',
   'It gives the officer an opportunity to create distance first',
   'B',
   '"Secure" is the priority because a lost weapon becomes a weapon against the officer. All other tactical options — striking, disengaging, transitioning — are irrelevant or dangerous if the primary weapon is in the attacker''s hands.',
   false, 'Retention Priority'),

  ('mod08-q4', 'MOD-08', 4,
   'During a weapon grab attempt, the Lindell Method directs the officer to primarily use:',
   'Maximum muscular force to counter the attacker''s pull',
   'Body weight, rotation, and leverage to redirect the attacker''s force',
   'A verbal distraction to momentarily release the attacker''s grip',
   'A step backward to create a reactionary gap',
   'B',
   'Stepping back may not break the grip and surrenders positional advantage. The Lindell method uses the attacker''s own force by rotating into their pull — breaking the grip through leverage rather than opposing it directly.',
   false, 'Technique Application'),

  ('mod08-q5', 'MOD-08', 5,
   'Weapon retention is classified under which phase of the MJM 2026 curriculum?',
   'Phase 1 — Legal Framework & Use of Force',
   'Phase 2 — Technical Proficiency & Ballistics',
   'Phase 3 — Tactical Execution & Range Safety',
   'Phase 4 — Emergency Response Procedures',
   'C',
   'Weapon retention is a tactical execution skill under Phase 3 of the MJM 2026 curriculum, grouped with the Four Cardinal Rules and Range Qualification as live operational performance standards.',
   false, 'Curriculum Mapping');


-- ────────────────────────────────────────────────────────────────
-- MOD-09: Range Qualification Standards
-- Minimum 80% on both written and live fire. 144 rounds / 48 qual.
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
  ('mod09-q1', 'MOD-09', 1,
   'What is the minimum practice round count required before qualification under MJM 2026?',
   '48 rounds', '96 rounds', '144 rounds', '200 rounds', 'C',
   'MJM 2026 mandates a minimum of 144 rounds of practice before the 48-round qualification course. This ensures demonstrated proficiency rather than a single-event performance.',
   false, 'Qualification Requirements'),

  ('mod09-q2', 'MOD-09', 2,
   'The MJM 2026 qualification uses two 48-round iterations. What score is officially recorded?',
   'The average score of both iterations',
   'The score from the first iteration',
   'The highest score of the two iterations',
   'The most recent iteration score',
   'C',
   'Recording the highest score of two attempts acknowledges that performance can vary under stress. It gives the operator the benefit of demonstrating peak capability while requiring both attempts to be observed by the range instructor.',
   false, 'Scoring Protocol'),

  ('mod09-q3', 'MOD-09', 3,
   'What is the minimum passing score for both the written examination and live fire qualification under MJM 2026?',
   '70%', '75%', '80%', '85%', 'C',
   'MJM 2026 requires a minimum of 80% on both components. Both must be passed independently — a perfect written score does not compensate for a failing range qualification score.',
   true, 'Minimum Standards'),

  ('mod09-q4', 'MOD-09', 4,
   'An officer qualifies with a full-size duty pistol but carries a compact version of the same model daily. Under MJM 2026, this is:',
   'Acceptable — the action type and caliber are identical',
   'Acceptable — only the caliber matters for qualification purposes',
   'A violation — the officer must qualify with the same type of weapon they carry on duty',
   'Permitted with written approval from the range instructor',
   'C',
   'The officer must qualify with their actual carry weapon. Different form factors (full-size vs. compact) have different sight radii, grip dimensions, trigger characteristics, and recoil. Qualification with one does not validate proficiency with the other.',
   true, 'Weapon Qualification Requirement'),

  ('mod09-q5', 'MOD-09', 5,
   'During live fire qualification, an officer experiences a failure to fire. The correct immediate action sequence is:',
   'Rack the slide, then tap the magazine base',
   'Tap the magazine base, rack the slide, then assess the target',
   'Remove the magazine, clear the chamber, then reload',
   'Immediately call the range officer before attempting clearance',
   'B',
   'Tap-Rack-Assess: (1) Tap the magazine base firmly to ensure seating, (2) Rack the slide to eject any faulty round and chamber a fresh one, (3) Assess — confirm threat status and sight picture. This is the standard immediate action drill for failure-to-fire.',
   false, 'Immediate Action Drills');


-- ═══════════════════════════════════════════════════════════════════
-- UPDATE critical_question_ids ON EACH MODULE
-- These IDs are referenced by the Hard Gate evaluation logic and
-- by the SCORM webhook handler for Critical Fail detection.
-- ═══════════════════════════════════════════════════════════════════

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY['mod01-q1','mod01-q3']
  WHERE id = 'MOD-01';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY['mod02-q1','mod02-q4','mod02-q5']
  WHERE id = 'MOD-02';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY['mod03-q2','mod03-q3','mod03-q4']
  WHERE id = 'MOD-03';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY[]::TEXT[]
  WHERE id = 'MOD-04';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY[]::TEXT[]
  WHERE id = 'MOD-05';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY[]::TEXT[]
  WHERE id = 'MOD-06';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY['mod07-q1','mod07-q2','mod07-q3','mod07-q5']
  WHERE id = 'MOD-07';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY[]::TEXT[]
  WHERE id = 'MOD-08';

UPDATE public.mjm_modules
  SET critical_question_ids = ARRAY['mod09-q3','mod09-q4']
  WHERE id = 'MOD-09';
