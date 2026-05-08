-- ============================================================
-- 006_module_lessons.sql
-- Interactive lesson player content for MJM 2026 Armed Security
-- MOD-01 through MOD-09 seeded from the 16-hour GBPDSA PDF
-- ============================================================

CREATE TABLE IF NOT EXISTS public.module_lessons (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   TEXT  NOT NULL REFERENCES public.mjm_modules(id) ON DELETE CASCADE UNIQUE,
  title       TEXT  NOT NULL,
  slides      JSONB NOT NULL DEFAULT '[]',
  slide_count INT   GENERATED ALWAYS AS (jsonb_array_length(slides)) STORED,
  version     INT   NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.module_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lesson_select_gate" ON public.module_lessons;
CREATE POLICY "lesson_select_gate" ON public.module_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mjm_modules m
      WHERE m.id = module_lessons.module_id
        AND (
          m.sequence_order = 1
          OR EXISTS (
            SELECT 1 FROM public.operator_progress op
            JOIN public.mjm_modules prev
              ON prev.id = op.module_id
             AND prev.sequence_order = m.sequence_order - 1
            WHERE op.operator_id = auth.uid()
              AND op.is_competent = true
          )
        )
    )
  );

-- Idempotent seed
DELETE FROM public.module_lessons
WHERE module_id IN ('MOD-01','MOD-02','MOD-03','MOD-04','MOD-05','MOD-06','MOD-07','MOD-08','MOD-09');

-- ── MOD-01: Legal Accreditation, GBPDSA Standards & 42 USC § 1983 ──────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-01',
'Legal Accreditation, GBPDSA Standards & 42 USC § 1983',
$slides_01$
[
  {
    "type": "slide",
    "heading": "Program Authority: Who Governs Armed Security in Georgia",
    "body": "The Georgia Board of Private Detectives and Security Agencies (GBPDSA) is the sole regulatory authority for armed security operators in the state. Operating without a valid GBPDSA license — or working for an agency without one — is a criminal offense. The MJM 2026 program meets and exceeds all GBPDSA-mandated training requirements under GA Administrative Code 509-3-.01.",
    "keyPoints": [
      "GBPDSA issues and enforces all armed security licenses in Georgia",
      "Minimum 16 hours of annual firearms training mandated by 509-3-.01",
      "Both the individual operator AND the agency must hold current licensure",
      "Expired or suspended licenses make any enforcement action legally void"
    ],
    "legalRef": "GA Code 509-3-.01",
    "callout": { "type": "warning", "text": "Operating as an armed security officer without a current GBPDSA license is a misdemeanor on first offense and a felony on repeat offense. There are no exceptions." }
  },
  {
    "type": "slide",
    "heading": "The 16-Hour Training Mandate — What It Covers",
    "body": "Georgia law requires armed security officers to complete 16 hours of training annually. This is not optional and is not waived by prior law enforcement experience. The MJM 2026 curriculum is structured to satisfy every GBPDSA category: legal foundations, firearms safety and handling, range qualification, and professional conduct.",
    "keyPoints": [
      "16 hours minimum per calendar year — GBPDSA audits agency training records",
      "Range qualification must include live-fire proficiency at minimum 80%",
      "Training must be delivered by a GBPDSA-certified instructor",
      "Records must be maintained for a minimum of 3 years"
    ],
    "legalRef": "GA Code 509-3-.01 | GBPDSA Training Standards 2026",
    "callout": { "type": "info", "text": "Your completion record on this platform constitutes your official MJM 2026 training log. Scores and completion timestamps are immutably recorded." }
  },
  {
    "type": "slide",
    "heading": "Licensing Requirements: Four Conditions Before You Carry",
    "body": "Before an armed security officer legally carries a firearm on duty in Georgia, four conditions must be satisfied simultaneously. Missing any single condition creates legal liability for the operator, the client, and the agency.",
    "keyPoints": [
      "1. Valid GBPDSA Armed Security Officer License (individual)",
      "2. Employer agency holds an active GBPDSA Agency License",
      "3. Current-year completion of the 16-hour training requirement on file",
      "4. Successful range qualification on file — minimum 80%",
      "Firearms must be listed on the operator license — unlisted firearms cannot be carried on duty"
    ],
    "callout": { "type": "warning", "text": "Carrying a firearm not listed on your GBPDSA license — even if you personally own it and it is legal to possess — is a violation of your license terms and grounds for revocation." }
  },
  {
    "type": "slide",
    "heading": "42 USC 1983 — Civil Liability Under Color of Law",
    "body": "Section 1983 is the primary federal mechanism by which citizens sue law enforcement and security personnel for civil rights violations. Unlike criminal prosecution, Section 1983 is a civil action — the plaintiff does not need a criminal conviction to succeed. Armed security officers acting in an official capacity (badge, uniform, or representing an agency) can be sued if they deprive someone of a constitutionally protected right.",
    "keyPoints": [
      "Any person acting under color of law can be sued under 42 USC 1983",
      "Armed security in uniform or with authority symbols may qualify",
      "Damages are personal — not always covered by employer insurance",
      "Most common claims: wrongful detention, excessive force, unlawful search",
      "Good faith defense requires documented adherence to training and policy"
    ],
    "legalRef": "42 USC 1983 — Civil action for deprivation of rights",
    "callout": { "type": "warning", "text": "A single unjustified use-of-force incident can result in a federal civil rights lawsuit with no damages cap. Your training documentation is your primary defense." }
  },
  {
    "type": "scenario",
    "scenario": "Officer Reyes is working a post at a private shopping center. Store security asks Reyes to hold a man they believe shoplifted. Reyes stops the man, places a hand on his arm, and prevents him from leaving for 8 minutes while the store reviews footage. The footage shows no theft. The man files a 1983 complaint against Reyes for unlawful detention under color of law.",
    "reflection": "Was Reyes acting under color of law? What elements would the plaintiff need to prove? What should Reyes have done when asked by store personnel to detain the individual without independent legal justification?"
  },
  {
    "type": "checklist",
    "title": "Pre-Shift Compliance Checklist",
    "items": [
      { "label": "License in Wallet", "description": "GBPDSA Armed Security license must be physically present — not a photo. If asked by law enforcement or a client, you must produce it." },
      { "label": "License Not Expired", "description": "Check the expiration date. An expired license means you cannot legally carry. You are responsible for compliance regardless of employer reminders." },
      { "label": "Duty Firearm Listed", "description": "Confirm the make, model, and caliber of your duty firearm matches what is listed on your GBPDSA license. A different weapon requires a license amendment." },
      { "label": "Annual Training Current", "description": "Confirm your 16-hour training is on file with your agency for the current calendar year. This platform logs your completion automatically." },
      { "label": "Post Orders Reviewed", "description": "Review the current site-specific post orders before assuming post. Post orders define your authority and limitations — deviation creates personal liability." }
    ]
  },
  {
    "type": "slide",
    "heading": "Module Summary — Legal Foundations You Must Own",
    "body": "Every use-of-force decision, every enforcement action, and every interaction you conduct on duty will be evaluated against the legal framework defined in this module. Your defense in any adverse event begins with proof that you were properly licensed, trained, and acting within your defined legal authority.",
    "keyPoints": [
      "GBPDSA is your licensing authority — know its requirements precisely",
      "The 16-hour training mandate is annual and non-negotiable",
      "42 USC 1983 means civil rights violations expose you personally",
      "Every pre-shift checklist item is a legal requirement, not a suggestion",
      "This platform records are immutable — they are your official training log"
    ],
    "callout": { "type": "tip", "text": "You are now ready for the Module 01 Knowledge Assessment. It contains 5 questions including one Critical Fail question — an incorrect answer on that question triggers an immediate Tactical Reset." }
  }
]
$slides_01$::jsonb
);

-- ── MOD-02: Justification of Force — OCGA 16-3-21 & OCGA 17-4-20 ───────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-02',
'Justification of Force — OCGA 16-3-21 & OCGA 17-4-20',
$slides_02$
[
  {
    "type": "slide",
    "heading": "What Is Deadly Force?",
    "body": "Deadly force is any force that is likely to cause death or great bodily harm. This is not limited to firearms — it includes any weapon, vehicle, or physical action that could produce that result. Understanding what qualifies as deadly force is the foundation for every use-of-force decision you will ever make as an armed security officer.",
    "keyPoints": [
      "Deadly force = force likely to cause death OR great bodily harm",
      "Includes firearms, edged weapons, blunt objects, vehicles, and strangulation",
      "Great bodily harm = serious physical injury causing permanent damage or disfigurement",
      "The test is likelihood of outcome — not intent of the officer",
      "Lesser force that escalates to deadly levels changes your legal exposure mid-incident"
    ],
    "callout": { "type": "info", "text": "The law evaluates what a reasonable officer would perceive the force to be capable of — not what you intended. A baton strike to the head is deadly force regardless of intent." }
  },
  {
    "type": "slide",
    "heading": "OCGA 16-3-21 — Use of Force in Defense of Self and Others",
    "body": "Georgia Code 16-3-21 establishes when a person is justified in using force, including deadly force, in defense of themselves or a third person. This is the statutory foundation for every defensive use of force by armed security officers in the state.",
    "keyPoints": [
      "A person is justified in using force to defend against another's imminent use of unlawful force",
      "Deadly force is justified only when necessary to prevent death or great bodily injury",
      "The threat must be IMMINENT — not past, not future, not potential",
      "Force used must be proportionate to the threat presented",
      "Duty to retreat does NOT apply in Georgia — but avoidance is still preferable when safe"
    ],
    "legalRef": "OCGA 16-3-21 — Justification for use of force",
    "callout": { "type": "warning", "text": "Deadly force is not justified to protect property alone. You may not shoot a fleeing shoplifter, even if you witness the crime." }
  },
  {
    "type": "slide",
    "heading": "Three Situations Justifying Deadly Force",
    "body": "Georgia law and established case doctrine recognize exactly three circumstances in which deadly force may be justified for armed security personnel. All three require that the threat be imminent and that no lesser force option is adequate.",
    "keyPoints": [
      "1. Defense of self from imminent great bodily harm or death",
      "2. Defense of a third person from imminent great bodily harm or death",
      "3. Prevention of a forcible felony — a felony involving use or threat of physical force",
      "In ALL cases: the threat must be imminent, the force proportionate, and alternatives considered",
      "Forcible felonies include: aggravated assault, robbery, rape, kidnapping, home invasion"
    ],
    "legalRef": "OCGA 16-3-21 | OCGA 16-1-3(6) — Forcible Felony definition",
    "callout": { "type": "warning", "text": "Deadly force to prevent a non-forcible felony (shoplifting, trespass, fraud) is never justified. Misapplication of this standard has ended careers and resulted in imprisonment." }
  },
  {
    "type": "slide",
    "heading": "OCGA 17-4-20 — Deadly Force and the Power of Arrest",
    "body": "Georgia Code 17-4-20 governs use of deadly force in arrest situations. This statute is primarily designed for sworn law enforcement, but armed security personnel acting in a quasi-enforcement capacity must understand its limits — particularly because security officers do NOT have the same arrest authority as sworn officers.",
    "keyPoints": [
      "Sworn officers may use deadly force to prevent escape only when felony involves violence",
      "Security officers have citizen arrest authority only — and only for offenses committed in their presence",
      "Shooting a fleeing suspect by a security officer is almost never legally justified",
      "Deadly force to effect a citizen arrest exposes the officer to criminal and civil liability",
      "When in doubt: observe, document, and call law enforcement — do not pursue"
    ],
    "legalRef": "OCGA 17-4-20 — Use of force in arrest situations",
    "callout": { "type": "warning", "text": "You are NOT a sworn law enforcement officer. Your authority is narrower. Actions lawful for a sworn officer may be criminal for a security officer." }
  },
  {
    "type": "slide",
    "heading": "The AOJ Triad — Your Decision Framework",
    "body": "Every justified use of deadly force can be analyzed through three elements that must ALL be present simultaneously at the moment of the decision. If any element is absent, deadly force is not justified. This framework — Ability, Opportunity, Jeopardy — is used by courts and investigators when reviewing use-of-force incidents.",
    "keyPoints": [
      "ABILITY: The threat has the capability to cause death or great bodily harm (weapon, size, number, training)",
      "OPPORTUNITY: The threat has the ability to immediately apply that capability (within effective range, no barrier)",
      "JEOPARDY: You or another person is in immediate danger — the threat is acting or about to act",
      "All three must be present simultaneously — any one absent = deadly force not justified",
      "Courts apply this framework in hindsight — document your reasoning whenever possible"
    ],
    "callout": { "type": "info", "text": "A person across the street with a knife may have Ability but lacks Opportunity. A person 3 feet away with hands raised may lack Jeopardy. The triad is not a checkbox — it is a complete assessment." }
  },
  {
    "type": "scenario",
    "scenario": "Officer Torres is posted at a bank. A male subject enters, does not speak, and slowly approaches the teller counter. He reaches into his waistband. Officer Torres draws her firearm and orders the subject to stop. The subject freezes, then slowly removes his hand — holding a cell phone. No weapon is visible. The subject had no criminal intent.",
    "reflection": "Apply the AOJ framework to this incident at the moment Torres drew her weapon. Were all three elements present? What factors most influenced her perception? What training or environmental factors could reduce false-positive threat assessments?"
  },
  {
    "type": "slide",
    "heading": "Module Summary — Justification of Force",
    "body": "Every use of force you employ on duty must be legally justified at the moment it is applied. The AOJ triad gives you a framework. OCGA 16-3-21 gives you the statutory basis. Knowing both cold — before an incident, not during — is what separates a defensible action from a criminal conviction.",
    "keyPoints": [
      "Deadly force is justified only in three specific situations — not as general deterrence",
      "The AOJ triad must be satisfied in full — all three elements, simultaneously",
      "OCGA 16-3-21 governs defense of self and others",
      "OCGA 17-4-20 governs arrest situations — your authority here is very limited",
      "When force is not justified: observe, communicate, withdraw, and call law enforcement"
    ],
    "callout": { "type": "tip", "text": "Ready for the Module 02 Knowledge Assessment. This module has three Critical Fail questions related to the justification of deadly force — answer carefully." }
  }
]
$slides_02$::jsonb
);

-- ── MOD-03: The Reasonable Man Doctrine ────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-03',
'The Reasonable Man Doctrine',
$slides_03$
[
  {
    "type": "slide",
    "heading": "The Reasonable Man Standard",
    "body": "The Reasonable Man Doctrine is the legal standard used to evaluate whether a use of force was justified. It asks a single question: would a reasonable officer in the same situation, with the same information available at the moment of decision, have believed the force was necessary? The standard is objective — it is not what YOU believed, but what a reasonable person would have believed.",
    "keyPoints": [
      "Objective standard — evaluated from the perspective of a reasonable officer in the same circumstances",
      "Accounts for the tense, uncertain, rapidly evolving nature of use-of-force situations",
      "The officer is judged on information available at the moment, not information discovered afterward",
      "Post-incident facts that change the picture do not retroactively justify unjustified force",
      "A genuine but unreasonable belief does not satisfy the standard"
    ],
    "callout": { "type": "info", "text": "If you fired because you genuinely believed you were about to be shot, but no reasonable officer would have shared that belief given the same facts, the force was not legally justified." }
  },
  {
    "type": "slide",
    "heading": "Graham v. Connor (1989) — The Supreme Court Standard",
    "body": "The U.S. Supreme Court case Graham v. Connor established the controlling constitutional standard for evaluating use of force by law enforcement and security personnel acting under color of law. The case held that all claims of excessive force must be analyzed under the Fourth Amendment objective reasonableness standard.",
    "keyPoints": [
      "Graham v. Connor: force must be objectively reasonable under the Fourth Amendment",
      "Reasonableness is judged from the perspective of a reasonable officer on the scene",
      "Not judged with 20/20 hindsight or from the calm vantage point of a reviewing court",
      "The calculus of reasonableness must allow for the fact officers make split-second judgments",
      "This standard applies to all persons acting under color of law — including armed security"
    ],
    "legalRef": "Graham v. Connor, 490 U.S. 386 (1989)",
    "callout": { "type": "info", "text": "Graham v. Connor is cited in virtually every excessive force civil lawsuit. Know it. It is your operating standard." }
  },
  {
    "type": "slide",
    "heading": "The Three Graham Factors",
    "body": "The Graham decision identified three primary factors courts use to evaluate whether force was objectively reasonable. These are not a rigid formula but a flexible framework — and no single factor is determinative.",
    "keyPoints": [
      "1. SEVERITY OF THE CRIME: Was the offense a minor infraction or a serious felony involving violence?",
      "2. IMMEDIATE THREAT: Did the subject pose an immediate threat to the officer or others?",
      "3. ACTIVE RESISTANCE: Was the subject actively resisting arrest or attempting to evade?",
      "All three are weighed together — a minor crime with extreme violence may still justify significant force",
      "Courts examine the totality of the circumstances against these three benchmarks"
    ],
    "legalRef": "Graham v. Connor — Three-factor balancing test",
    "callout": { "type": "info", "text": "A subject who poses no immediate threat but is committing a serious crime does not automatically justify deadly force. The immediate threat factor is the most heavily weighted." }
  },
  {
    "type": "slide",
    "heading": "Totality of the Circumstances",
    "body": "No single factor determines whether force was reasonable. Courts evaluate the totality of the circumstances — every fact and condition present at the time of the incident. This means the physical environment, the subject's behavior, the officer's prior knowledge, the availability of alternatives, and the time available to decide all enter the analysis.",
    "keyPoints": [
      "Time of day / lighting conditions",
      "Location (crowded public space vs. isolated area)",
      "Number of subjects vs. number of officers",
      "Subject's size, apparent physical ability, intoxication indicators",
      "Prior calls or information about the subject's history",
      "Availability of cover, backup, or lesser force options",
      "Time pressure available for decision-making"
    ],
    "callout": { "type": "info", "text": "Document everything you observed before, during, and after a force event. Each of these factors can support or undermine the reasonableness of your decision." }
  },
  {
    "type": "slide",
    "heading": "Resistance Levels and the Force Continuum",
    "body": "The force continuum provides a framework for matching force level to resistance level. While it is no longer presented as a rigid ladder in most modern training, understanding resistance categories ensures your response is proportionate — a critical element of the reasonableness standard.",
    "keyPoints": [
      "Passive non-compliance: verbal refusal, dead weight — minimal force appropriate",
      "Active resistance: pulling away, tensing up — increased physical control justified",
      "Assaultive behavior: striking, kicking, biting — defensive force justified",
      "Deadly force resistance: weapon, life-threatening attack — deadly force may be justified",
      "Force should de-escalate as resistance decreases — do not maintain high force once control is achieved"
    ],
    "callout": { "type": "warning", "text": "Continuing to apply force after a subject is controlled and compliant is excessive force regardless of what the earlier resistance level was." }
  },
  {
    "type": "scenario",
    "scenario": "Officer Chen responds to a report of a trespasser on a construction site at 0200. A male subject is found in a darkened area near equipment. When Officer Chen orders him to stop, the subject turns, raises his arm, and shouts. Officer Chen perceives a weapon in the subject hand and draws his firearm. The subject drops a flashlight — he was a night-shift inspector with legitimate access who did not hear the initial challenge.",
    "reflection": "Apply the Reasonable Man Doctrine to Officer Chen decision. Was his perception objectively reasonable given the circumstances? Which Graham factors are most relevant here? How does post-incident information (the flashlight, the legitimate access) affect the legal analysis?"
  },
  {
    "type": "slide",
    "heading": "Module Summary — The Reasonable Man Doctrine",
    "body": "Every use of force you apply will be evaluated against one question: was it objectively reasonable? Training, documentation, and clear decision-making within the AOJ framework and Graham factors are your best protection. The law does not expect perfection — it expects reasonableness.",
    "keyPoints": [
      "Objective standard — what would a reasonable officer believe given the same facts",
      "Graham v. Connor is the controlling constitutional standard",
      "Three Graham factors: severity of crime, immediate threat, active resistance",
      "Totality of the circumstances — no single factor is decisive",
      "Force must de-escalate as resistance decreases"
    ],
    "callout": { "type": "tip", "text": "Ready for the Module 03 Knowledge Assessment. Three Critical Fail questions cover the Graham standard, objective reasonableness, and the force continuum." }
  }
]
$slides_03$::jsonb
);

-- ── MOD-04: Terminal Ballistics & Cavitation ────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-04',
'Terminal Ballistics & Cavitation',
$slides_04$
[
  {
    "type": "slide",
    "heading": "Three Categories of Ballistics",
    "body": "Ballistics is the science of projectile motion. For armed security officers, understanding ballistics directly impacts ammunition selection, over-penetration risk, and the effectiveness of your duty load. There are three categories every armed professional must understand.",
    "keyPoints": [
      "INTERNAL (Initial) Ballistics: what happens inside the firearm from ignition to muzzle exit",
      "EXTERNAL Ballistics: what happens to the bullet between the muzzle and the target",
      "TERMINAL Ballistics: what happens when the bullet strikes and transfers energy into a target",
      "For duty ammunition selection, terminal ballistics is the most operationally critical category",
      "Over-penetration risk — a terminal ballistics concern — can cause unintended casualties downrange"
    ],
    "callout": { "type": "info", "text": "An officer who understands why their duty ammunition was selected — and what it is designed to do — makes better decisions about when and where to deploy it." }
  },
  {
    "type": "slide",
    "heading": "Terminal Ballistics — What Happens When the Bullet Hits",
    "body": "When a bullet enters human tissue, it transfers kinetic energy through several mechanisms. The effectiveness of that energy transfer — and its effect on stopping a threat — depends on bullet design, velocity, and the tissue it encounters. Understanding this helps you understand why your duty ammunition is selected and what its limitations are.",
    "keyPoints": [
      "Kinetic energy formula: KE = W x V squared / 450,435 (foot-pounds)",
      "Higher velocity multiplies energy — velocity is more influential than bullet weight",
      "Energy transfer is the primary wounding mechanism — not simply bullet size",
      "Three tissue damage mechanisms: laceration/crushing, cavitation, and pressure waves",
      "Most defensive shootings occur at under 7 yards — velocity remains high at close range"
    ],
    "legalRef": "FBI Ballistics Research — Terminal Wound Ballistics Standards"
  },
  {
    "type": "slide",
    "heading": "Permanent vs. Temporary Cavity",
    "body": "Cavitation is the creation of a void in tissue as the bullet passes through. There are two types, and understanding both explains why bullet design matters for duty use.",
    "keyPoints": [
      "PERMANENT CAVITY: the actual tissue destroyed as the bullet passes — this is the wound channel",
      "TEMPORARY CAVITY: the stretch of surrounding tissue caused by energy transfer — collapses back",
      "Handgun bullets at typical velocities (below 1,800 fps) rely primarily on permanent cavity",
      "High-velocity rifle rounds create significant temporary cavitation — causing larger wound effect",
      "Jacketed Hollow Point (JHP) design maximizes permanent cavity by expanding the bullet diameter"
    ],
    "callout": { "type": "info", "text": "For handgun duty loads, permanent cavity is the primary mechanism. This is why the FBI penetration and expansion standard matters — a bullet that does not expand creates a narrower permanent cavity." }
  },
  {
    "type": "slide",
    "heading": "The FBI Penetration Standard",
    "body": "After the 1986 Miami shootout — in which inadequate duty ammunition contributed to officer deaths — the FBI developed a ballistics testing protocol now used industry-wide. The standard tests bullet penetration and expansion through standardized ballistic gelatin, with and without intermediate barriers.",
    "keyPoints": [
      "Minimum penetration: 12 inches in ballistic gelatin",
      "Maximum penetration: 18 inches (over-penetration risk above this threshold)",
      "Bullet must expand to at least 1.5x its original diameter",
      "Testing includes bare gelatin and four barrier types: heavy clothing, auto glass, wallboard, steel",
      "Ammunition that passes FBI protocol is the industry standard for duty use"
    ],
    "legalRef": "FBI Ballistics Research Division — Wound Ballistics Protocols",
    "callout": { "type": "warning", "text": "Full Metal Jacket (FMJ) ammunition — standard practice range rounds — does NOT expand and often over-penetrates. FMJ is not appropriate as a duty load in populated environments." }
  },
  {
    "type": "checklist",
    "title": "Duty Ammunition Selection Criteria",
    "items": [
      { "label": "Meets FBI Protocol", "description": "12-18 inch penetration in ballistic gel, minimum 1.5x expansion. Look for published FBI protocol test data from the manufacturer." },
      { "label": "Jacketed Hollow Point (JHP)", "description": "JHP is the industry standard for duty use. It expands on impact, maximizes permanent cavity, and reduces over-penetration compared to FMJ." },
      { "label": "Caliber Appropriate", "description": "Common duty calibers in order of prevalence: .40 S&W, .45 ACP, 9mm. All can be effective with proper JHP selection. Caliber matters less than shot placement." },
      { "label": "Tested in Your Firearm", "description": "Duty ammunition must be function-tested in your specific firearm — minimum 100 rounds without malfunction before carrying it on duty." },
      { "label": "Agency Approved", "description": "Your agency may specify an approved duty load. Use it. Deviation from agency policy can affect your legal protection and workers compensation coverage." }
    ]
  },
  {
    "type": "slide",
    "heading": "Module Summary — Terminal Ballistics",
    "body": "Understanding terminal ballistics is not academic — it is operationally critical. It informs your ammunition selection, your understanding of over-penetration risk, and your awareness of why certain shots may or may not stop a threat. Armed security officers who understand their duty load make more disciplined decisions about its deployment.",
    "keyPoints": [
      "Three ballistics categories: internal, external, terminal",
      "Terminal ballistics governs duty ammunition selection",
      "Permanent cavity is the primary wounding mechanism for handgun rounds",
      "FBI standard: 12-18 inch penetration, minimum 1.5x expansion",
      "JHP is the duty standard — FMJ is for practice only"
    ],
    "callout": { "type": "tip", "text": "Ready for the Module 04 Knowledge Assessment. Questions cover ballistics categories, cavitation types, the FBI standard, and ammunition selection principles." }
  }
]
$slides_04$::jsonb
);

-- ── MOD-05: Cycle of Operation — The 8 Phases ──────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-05',
'Cycle of Operation — The 8 Phases',
$slides_05$
[
  {
    "type": "slide",
    "heading": "Why the Cycle of Operation Matters",
    "body": "Understanding the mechanical cycle of your semi-automatic pistol is the foundation for recognizing, diagnosing, and clearing malfunctions under stress. An officer who knows WHY a malfunction occurs can correct it faster and with more confidence than one who only knows a drill without understanding the underlying mechanism.",
    "keyPoints": [
      "The 8-phase cycle repeats with every shot fired in a semi-automatic pistol",
      "Each phase can produce a specific malfunction type if interrupted",
      "Understanding the cycle allows you to diagnose malfunctions by what you see and feel",
      "Revolvers have a different cycle — if you carry a revolver, this module still applies to understanding semi-autos you may encounter",
      "Malfunctions in a defensive context are life-threatening — speed of diagnosis and correction is critical"
    ]
  },
  {
    "type": "slide",
    "heading": "Phase 1: Firing — Phase 2: Unlocking",
    "body": "The cycle begins when the trigger is pressed, releasing the striker or hammer to drive the firing pin into the primer. Understanding the first two phases explains why ammunition selection affects reliability.",
    "keyPoints": [
      "PHASE 1 — FIRING: Trigger pressed, firing pin strikes primer, primer ignites powder charge, expanding gases propel bullet down barrel",
      "Chamber pressure peaks during firing — 30,000 to 40,000 PSI in most handgun calibers",
      "PHASE 2 — UNLOCKING: Slide begins rearward movement as pressure drops to safe level, barrel tilts to unlock from slide",
      "Unlocking timing is pressure-dependent — underpowered ammunition (squib loads) may fail to fully unlock",
      "A squib load leaves a bullet lodged in the barrel — NEVER fire another round into an obstructed barrel"
    ],
    "callout": { "type": "warning", "text": "If a round sounds and feels significantly different from normal — reduced report, reduced recoil — STOP. Clear the weapon and inspect the barrel before firing again. A squib can cause catastrophic barrel failure." }
  },
  {
    "type": "slide",
    "heading": "Phase 3: Extraction — Phase 4: Ejection",
    "body": "These two phases remove the spent cartridge case from the chamber and clear it from the action. Failures in these phases produce some of the most common and recognizable malfunctions.",
    "keyPoints": [
      "PHASE 3 — EXTRACTION: Extractor claw grips the case rim and pulls the spent case rearward out of the chamber as the slide moves back",
      "Extractor failure or a damaged/deformed case = failure to extract (stovepiped or stuck case)",
      "PHASE 4 — EJECTION: Ejector contacts the case, rotating it out through the ejection port",
      "Failure to eject = stovepipe malfunction — case caught vertically in the ejection port",
      "Stovepipe clearance: tap-rack — slap magazine base, retract slide fully, release, assess"
    ],
    "callout": { "type": "info", "text": "A stovepipe is one of the most common range malfunctions. Recognizing it immediately by feel or sight, and clearing it with a tap-rack, should be automatic." }
  },
  {
    "type": "slide",
    "heading": "Phase 5: Cocking — Phase 6: Feeding",
    "body": "As the slide moves rearward it cocks the action, and as it returns forward under spring pressure, it strips the next round from the magazine. These phases must work in precise sequence.",
    "keyPoints": [
      "PHASE 5 — COCKING: Slide movement drives firing pin or hammer to the rear, compressing the spring for the next shot",
      "On striker-fired pistols, partial pre-cocking occurs — full cocking happens during this phase",
      "PHASE 6 — FEEDING: Slide returns forward under recoil spring tension, stripping the top round from the magazine",
      "Feed angle is designed to be reliable with properly shaped ammunition — wadcutters can cause feed failures",
      "Magazine lip damage is the most common cause of feeding failures — inspect magazines regularly"
    ]
  },
  {
    "type": "slide",
    "heading": "Phase 7: Chambering — Phase 8: Locking",
    "body": "The final two phases complete the cycle by seating the new round in the chamber and locking the action for the next firing event.",
    "keyPoints": [
      "PHASE 7 — CHAMBERING: Round slides up the feed ramp and into the chamber",
      "Feed ramp angle and cleanliness affect chambering reliability — keep it clean and lightly lubricated",
      "Failure to chamber = round nose-diving against the feed ramp instead of entering the chamber",
      "PHASE 8 — LOCKING: Barrel rises and locks back into the slide, sealing the chamber",
      "Locking failure is rare but catastrophic — results in out-of-battery detonation (extremely dangerous)"
    ],
    "callout": { "type": "tip", "text": "After the 8 phases complete, the pistol is back at Phase 1 — ready to fire with the next trigger press. This cycle happens in milliseconds and repeats every round until the magazine is empty." }
  }
]
$slides_05$::jsonb
);

-- ── MOD-06: Handgun Nomenclature & Mechanical Safety Systems ───────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-06',
'Handgun Nomenclature & Mechanical Safety Systems',
$slides_06$
[
  {
    "type": "slide",
    "heading": "Why Nomenclature Matters in the Field",
    "body": "Precise language about your firearm is not pedantic — it is operationally necessary. During a qualification debrief, a malfunction report, a post-incident review, or a courtroom proceeding, your ability to accurately describe what your firearm did and why it matters. Misidentifying a component can undermine your credibility and your legal defense.",
    "keyPoints": [
      "Accurate terminology is required in use-of-force reports and legal proceedings",
      "Instructors and armorers need precise descriptions to diagnose malfunctions",
      "Knowing component names accelerates malfunction diagnosis under stress",
      "GBPDSA qualification and testing may include nomenclature questions",
      "Revolver and semi-automatic terminology differs — know both"
    ]
  },
  {
    "type": "slide",
    "heading": "Semi-Automatic Pistol — External Components",
    "body": "The following are the primary external components of a semi-automatic pistol. While specific designs vary by manufacturer, these components are present on virtually all semi-automatic service pistols.",
    "keyPoints": [
      "SLIDE: The reciprocating upper assembly — houses the barrel, firing pin, and extractor",
      "BARREL: The tube through which the bullet travels — determines caliber and sight radius",
      "FRAME: The lower assembly — houses the trigger group, magazine well, and grip",
      "TRIGGER: The lever that initiates the firing cycle when pressed rearward",
      "TRIGGER GUARD: The protective loop surrounding the trigger — prevents inadvertent discharge",
      "MAGAZINE: The removable box that holds and feeds cartridges into the action",
      "GRIP / STOCKS: The portion of the frame held by the shooting hand",
      "SIGHTS: Front and rear sight elements used to align the barrel on target"
    ]
  },
  {
    "type": "slide",
    "heading": "Semi-Automatic Pistol — Controls and Operational Components",
    "body": "Beyond the structural components, the following controls are used during normal operation and malfunction clearance.",
    "keyPoints": [
      "SLIDE STOP / SLIDE RELEASE: Locks slide open after last round; releases slide to chamber a round",
      "MAGAZINE RELEASE: Drops the magazine from the magazine well (location varies by design)",
      "SAFETY LEVER: External manual safety present on some designs (Glock has none; 1911 has one)",
      "EJECTION PORT: Opening in the slide through which spent cases are ejected",
      "COCKING SERRATIONS: Grooves on the rear of the slide for positive grip during manipulation",
      "TAKEDOWN LEVER / DISASSEMBLY LATCH: Allows field-stripping for cleaning",
      "RECOIL SPRING GUIDE ROD: Houses the recoil spring; returns slide forward after each shot",
      "BEAVERTAIL: Extended tang above the grip reducing slide bite on high-grip shooters"
    ]
  },
  {
    "type": "slide",
    "heading": "Revolver Components",
    "body": "Revolvers are mechanically simpler than semi-automatics and may be encountered as duty or backup weapons. Understanding their nomenclature is required for any operator who may carry or be required to handle a revolver.",
    "keyPoints": [
      "CYLINDER: The rotating chamber assembly — typically holds 5 to 8 rounds",
      "CRANE / YOKE: The arm that allows the cylinder to swing out for loading and unloading",
      "CYLINDER RELEASE: The latch (thumb piece) that unlocks the cylinder from the frame",
      "EJECTOR ROD: The central rod that, when pressed, ejects spent cases from the cylinder",
      "BARREL LUG: Structural extension under the barrel for weight and balance",
      "HAMMER: The external cocking mechanism — single-action requires manual cocking; double-action does not",
      "DOUBLE-ACTION: Pulling the trigger both cocks and releases the hammer",
      "SINGLE-ACTION: Hammer must be manually cocked before the trigger releases it"
    ]
  },
  {
    "type": "slide",
    "heading": "Mechanical Safety Systems",
    "body": "Modern service pistols incorporate multiple internal safety mechanisms designed to prevent accidental discharge from drops, bumps, or incomplete trigger engagement. Understanding these gives you confidence in safe handling and informs your holster selection.",
    "keyPoints": [
      "FIRING PIN BLOCK: Blocks the firing pin channel unless the trigger is fully pressed — prevents drop-fire",
      "TRIGGER SAFETY: A lever within the trigger face that must be depressed for the trigger to move (Glock, S&W M&P)",
      "GRIP SAFETY: A lever in the backstrap that must be fully depressed for the trigger to function (Springfield XD, 1911)",
      "FRAME-MOUNTED SAFETY: External lever that physically blocks trigger or sear (1911 style)",
      "SLIDE-MOUNTED SAFETY: External lever on the slide — also functions as a decocking lever on some designs (Beretta M9)",
      "MAGAZINE DISCONNECT: Blocks firing when magazine is removed — prevents single chambered-round discharge without magazine"
    ],
    "callout": { "type": "info", "text": "A pistol with a firing pin block and trigger safety is considered safe to carry with a round chambered. Know your specific firearm safety systems before carrying it on duty." }
  },
  {
    "type": "slide",
    "heading": "Module Summary — Nomenclature and Safety Systems",
    "body": "Knowing the name and function of every component on your duty firearm is a professional requirement. It supports malfunction diagnosis, accurate incident reporting, and compliance with range commands. Understanding safety systems builds the confidence to handle your firearm safely in all conditions.",
    "keyPoints": [
      "Semi-auto key components: slide, barrel, frame, trigger, magazine, sights, controls",
      "Revolver key components: cylinder, crane, ejector rod, hammer, cylinder release",
      "Modern service pistols have multiple internal safeties — do not rely solely on them",
      "Know your specific firearm safety system before carrying it on duty",
      "Precise language about your firearm matters in reports and legal proceedings"
    ],
    "callout": { "type": "tip", "text": "Ready for the Module 06 Knowledge Assessment. Questions cover nomenclature identification for both revolver and semi-auto, and mechanical safety system functions." }
  }
]
$slides_06$::jsonb
);

-- ── MOD-07: The Four Cardinal Rules of Firearms Safety ─────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-07',
'The Four Cardinal Rules of Firearms Safety',
$slides_07$
[
  {
    "type": "slide",
    "heading": "Rule 1 — Treat Every Weapon as if It Is Loaded",
    "body": "The first Cardinal Rule establishes the foundational mindset for all firearms handling. Regardless of what you believe about the weapon state — whether you watched it be unloaded, whether you can see an empty chamber — you treat it as if it is capable of firing. This rule compensates for the fact that humans make mistakes in verification.",
    "keyPoints": [
      "Never rely on another person statement that a weapon is unloaded",
      "Always verify the weapon state yourself — every time you take possession",
      "Verification process: magazine removed, slide locked rear, chamber inspected visually AND by feel",
      "Even plastic training firearms and deactivated replicas are handled under Rule 1",
      "Common violation: handling a firearm casually because you believe it to be empty"
    ],
    "callout": { "type": "warning", "text": "Every negligent discharge in history began with a person who was certain the weapon was unloaded. Certainty is the enemy of Rule 1. Discipline is the standard." }
  },
  {
    "type": "slide",
    "heading": "Rule 2 — Never Point the Muzzle at Anything You Are Not Willing to Destroy",
    "body": "Muzzle discipline is the most observable safety practice. Where the muzzle points at any given moment defines what is at risk if the weapon discharges. The rule applies at all times — during handling, holstering, cleaning, and demonstration.",
    "keyPoints": [
      "The muzzle must always be pointed in a safe direction — a direction where an unintended discharge would not injure a person",
      "Safe directions: typically downward into the ground, or into a designated safe backstop",
      "Violations occur during: turning with a drawn weapon, holstering without muzzle control, handing the weapon to another person",
      "Even if you have verified the weapon is unloaded, Rule 2 still applies",
      "On a range: the muzzle never crosses the firing line rearward while others are present"
    ],
    "callout": { "type": "warning", "text": "Muzzle awareness must be maintained during all movement — especially when transitioning from a two-handed to one-handed grip, going to the ground, or moving around obstacles." }
  },
  {
    "type": "slide",
    "heading": "Rule 3 — Keep Your Finger Off the Trigger Until On Target with Intent to Fire",
    "body": "Trigger discipline is the last mechanical barrier before a round is fired. The finger belongs outside the trigger guard — indexed along the frame — until three conditions are simultaneously met: sights on target, target positively identified, and conscious decision to fire made.",
    "keyPoints": [
      "Trigger finger is indexed straight along the frame, above the trigger guard — not resting on the trigger",
      "The three conditions for trigger engagement: on target, target identified, decision made",
      "Legal requirement is implicit: Ability, Opportunity, Jeopardy must be present",
      "Sympathetic contraction: when other muscles contract under stress, trigger finger may contract involuntarily",
      "Sympathetic contraction is the most common cause of unintended discharge during high-stress situations"
    ],
    "callout": { "type": "warning", "text": "Moving with your finger on the trigger — running, taking cover, climbing, restraining a subject — is a violation of Rule 3 and a common cause of negligent discharge in police and security incidents." }
  },
  {
    "type": "slide",
    "heading": "Rule 4 — Be Sure of Your Target and What Is Behind It",
    "body": "Before a round is fired, you must have a clear identification of your target AND awareness of what lies beyond it. Bullets that miss, over-penetrate, or pass through a target continue downrange. In any populated environment, this analysis must happen before the trigger is pressed.",
    "keyPoints": [
      "Positive target identification: confirm the target is the actual threat before firing",
      "Background awareness: what is directly behind the target? (Walls, vehicles, other persons)",
      "Foreground awareness: is there anyone between you and the target?",
      "Over-penetration: duty JHP ammunition reduces (but does not eliminate) the risk",
      "At close range (<7 yards): every round that misses or over-penetrates endangers bystanders"
    ],
    "callout": { "type": "warning", "text": "In low-light conditions, target identification becomes your most critical pre-fire obligation. Firing at a shape, sound, or movement without positive identification is a violation of Rule 4 — and a criminal act." }
  },
  {
    "type": "checklist",
    "title": "All Four Cardinal Rules — Quick Reference",
    "items": [
      { "label": "Rule 1: Always Loaded", "description": "Treat every firearm as if it is loaded and capable of firing — regardless of what you know or believe about its state." },
      { "label": "Rule 2: Muzzle Discipline", "description": "Never allow the muzzle to cover anything you are not willing to destroy. Maintain this at all times — during handling, movement, and holstering." },
      { "label": "Rule 3: Trigger Discipline", "description": "Keep your finger straight and outside the trigger guard until your sights are on target, the target is positively identified, and you have made the conscious decision to fire." },
      { "label": "Rule 4: Target Awareness", "description": "Positively identify your target. Know what is in front of and behind it before firing. Every round you fire is your legal responsibility until it stops." }
    ]
  },
  {
    "type": "scenario",
    "scenario": "During a live-fire qualification, Officer Grant draws his weapon and turns to get a better angle on a target. While turning, his muzzle sweeps across the range officer standing to his right. The range officer calls a halt. Officer Grant states he had his finger off the trigger and the weapon was pointed slightly downward.",
    "reflection": "Which Cardinal Rule was violated? Does having a finger off the trigger and a downward angle excuse the muzzle sweep? What should Officer Grant have done to maintain muzzle discipline while repositioning?"
  },
  {
    "type": "slide",
    "heading": "Module Summary — The Four Cardinal Rules",
    "body": "The Four Cardinal Rules are not range courtesy — they are the minimum standard for professional firearms handling. Any violation of any rule under any circumstance is unacceptable. The rules are designed so that observing any two of them will prevent an unintended discharge from injuring a person.",
    "keyPoints": [
      "Rule 1: Treat every weapon as loaded — always verify, never assume",
      "Rule 2: Muzzle discipline — control where the muzzle points at all times",
      "Rule 3: Trigger discipline — finger off trigger until all three conditions are met",
      "Rule 4: Target awareness — identify before firing, know what is beyond the target",
      "Violation of any rule is grounds for removal from the range — and in the field, potential criminal liability"
    ],
    "callout": { "type": "warning", "text": "All four Cardinal Rule questions on the Module 07 assessment are Critical Fail questions. A wrong answer on any one of them triggers an immediate Tactical Reset. Know these rules cold." }
  }
]
$slides_07$::jsonb
);

-- ── MOD-08: Weapon Retention — The Lindell Method ──────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-08',
'Weapon Retention — The Lindell Method',
$slides_08$
[
  {
    "type": "slide",
    "heading": "Why Weapon Retention Is Critical",
    "body": "An armed security officer who loses control of their weapon has not just lost a tool — they have potentially armed an adversary with a firearm and the legal authority to use it. Weapon retention is one of the most operationally important skills for any armed professional, and it begins long before physical contact with an attacker.",
    "keyPoints": [
      "More than one law enforcement officer has been killed with their own weapon",
      "A disarmed officer loses their primary defensive tool and may face a lethal threat from it",
      "Weapon retention begins with awareness — not with physical technique",
      "Retention holsters, proper positioning, and pre-attack signal recognition reduce risk before contact is made",
      "Physical retention techniques are the last line of defense — awareness is the first"
    ],
    "callout": { "type": "warning", "text": "If an adversary gains control of your firearm, they may have the legal authority to use it in self-defense — against you. Weapon retention is not optional." }
  },
  {
    "type": "slide",
    "heading": "Pre-Attack Signals — What to Watch For",
    "body": "Attackers who intend to disarm an officer display predictable behavioral cues before initiating the attempt. Recognizing these signals provides reaction time before the physical confrontation begins — and reaction time is the most valuable asset in a defensive scenario.",
    "keyPoints": [
      "Repeated staring at or glancing toward the holstered weapon",
      "Movements to close distance or shift position toward the weapon side",
      "Odd questions about the firearm (type, weight, caliber)",
      "Body language: feet shuffling to reset stance, shoulder dropping to lower center of gravity",
      "Hands moving toward the officer gun side without clear purpose",
      "Excessive or sudden attention to the officer holster when the subject has no legitimate reason to notice it"
    ],
    "callout": { "type": "info", "text": "Recognizing pre-attack signals allows you to address the threat verbally, create distance, or reposition before a grab attempt — eliminating the need for physical retention in most cases." }
  },
  {
    "type": "slide",
    "heading": "The Interview Stance",
    "body": "The interview stance is the ready position adopted when a potential threat is present. It positions the body to maximize protection of the weapon, maintain balance, and enable rapid response — while appearing professional and non-confrontational.",
    "keyPoints": [
      "Bladed stance: non-dominant foot forward, body angled approximately 45 degrees",
      "Gun side rotated rearward and away from the subject",
      "Weight balanced and slightly forward for stability",
      "Hands above waist, non-dominant hand in a natural conversational position",
      "Distance maintained: at least one arm length from the subject — inside this range, draw may be slower than a grab"
    ],
    "callout": { "type": "info", "text": "The interview stance should become your default position any time you are engaged in close contact with an unknown or potentially hostile subject. It is professional and non-threatening in appearance." }
  },
  {
    "type": "slide",
    "heading": "The Lindell Method — Leverage Over Strength",
    "body": "Developed by Jim Lindell for the Kansas City Police Department in the 1970s and refined through decades of law enforcement use, the Lindell Method is a leverage-based weapon retention system. Its core principle: leverage defeats brute strength. A smaller officer can successfully retain their weapon against a larger attacker using proper leverage mechanics.",
    "keyPoints": [
      "Developed by Jim Lindell, KCPD — 1970s; refined and adopted by Massad Ayoob LFI curriculum",
      "Core principle: leverage mechanics beat strength — position beats size",
      "Basic Lindell formula: Secure the weapon + Move to position of advantage + Release and regain control",
      "Body weight and skeletal structure are used rather than muscular force",
      "Requires regular practice — psychomotor skill degrades without repetition"
    ],
    "callout": { "type": "info", "text": "The Lindell Method must be practiced physically to be retained as a functional skill. The slides in this module introduce the principles — live practice with an instructor is required for operational competency." }
  },
  {
    "type": "checklist",
    "title": "Retention Holster Selection Guide",
    "items": [
      { "label": "Level I Retention", "description": "Passive retention only — friction or thumb break. Minimum standard for uniformed carry. Adequate for low-threat environments with high weapon-draw speed requirement." },
      { "label": "Level II Retention", "description": "One active retention device in addition to passive friction. Thumb break plus one additional mechanism. Recommended for most uniformed armed security posts." },
      { "label": "Level III Retention", "description": "Two active retention devices. Recommended for high-threat environments or patrol. Safari Land 070 SS-III is the industry standard (Bill Rogers design, 30+ years proven)." },
      { "label": "Proper Fit", "description": "Holster must be model-specific — a generic holster that does not fit your firearm precisely provides neither reliable retention nor smooth draw." },
      { "label": "Training Requirement", "description": "Level II and Level III holsters require dedicated training to draw smoothly under stress. Retention without trained draw speed creates a dangerous gap in your defensive capability." }
    ]
  },
  {
    "type": "scenario",
    "scenario": "Officer Williams is conducting a welfare check on a distressed individual sitting on a curb. The individual suddenly reaches out and grabs the grip of Officer Williams holstered pistol with both hands. Officer Williams weapon is in a Level I retention holster. The subject is larger than Officer Williams.",
    "reflection": "What pre-attack signals might have preceded this attempt that Officer Williams could have acted on? Why is the Lindell principle of leverage over strength particularly relevant here? What does Officer Williams do first in the Lindell response sequence?"
  },
  {
    "type": "slide",
    "heading": "Module Summary — Weapon Retention",
    "body": "Weapon retention is a layered defense: awareness first, positioning second, holster selection third, physical technique last. The Lindell Method gives you a leverage-based framework that works regardless of size differential. Pre-attack signal recognition gives you time before the physical confrontation begins.",
    "keyPoints": [
      "Weapon retention begins with awareness and pre-attack signal recognition",
      "Interview stance maximizes weapon-side protection in close contact situations",
      "Lindell Method: leverage over strength — position beats size",
      "Retention holster selection must match threat level and require training to draw",
      "Physical retention skills require regular practice to remain operational"
    ],
    "callout": { "type": "tip", "text": "Ready for the Module 08 Knowledge Assessment. Questions cover pre-attack signals, interview stance positioning, the Lindell principle, and retention holster levels." }
  }
]
$slides_08$::jsonb
);

-- ── MOD-09: Range Qualification Standards ──────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-09',
'Range Qualification Standards',
$slides_09$
[
  {
    "type": "slide",
    "heading": "Range Safety — The Non-Negotiable Foundation",
    "body": "Every person on a live-fire range is responsible for safety — not just the range officer. Understanding and internalizing range safety rules before arrival at the range prevents accidents, ensures qualification proceeds without incident, and demonstrates the professional discipline expected of an armed security officer.",
    "keyPoints": [
      "Eye and ear protection is mandatory at all times during any firing on an active range",
      "No frantic or rushed movement on the firing line — all movement is controlled and deliberate",
      "No forward movement past the firing line while any shooter is active — only when the range is declared clear",
      "All weapons are clear before any person moves forward of the firing line",
      "Two-person verification for any dummy round inspection — both persons must confirm before issue or return",
      "Range officer commands are immediate and absolute — hesitation is not acceptable"
    ],
    "callout": { "type": "warning", "text": "Any unsafe act on a live-fire range is grounds for immediate removal and disqualification. There are no second chances for muzzle sweeps, trigger violations, or unauthorized movement on an active range." }
  },
  {
    "type": "slide",
    "heading": "Dry Fire Drills — Prerequisite to Live Fire",
    "body": "Before any live ammunition is introduced to the range, all qualification candidates complete a structured dry fire drill sequence. Dry fire allows you to demonstrate fundamental technique under instructor observation before the consequences of error become lethal.",
    "keyPoints": [
      "No live ammunition is present during dry fire drills — instructor verifies all weapons and magazines beforehand",
      "Students inspect themselves for any live rounds and remove them before dry fire begins",
      "All dry fire is conducted facing outward toward walls or a safe direction",
      "Only students who demonstrate competency in dry fire advance to live fire",
      "Dry fire drills cover: Four Count Draw, Fundamentals of Marksmanship, Loading and Unloading, Speed Reloads, Tactical Reloads, Malfunction Clearance, Strong Hand Only Shooting"
    ],
    "callout": { "type": "info", "text": "If you cannot perform the fundamentals safely and correctly in dry fire, you will not advance to live fire. Dry fire performance directly predicts live fire performance." }
  },
  {
    "type": "slide",
    "heading": "Course of Fire — 3-Yard Line (24 Rounds)",
    "body": "The 3-yard stage tests close-range marksmanship and draw speed. Most defensive handgun encounters occur at distances of 7 yards or less — the 3-yard line simulates the most common threat distance and emphasizes control at intimate range.",
    "keyPoints": [
      "Distance: 3 yards from target",
      "Total rounds fired: 24",
      "Drill sequence: slow deliberate draw, fire 1 round, re-holster — repeat 10 times (10 rounds)",
      "Fundamentals of marksmanship: same as above — 10 rounds",
      "Strong hand only: draw, fire 1 round, re-holster — repeat to expend remaining rounds",
      "Focus: sight picture, trigger control, muzzle discipline during draw and re-holster"
    ],
    "callout": { "type": "info", "text": "At 3 yards, accuracy should be high. Misses at this distance typically indicate trigger control failure or target fixation — focus on the front sight, not the target." }
  },
  {
    "type": "slide",
    "heading": "Course of Fire — 7-Yard Line (18 Rounds) and 15-Yard Line (6 Rounds)",
    "body": "The 7-yard line represents the practical limit of most defensive handgun engagements and tests the complete marksmanship skill set. The 15-yard stage tests longer-range accuracy and is where stance and grip deficiencies become most apparent.",
    "keyPoints": [
      "7-YARD LINE: 18 rounds total — same drill sequence as 3-yard line",
      "At 7 yards: grip, stance, sight alignment, and breath control all have measurable impact on accuracy",
      "15-YARD LINE: 6 rounds total — slow deliberate fire from holster",
      "At 15 yards: sight alignment errors produce significant point-of-impact deviation",
      "Total course of fire: 48 rounds (24 + 18 + 6)",
      "Ammunition requirement: minimum 144 practice rounds plus two 48-round qualification attempts"
    ],
    "callout": { "type": "info", "text": "The highest score of your two qualification attempts is used. If you fail the first attempt, you have a second opportunity. Both attempts must use the same weapon type you carry on duty." }
  },
  {
    "type": "slide",
    "heading": "Scoring and Qualification Standards",
    "body": "The GBPDSA qualification standard requires a minimum passing score on both the written examination and the live-fire course of fire. Both must be passed in the same qualification event. Failure of either component requires remediation and re-examination.",
    "keyPoints": [
      "WRITTEN EXAM: Minimum 80% passing score — proctored by licensed firearms instructor",
      "LIVE FIRE: Minimum 80% passing score — 38 hits out of 48 rounds minimum",
      "Written exam covers: use of force, legal aspects, ballistics, nomenclature, loading/unloading, range safety, course of fire",
      "Qualification weapon must be the same type as the weapon carried on duty",
      "Two qualification attempts are permitted — highest score of the two is recorded",
      "Both scores are recorded on your GBPDSA training record and maintained by your agency"
    ],
    "legalRef": "GBPDSA Board Rule 509-4-.01 — Armed personnel qualification requirements"
  },
  {
    "type": "slide",
    "heading": "Module Summary — Range Qualification Standards",
    "body": "Qualification is not the end of training — it is the minimum standard for legal authorization to carry. Officers who qualify at exactly 80% are legally authorized but operationally at the threshold. Ongoing practice and continuing training are the marks of a professional.",
    "keyPoints": [
      "Range safety rules are absolute — any violation results in disqualification",
      "Dry fire precedes all live fire — demonstrate competency before handling live ammunition",
      "Course of fire: 48 rounds at three distances (3yd/24, 7yd/18, 15yd/6)",
      "Passing standard: 80% on written exam AND 80% on live fire (38/48 minimum hits)",
      "Two qualification attempts permitted — highest score recorded",
      "Qualification weapon must match your duty carry weapon type"
    ],
    "callout": { "type": "warning", "text": "Module 09 has two Critical Fail questions — one on the 80% qualification standard and one on the weapon type requirement. An incorrect answer on either triggers an immediate Tactical Reset." }
  }
]
$slides_09$::jsonb
);
