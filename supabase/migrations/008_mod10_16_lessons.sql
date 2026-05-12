-- ============================================================
-- 008_mod10_16_lessons.sql
-- Interactive lesson content for MJM 2026 Armed Security
-- MOD-10 through MOD-16 — completes the full 16-module curriculum
-- Grounded in: GBPDSA 16hr Armed Security PDF (MAJ. Makropoulos 2026)
-- ============================================================

-- Idempotent seed
DELETE FROM public.module_lessons
WHERE module_id IN ('MOD-10','MOD-11','MOD-12','MOD-13','MOD-14','MOD-15','MOD-16');

DELETE FROM public.quiz_questions
WHERE module_id IN ('MOD-10','MOD-11','MOD-12','MOD-13','MOD-14','MOD-15','MOD-16');


-- ── MOD-10: Georgia Law — GBPDSA Compliance ───────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-10',
'Georgia Law: GBPDSA Compliance',
$slides_10$
[
  {
    "type": "slide",
    "heading": "The GBPDSA: Authority, Structure, and Your Obligations",
    "body": "The Georgia Board of Private Detectives and Security Agencies (GBPDSA) is the sole licensing authority for all private security and detective work conducted in the State of Georgia. Every operator, instructor, and agency must hold a current, valid GBPDSA credential before engaging in armed security work. The Board operates under the Secretary of State's office and enforces Title 43, Chapter 38 of the Official Code of Georgia Annotated (OCGA).",
    "keyPoints": [
      "GBPDSA licenses individuals AND agencies — both must be current simultaneously",
      "Title 43, Chapter 38 OCGA governs all private security licensing in Georgia",
      "The Board audits training records, investigates complaints, and revokes licenses",
      "Operating without a license is a misdemeanor (first offense) and felony (subsequent)"
    ],
    "legalRef": "OCGA Title 43, Chapter 38 | GA Admin Code 509-3-.01",
    "callout": { "type": "warning", "text": "If your agency's license lapses, every armed officer employed by that agency is operating illegally — regardless of the individual officer's personal license status." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "License Categories: What You Need to Carry",
    "body": "Georgia issues separate license classes for each security function. An armed security officer must hold an Armed Security Guard License (individual) and work for a licensed Private Security Agency (employer). Instructors must separately hold a Firearms Instructor License issued by the Board. Each license type has distinct qualification requirements, renewal schedules, and continuing education mandates.",
    "keyPoints": [
      "PDSG – Armed Guard License (individual operator, renewed annually)",
      "PDSC – Private Security Agency License (employer/agency, renewed annually)",
      "CFTR – Firearms Instructor License (required to administer range qualification)",
      "Expired license = no legal authority to carry on duty, regardless of training completion"
    ],
    "legalRef": "GA Admin Code 509-3-.01 | 509-4-.01",
    "callout": { "type": "info", "text": "Renewal deadlines are strict. The Board does not issue grace periods. A license expired by even one day means you are unlicensed." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The 16-Hour Annual Training Mandate",
    "body": "Georgia Admin Code 509-3-.01 requires all armed security officers to complete a minimum of 16 hours of firearms training every calendar year. This training must be administered by a GBPDSA-licensed firearms instructor and must include both classroom instruction and live-fire range qualification. Training records must be maintained by the agency for a minimum of three years and must be available for Board inspection on demand.",
    "keyPoints": [
      "16 hours per calendar year — not per license period, not per employment",
      "Must include: legal foundations, firearms safety, range qualification at 80% minimum",
      "Proctored by a CFTR-licensed instructor — self-study alone does not satisfy the requirement",
      "Agency must retain signed training records for 3 years minimum"
    ],
    "legalRef": "GA Admin Code 509-3-.01(a)(b)(c)",
    "callout": { "type": "tip", "text": "Your completion record on this platform is timestamped and immutable. It constitutes your official MJM 2026 training log for GBPDSA compliance purposes." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Range Qualification Standards — Board Rule 509-4-.01",
    "body": "Board Rule 509-4-.01 governs firearms range qualification for all armed security personnel. The standard requires operators to qualify with the same type and caliber of weapon they carry on duty. Qualification consists of 48 rounds per iteration, fired twice; the higher score is used. A minimum score of 80% is required. A minimum of 144 rounds of practice ammunition must be fired during the session before qualification begins.",
    "keyPoints": [
      "Must qualify with duty weapon — no substitutions",
      "Course of fire: 3 yards (24 rounds), 7 yards (18 rounds), 15 yards (6 rounds)",
      "Two iterations of 48 rounds; highest score counts",
      "80% minimum passing score on the range",
      "144 rounds minimum practice ammo before qual begins"
    ],
    "legalRef": "GA Admin Code 509-4-.01 | GBPDSA Range Standards 2026",
    "callout": { "type": "warning", "text": "Scoring below 80% on the range does not simply mean you need to practice more. It means your armed security license cannot be renewed until you pass a re-qualification." },
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Annual GBPDSA Compliance Checklist",
    "items": [
      { "label": "Individual License Current", "description": "PDSG license is valid and not expired — check the Secretary of State portal annually" },
      { "label": "Agency License Current", "description": "Verify your employing agency holds a current PDSC license before your first shift each renewal year" },
      { "label": "16-Hour Training Complete", "description": "All classroom and range training hours logged and signed by CFTR-licensed instructor" },
      { "label": "Range Qualification at 80%+", "description": "Live-fire qualification score on file with your agency, on the duty weapon you carry" },
      { "label": "Training Records Filed", "description": "Signed certificates retained by the agency — available for Board inspection within 24 hours of request" },
      { "label": "Duty Weapon Matches Qualification", "description": "The firearm and caliber you carry matches the weapon used for your most recent qualification" }
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Penalties, Investigations, and Loss of License",
    "body": "The GBPDSA has full authority to investigate complaints, conduct unannounced audits, suspend or revoke licenses, and refer criminal cases to local law enforcement. Violations range from administrative fines to criminal prosecution. An armed security officer who uses force while unlicensed faces both criminal liability and civil liability that is not covered by the agency's insurance policy. The only defense is a current, valid license.",
    "keyPoints": [
      "Operating unlicensed: Class A misdemeanor first offense; felony on repeat",
      "Falsifying training records: fraud under OCGA — criminal prosecution",
      "Excessive force while unlicensed: no qualified immunity, no agency insurance coverage",
      "Board investigations are triggered by complaints, incidents, or routine audits",
      "Revocation is permanent pending appeal — re-application is not guaranteed"
    ],
    "legalRef": "OCGA 43-38-15 | OCGA 43-38-16 | GA Admin Code 509-3-.01",
    "callout": { "type": "warning", "text": "A suspended or revoked license does not become valid again by completing training. You must apply for reinstatement through the Board — a separate process that takes months." },
    "narrationUrl": null
  }
]
$slides_10$
);


-- ── MOD-11: Workplace Violence Prevention ─────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-11',
'Workplace Violence Prevention',
$slides_11$
[
  {
    "type": "slide",
    "heading": "The Security Officer's Role in Violence Prevention",
    "body": "Armed security officers are not simply a reactive resource — they are the primary layer of deterrence against workplace violence. Prevention requires the ability to recognize behavioral threat indicators before an incident escalates, understand the force continuum, and apply de-escalation techniques that resolve confrontations without unnecessary use of force. The majority of workplace violence incidents are preceded by observable warning signs that trained officers learn to read.",
    "keyPoints": [
      "Deterrence through visible, professional presence is the first line of defense",
      "Most violent incidents are preceded by escalating behavioral warning signs",
      "De-escalation is a professional skill — not a weakness or hesitation to act",
      "Documentation of pre-incident behavior protects both the officer and the organization"
    ],
    "callout": { "type": "info", "text": "The best use-of-force incident is the one that never happens. Prevention starts with your presence, posture, and professionalism before a single word is spoken." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The Use of Force Continuum",
    "body": "The Use of Force Continuum is the graduated framework that governs every decision an armed security officer makes during a confrontation. Force must always be proportional to the level of resistance presented. Officers may escalate or de-escalate at any point as the situation changes. No step is skipped when transitioning upward — and no step is skipped when transitioning down.",
    "keyPoints": [
      "Officer Presence: Uniform, posture, and positioning — no words needed",
      "Verbal Commands: Clear, direct, and calm directives to gain compliance",
      "Soft Empty Hands: Control techniques without strikes — escort, guide, restrain",
      "Hard Empty Hands: Strikes or takedowns when soft control is ineffective",
      "Intermediate Weapons: Less-lethal tools (baton, OC spray) when physical control fails",
      "Lethal Force: Only when Ability, Opportunity, and Jeopardy (AOJ) are all present"
    ],
    "legalRef": "OCGA 16-3-21 | Graham v. Connor (490 U.S. 386)",
    "callout": { "type": "warning", "text": "Skipping steps on the continuum — jumping from verbal commands directly to lethal force — is legally indefensible and constitutes excessive force under Graham v. Connor." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Resistance Levels and Appropriate Response",
    "body": "A subject's level of resistance determines the appropriate force response. Force must be relative to resistance, reasonable in application, and immediately reduced when compliance is achieved. Security officers must be able to articulate exactly what resistance level they observed and why their force response was proportional. The law evaluates your response against what a reasonable, trained officer would do in the same circumstances.",
    "keyPoints": [
      "Non-verbal cues: Body language, positioning, eye contact that signal pending resistance",
      "Verbal resistance: Refusal to comply — verbal commands, not physical force",
      "Passive resistance: Refusing to move or cooperate — soft empty hands appropriate",
      "Defensive resistance: Physical evasion without assault — transition to hard empty hands",
      "Active aggression: Physical assault — intermediate weapons or lethal force depending on threat",
      "Lethal resistance: Deadly weapon, lethal threat to officer or third person — lethal force authorized"
    ],
    "legalRef": "GBPDSA Force Standards | OCGA 16-3-21",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "De-escalation Techniques: Defusing Before Force",
    "body": "De-escalation is the deliberate effort to reduce the intensity of a confrontation using communication, positioning, and tactical patience. Effective de-escalation does not mean allowing a threat to continue — it means buying time, space, and options while maintaining full situational awareness and readiness to act. Officers trained in de-escalation stop more incidents before they require physical force.",
    "keyPoints": [
      "Tactical distance: Maintain minimum 6–8 feet from an agitated subject to preserve reaction time",
      "Tone and cadence: Lower your voice, slow your speech — agitated people mirror calm voices",
      "Acknowledge the emotion: 'I can see you're frustrated' disarms escalation faster than commands",
      "Give choices, not ultimatums: Options create buy-in; ultimatums create confrontations",
      "Remove the audience: Confrontations in front of others escalate — move to a private space if safe",
      "Call for backup before you need it — never after"
    ],
    "callout": { "type": "tip", "text": "De-escalation does not mean lowering your guard. Your hands remain visible and ready. Your positioning keeps egress options open. You are calm on the outside and fully alert on the inside." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Agitated Employee",
    "scenario": "You are posted at the lobby security desk of a corporate office building. A male employee enters the lobby at 3:15 PM moving quickly with clenched fists and raised voice. He announces loudly that he has just been fired and demands to go back up to the floor to 'get what he deserves.' His badge has already been deactivated by HR. He is moving toward the elevator bank. He does not have a visible weapon.",
    "prompt": "What force level is appropriate right now? What de-escalation steps do you take? At what point does your response escalate? What information do you radio to your supervisor immediately?",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Post-Incident Documentation and Reporting",
    "body": "Every use of force — including verbal commands that result in compliance — must be documented in a written incident report filed within 24 hours. Accurate, detailed documentation protects you legally, supports your agency, and contributes to the client's threat intelligence picture. Incomplete reports, delayed reports, or reports that minimize facts are as dangerous as the incident itself.",
    "keyPoints": [
      "Document the 5 Ws immediately: Who, What, When, Where, Why",
      "Record subject's resistance level with specific behavioral observations — not conclusions",
      "Note witnesses by name and badge/employee number",
      "Preserve any surveillance footage before it overwrites — notify your supervisor immediately",
      "Medical attention: If anyone was injured, document it and ensure EMS is called",
      "Never alter a report — corrections must be addenda with your signature and timestamp"
    ],
    "legalRef": "GBPDSA Incident Reporting Standards | Agency SOP",
    "callout": { "type": "warning", "text": "A use-of-force incident where the officer does not file a report is treated by courts and licensing boards as an officer with something to hide. File your report every time, without exception." },
    "narrationUrl": null
  }
]
$slides_11$
);


-- ── MOD-12: Cyber Awareness for Field Operators ───────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-12',
'Cyber Awareness for Field Operators',
$slides_12$
[
  {
    "type": "slide",
    "heading": "Why Cyber Awareness Belongs in Physical Security",
    "body": "Modern security operations exist at the intersection of physical and digital environments. Every badge reader, surveillance camera, access control system, and radio network is connected to a digital infrastructure that can be compromised. Adversaries increasingly use cyber techniques to enable or facilitate physical breaches — and physical access is the most reliable path to a network breach. The armed security officer who understands this intersection is exponentially more effective than one who does not.",
    "keyPoints": [
      "Physical and cyber security are no longer separate disciplines — they converge at every access point",
      "Compromised badge systems, tailgating, and shoulder surfing are hybrid physical-cyber threats",
      "Social engineering targets humans first — credentials and access policies second",
      "An officer's phone, radio, and building system credentials are all attack surfaces"
    ],
    "callout": { "type": "info", "text": "You don't need to be an IT professional to maintain strong cyber awareness. You need to recognize suspicious behavior, protect your credentials, and report what you see — the same instincts you use for physical threats." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Social Engineering: The Human Attack Vector",
    "body": "Social engineering is the use of psychological manipulation to trick individuals into revealing information, granting access, or bypassing security controls. It is the most successful attack vector in use today — because it targets the one component no firewall can protect: human judgment. Security officers are high-value social engineering targets because they have access to building systems, visitor logs, and emergency procedures.",
    "keyPoints": [
      "Pretexting: Attacker creates a fake identity or scenario to gain trust (e.g., 'I'm the IT contractor')",
      "Tailgating/Piggybacking: Following an authorized person through a secure door without badging",
      "Phishing: Emails or messages designed to harvest credentials — often impersonating leadership",
      "Vishing: Phone calls from 'IT support' or 'management' requesting access or information",
      "Impersonation: Wearing uniforms, carrying props, or faking authority to gain compliance"
    ],
    "callout": { "type": "warning", "text": "Legitimate IT, management, or law enforcement personnel will NEVER pressure you to bypass your security post or skip verification procedures. Pressure to skip a step is itself a red flag." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Operational Security (OPSEC) in the Field",
    "body": "Operational Security (OPSEC) is the practice of protecting sensitive information about your operations, routes, procedures, and clients from those who would exploit it. For a security officer, OPSEC failures happen most often through social media, casual conversation, and careless handling of shift schedules and site maps. Adversaries conduct surveillance before physical attacks — and public information about your security posture is their first intelligence source.",
    "keyPoints": [
      "Never post client site photos, patrol routes, camera placements, or shift schedules on social media",
      "Discuss sensitive site details only on a need-to-know basis — with colleagues, not in public spaces",
      "Lock your phone and computer when stepping away — unattended credentials are harvested",
      "Shred all printed schedules, access lists, and incident reports before discarding",
      "Use strong, unique passwords for building systems and never share them verbally or in writing"
    ],
    "callout": { "type": "warning", "text": "One social media post showing the camera blind spot at your post can compromise months of physical security investment. Your OPSEC discipline is as important as your firearm proficiency." },
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Field Operator Cyber Hygiene Checklist",
    "items": [
      { "label": "Device Lock Screen Active", "description": "Phone auto-locks within 60 seconds — biometric or PIN required to unlock" },
      { "label": "No Social Media of Site", "description": "Zero photos or location tags of client premises, equipment, or procedures posted publicly" },
      { "label": "Credential Hygiene", "description": "Building access codes, badge PINs, and system passwords are not written on paper or shared verbally" },
      { "label": "Suspicious Email Protocol", "description": "Do not click links or open attachments in unexpected emails — forward to IT/supervisor for review" },
      { "label": "Visitor Verification", "description": "All vendors, contractors, and visitors confirmed against the authorized visitor list before entry" },
      { "label": "Tailgating Zero Tolerance", "description": "Every person who follows you through a secured door without badging receives a polite but firm challenge" },
      { "label": "Incident Reporting", "description": "Any cyber-suspicious activity — odd login attempts, unknown USB devices, suspicious emails — reported immediately" }
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Recognizing and Reporting Cyber-Physical Threats",
    "body": "The field operator is often the first to observe indicators that precede a cyber-enabled physical attack. Camera systems going offline unexpectedly, access readers malfunctioning in specific patterns, unfamiliar personnel near server rooms or communication closets, and unusual vehicle surveillance of the perimeter are all indicators that may precede a coordinated breach. Reporting these indicators early disrupts the adversary's planning cycle before an incident occurs.",
    "keyPoints": [
      "Cameras going dark or cycling: May indicate tampering or a network intrusion affecting the surveillance system",
      "Access reader anomalies: Cards that should not work suddenly working — credential compromise",
      "Unrecognized devices near network ports, server rooms, or communication closets: Potential implants",
      "Recurring surveillance vehicles or individuals photographing the site perimeter: Pre-attack reconnaissance",
      "Report to supervisor immediately — do not confront suspected cyber operatives; document and report"
    ],
    "legalRef": "SHEL INFOSEC Physical-Cyber Convergence Standards | NIST SP 800-116",
    "callout": { "type": "tip", "text": "When in doubt, report. A false alarm costs nothing. A missed indicator before a breach costs everything. The report is always the right call." },
    "narrationUrl": null
  }
]
$slides_12$
);


-- ── MOD-13: Evidence Handling & Chain of Custody ─────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-13',
'Evidence Handling & Chain of Custody',
$slides_13$
[
  {
    "type": "slide",
    "heading": "What Constitutes Evidence: The First Responder's Responsibility",
    "body": "An armed security officer is frequently the first person on scene at an incident. The actions taken — or not taken — in the first minutes determine whether evidence is preserved or permanently compromised. Evidence includes anything that may be relevant to understanding what happened: physical objects, digital records, surveillance footage, witness statements, and the officer's own observations. The legal system requires that evidence be handled in a way that proves it was not tampered with from the moment it was found.",
    "keyPoints": [
      "Evidence is any material that may help establish the facts of an incident",
      "Physical evidence: weapons, documents, personal property, biological material",
      "Digital evidence: surveillance footage, access logs, phone records — time-sensitive, overwrites quickly",
      "Testimonial evidence: witness statements — collect names and contact information immediately",
      "The officer's written observations are admissible as a contemporaneous record"
    ],
    "callout": { "type": "warning", "text": "Touching, moving, or photographing evidence incorrectly — even with good intentions — can make it inadmissible in court and expose you to obstruction charges." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Chain of Custody: The Legal Standard",
    "body": "The chain of custody is the documented, chronological record of every person who handled a piece of evidence from the moment it was discovered to its presentation in court. A break in the chain of custody — any undocumented transfer, gap in storage, or unverified access — gives defense attorneys grounds to have the evidence excluded. The security officer's role is to secure the scene, limit access, and hand off cleanly to law enforcement with a written transfer record.",
    "keyPoints": [
      "Chain of custody begins the moment you identify an item as potential evidence",
      "Document: exact location found, time, your name, and who else was present",
      "Do not move the item unless it presents an immediate safety hazard",
      "Limit access to the scene — only personnel with a clear need to enter",
      "When law enforcement arrives, brief them verbally AND transfer a written record"
    ],
    "legalRef": "OCGA 24-8-820 | Federal Rules of Evidence 901",
    "callout": { "type": "info", "text": "You are not responsible for collecting or processing evidence — that is law enforcement's role. You ARE responsible for protecting the integrity of the scene until they arrive." },
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "First Responder Evidence Preservation Protocol",
    "items": [
      { "label": "Secure the Perimeter", "description": "Establish a clear, visible boundary around the scene — use caution tape, furniture, or your physical position" },
      { "label": "Limit Access", "description": "Document the name and reason for every person who enters the scene after your arrival" },
      { "label": "Note Surveillance Coverage", "description": "Identify which cameras covered the area — notify your supervisor immediately to prevent footage overwrite" },
      { "label": "Do Not Disturb", "description": "Leave items exactly as found unless there is an active safety hazard requiring immediate action" },
      { "label": "Document Your Observations", "description": "Write down what you saw, smelled, heard — exact time, exact location, exact condition" },
      { "label": "Identify Witnesses", "description": "Get full name, phone number, and employer/department of all witnesses before they leave the scene" },
      { "label": "Brief Law Enforcement on Arrival", "description": "Give a clear verbal briefing and hand over your written notes — do not keep your observations to yourself" }
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Digital Evidence: The 72-Hour Clock",
    "body": "Surveillance footage, access logs, and electronic key card records are the most valuable evidence in most workplace security incidents — and the most perishable. Most surveillance systems overwrite footage on a rolling 24–72 hour cycle. When an incident occurs, the immediate action is to notify the responsible party to preserve the footage before it is overwritten. Failure to preserve surveillance footage is one of the most common and most damaging evidence failures in security operations.",
    "keyPoints": [
      "Act within the first hour: notify supervisor and IT/facilities to flag and preserve footage",
      "Document: camera number, timestamp range, file location — do not rely on verbal confirmation alone",
      "Access logs (badge readers, elevator systems, parking gates) also overwrite — same urgency",
      "Do not attempt to export footage yourself unless specifically trained and authorized",
      "If footage has already overwritten: document that it was unavailable and why — this is still relevant"
    ],
    "callout": { "type": "warning", "text": "The words 'the camera didn't save it' after an incident will be scrutinized in court. If you were the officer on duty and failed to request preservation, you may face personal liability for that failure." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Legal Consequences of Evidence Mishandling",
    "body": "Evidence mishandling by a security officer can result in criminal charges being dropped, civil lawsuits dismissed, license revocation, and personal criminal liability. The GBPDSA requires officers to cooperate fully with law enforcement investigations and to maintain professional standards in all incident documentation. Officers who attempt to alter, hide, or destroy evidence — even believing they are protecting their employer — commit obstruction of justice under Georgia law.",
    "keyPoints": [
      "Obstruction of justice: OCGA 16-10-24 — altering or concealing evidence is a felony",
      "Tampering with evidence: OCGA 16-10-94 — tampering with physical evidence is a felony",
      "Civil liability: Evidence mishandling that leads to wrongful conviction or false acquittal creates massive civil exposure",
      "License revocation: GBPDSA may revoke license for conduct unbecoming — evidence tampering qualifies",
      "The only protection: follow protocol, document everything, hand off to law enforcement cleanly"
    ],
    "legalRef": "OCGA 16-10-24 | OCGA 16-10-94 | GBPDSA Conduct Standards",
    "callout": { "type": "warning", "text": "There is no employer instruction that overrides your legal obligation to preserve evidence. If instructed to destroy or conceal evidence, refuse, document the instruction, and consult legal counsel immediately." },
    "narrationUrl": null
  }
]
$slides_13$
);


-- ── MOD-14: Executive Protection Fundamentals ────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-14',
'Executive Protection Fundamentals',
$slides_14$
[
  {
    "type": "slide",
    "heading": "The Executive Protection Mindset",
    "body": "Executive Protection (EP) is the specialized discipline of safeguarding individuals — principals — who face elevated personal security risk due to their professional role, public profile, or specific threat indicators. EP is fundamentally different from static guard duty. The EP operator is proactive, intelligence-driven, and operates in close proximity to the principal under all conditions. The mission is never just to respond to a threat — it is to prevent the threat from materializing.",
    "keyPoints": [
      "The EP operator's primary mission is threat avoidance — not threat response",
      "All planning is principal-centric: routes, venues, timing, and communications serve the principal's safety",
      "EP operators must be calm, professional, and unobtrusive — conspicuous protection is poor protection",
      "Situational awareness is continuous — there is no 'off' switch during a protection assignment"
    ],
    "callout": { "type": "info", "text": "A principal who does not know they are being protected is a principal who moves naturally. Natural movement is harder to predict — and harder to target. Discrete protection is superior protection." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Advance Work: Controlling the Environment Before Arrival",
    "body": "Advance work is the intelligence and logistics preparation conducted at venues, routes, and locations before the principal arrives. It is the foundation of professional EP. An advance agent walks the ground, identifies threats and vulnerabilities, establishes contact with venue security, locates hospital routes, identifies emergency exits, and confirms communications. A protection team that has done its advance work turns the unknown into the known.",
    "keyPoints": [
      "Site advance: walk the venue, identify all entry/exit points, locate medical facilities, confirm camera coverage",
      "Route advance: primary and alternate routes identified, traffic patterns noted, choke points mapped",
      "Medical advance: nearest Level 1 trauma center confirmed, estimated transport time calculated",
      "Communications: all contact numbers confirmed, radio frequencies tested, dead zones identified",
      "Threat assessment: any known threats to the principal specific to this location or event"
    ],
    "callout": { "type": "tip", "text": "The advance agent's report is the most important document produced during an EP assignment. If it is not written, it did not happen." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Counter-Surveillance and Pre-Attack Indicators",
    "body": "Most attacks on principals are preceded by surveillance. Adversaries study the target's movements, habits, vehicle, security posture, and predictable patterns before initiating an attack. The EP operator who recognizes surveillance in progress disrupts the attack cycle at the earliest and most decisive point. Pre-attack indicators are observable — they require training to recognize and discipline to act on.",
    "keyPoints": [
      "Surveillance indicators: same face or vehicle appearing in multiple locations over multiple days",
      "Photographic surveillance: individuals photographing the principal, vehicles, or security team",
      "Unusual behavior near the principal's residence, office, or frequent venues",
      "Counter-surveillance: deliberately varying routes and timings to make the principal harder to track",
      "Reporting: document surveillance indicators — date, time, description, plate number if vehicle — report immediately"
    ],
    "legalRef": "ASIS EP Standards | GBPDSA Professional Conduct",
    "callout": { "type": "warning", "text": "Predictable patterns are lethal. A principal who leaves the same building at the same time via the same route every day has given an adversary everything they need to plan an attack." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Weapon Retention in Close Protection",
    "body": "In close protection assignments, the EP operator works in tight proximity to both the principal and the public. This proximity creates opportunities for a weapon grab that are far more likely than in static guard duty. Weapon retention techniques — the Lindell Method — are not just range skills in this context: they are mission-critical. An EP operator who loses their firearm has not just failed the assignment — they have potentially handed the adversary a weapon.",
    "keyPoints": [
      "Holster selection: only Level II or Level III retention holsters on all EP assignments",
      "Body positioning: weapon-side away from public during principal movement and handshake lines",
      "Pre-attack indicators specific to gun grabs: excessive eye contact with the holster, subject closing distance rapidly",
      "Retention protocol: secure the weapon, create space, maintain principal coverage simultaneously",
      "Immediate notification: any weapon grab attempt — successful or not — is a critical incident requiring full report"
    ],
    "legalRef": "Lindell Method Retention | GBPDSA Armed Security Standards",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Crowded Venue",
    "scenario": "You are escorting a corporate executive through a crowded hotel lobby after a conference event. The principal is shaking hands and posing for photos with attendees. You observe a male subject who has been moving parallel to your group for approximately four minutes. He has made eye contact with you twice, and you have now noticed he is looking at your holster rather than at the principal. The subject has one hand in his jacket pocket and is moving to close the distance between himself and the principal.",
    "prompt": "What is your immediate action? How do you position yourself relative to the principal? At what point does your response escalate to a verbal challenge? To physical intervention? Who do you notify and when?",
    "narrationUrl": null
  }
]
$slides_14$
);


-- ── MOD-15: Scenario Practicum — Field Judgment ───────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-15',
'Scenario Practicum: Field Judgment',
$slides_15$
[
  {
    "type": "slide",
    "heading": "Applying AOJ: The Standard for Lethal Force",
    "body": "Ability, Opportunity, and Jeopardy (AOJ) are the three elements that must ALL be present simultaneously before lethal force is legally justified. This is not a checklist completed before firing — it is an instantaneous assessment that must be made and documented. Officers who can articulate clearly why all three elements were present will survive legal scrutiny. Officers who cannot will not.",
    "keyPoints": [
      "ABILITY: The subject possesses the means to cause death or great bodily harm — a weapon, physical capability, or numerical advantage",
      "OPPORTUNITY: The subject is in a position to immediately employ that means — close enough, in range, or about to close distance",
      "JEOPARDY: The subject's actions demonstrate imminent intent to use deadly force — aggressive movement, verbal threat, weapon raised",
      "All three must be present simultaneously — the absence of ANY element means lethal force is not justified",
      "Post-incident: you must be able to verbally articulate each element to law enforcement"
    ],
    "legalRef": "OCGA 16-3-21 | Graham v. Connor | AOJ Doctrine",
    "callout": { "type": "warning", "text": "The word 'felt' is not sufficient in a use-of-force report. 'I felt threatened' is not the same as 'The subject was holding a knife and advancing toward me at arm's reach.' Specific facts — not feelings — justify force." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario 1: The Retail Theft — Property vs. Life",
    "scenario": "You are posted at the exit of a retail electronics store. A male subject runs past you toward the exit carrying two laptops he has not paid for. The store manager shouts 'Stop him!' The subject shoves through the door and is now in the parking lot, still running. You have not been physically threatened. No weapon is visible. You are armed.",
    "prompt": "Is lethal force authorized to stop this individual? Apply the AOJ test. What is the correct response? What OCGA statute specifically governs this situation? What are the consequences if you fire?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario 2: Defense of a Third Person",
    "scenario": "You are conducting a foot patrol of an apartment complex parking garage at 2200 hours. You round a corner and observe a male subject physically assaulting a female, who is on the ground. The male subject has her by the throat and is striking her repeatedly. He is significantly larger than her. He does not have a visible weapon but is clearly causing serious physical harm. He has not seen you yet.",
    "prompt": "Is lethal force authorized immediately? What force level do you enter at? How do you announce yourself? At what point does your assessment change if he reaches for his waistband? What does OCGA 16-3-21 specifically authorize you to do here?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario 3: The Fleeing Subject",
    "scenario": "You are patrolling the perimeter of an industrial facility. You observe a male subject exiting through a damaged fence line carrying a bag. He begins running when he sees you. You do not know what is in the bag. You do not know if he is armed. He has not threatened you. He is now 40 yards away and increasing distance.",
    "prompt": "Can you use lethal force to stop this individual from fleeing? Under what specific circumstances would that change? What does GBPDSA training say about shooting at fleeing subjects? What is the correct response here?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario 4: The Weapon Grab",
    "scenario": "You are conducting an interview stance interaction with an individual who has been verbally belligerent but has not been physically aggressive. Without warning, the subject lunges forward and grabs your holstered firearm with both hands. You have one hand free. Your Level II retention holster is engaged. The subject is pulling and twisting the weapon with significant force.",
    "prompt": "Walk through the Lindell Method retention protocol step by step. What is your immediate priority — drawing the weapon or securing it? What does your free hand do? At what point does this become an AOJ situation justifying lethal force? What do you report and to whom?",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "After Action: The Tactical Review Standard",
    "body": "Every use-of-force incident — including those where force was authorized and appropriately applied — requires a formal after-action review. The purpose is not punishment. It is learning. Professional operators study their performance the same way athletes study film: to identify what worked, what failed, what could have been avoided, and what was done correctly under pressure. This continuous improvement cycle is what separates professional operators from those who get their license revoked.",
    "keyPoints": [
      "Immediate: Ensure scene is safe, render first aid if needed, request law enforcement and EMS",
      "Document: Write your incident report within two hours while memory is clear and precise",
      "Legal hold: Do not discuss the incident with non-supervisory personnel — request legal representation before police interview if your use of force may be questioned",
      "Agency review: Cooperate fully — this protects you as much as it protects the client",
      "Learning: Review your decision points honestly — where was your AOJ assessment strong? Where did you hesitate? Where could de-escalation have been applied earlier?"
    ],
    "legalRef": "GBPDSA Post-Incident Reporting Standards | Agency SOP",
    "callout": { "type": "tip", "text": "The operator who reviews their performance honestly after every incident will not face a career-ending event. The operator who never reviews will repeat their mistakes — once too many." },
    "narrationUrl": null
  }
]
$slides_15$
);


-- ── MOD-16: Final Accreditation Examination ──────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'MOD-16',
'Final Accreditation Examination',
$slides_16$
[
  {
    "type": "slide",
    "heading": "You Have Reached the Final Module",
    "body": "Completing all 16 modules of the MJM 2026 Armed Security Accreditation curriculum is a significant professional achievement. You have covered the full GBPDSA-mandated training requirement, the legal and use-of-force framework that governs every decision you make on duty, the technical proficiency required to carry a firearm professionally, and the operational standards that define the Spartan Training standard of competency. This final module is your capstone examination.",
    "keyPoints": [
      "You have completed 16 hours of GBPDSA-mandated curriculum",
      "Legal framework: GBPDSA, OCGA 16-3-21, OCGA 17-4-20, Graham v. Connor, AOJ doctrine",
      "Technical proficiency: nomenclature, safety, cycle of operation, ballistics, retention",
      "Tactical operations: range qualification, marksmanship fundamentals, weapon draw",
      "Professional standards: compliance, documentation, evidence handling, workplace violence, EP fundamentals"
    ],
    "callout": { "type": "info", "text": "The Final Accreditation Examination covers all 16 modules. A passing score of 85% is required. There are no critical fail questions — but every question reflects a standard you will be held to professionally and legally." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Legal Framework — Key Provisions Recap",
    "body": "The legal framework you have studied is not academic. It is the operational boundary within which every use-of-force decision you make will be judged. Courts evaluate your actions against the Reasonable Officer Standard established in Graham v. Connor — not against what you knew after the fact, but against what a reasonable, trained officer in your exact circumstances would have known in the moment. Knowing the law is not optional — it is the foundation of every professional decision.",
    "keyPoints": [
      "OCGA 16-3-21: Use of force in defense of self or others — three authorized situations",
      "OCGA 17-4-20: Use of force for arrest — security officers are NOT peace officers, limitations apply",
      "42 USC § 1983: Civil rights liability for color of law violations — applies to security officers in some contexts",
      "Graham v. Connor (490 U.S. 386): Objective reasonableness standard for all use-of-force evaluations",
      "AOJ: Ability, Opportunity, Jeopardy — all three required simultaneously for lethal force"
    ],
    "legalRef": "OCGA 16-3-21 | OCGA 17-4-20 | 42 USC § 1983 | Graham v. Connor",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Technical Proficiency — What Competency Means",
    "body": "Technical proficiency in this program is defined by the GBPDSA standard: 80% passing score on the written examination and 80% minimum on the live-fire range qualification. On this platform, each module's knowledge assessment enforces the same standard. Competency means you can reliably demonstrate the correct action under pressure — not just recognize it on a multiple choice question. The range qualification and this platform work together to certify full-spectrum competency.",
    "keyPoints": [
      "Four Cardinal Rules are non-negotiable — violation in training or duty is grounds for immediate remediation",
      "The eight phases of a semi-automatic pistol's cycle of operation are not trivia — they explain every malfunction",
      "Marksmanship fundamentals: stance, grip, sight alignment, sight picture, breath control, trigger press, follow-through",
      "Terminal ballistics: understanding how rounds perform shapes ammunition selection and engagement decisions",
      "Weapon retention: the Lindell Method is your last line of defense when force-on-force contact is made"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Professional Standards — The Spartan Standard",
    "body": "The MJM 2026 program does not just train operators to meet the minimum GBPDSA standard. It trains operators to exceed it. The Spartan Standard means: every interaction is professional, every report is accurate, every use-of-force decision is legally defensible, and every compliance obligation is met without exception. The operators who complete this program represent MAJ. Makropoulos, Palisade International, and the security profession in every client engagement.",
    "keyPoints": [
      "GBPDSA compliance is the floor — professional conduct is the ceiling",
      "Documentation protects you, your client, and your agency — file reports every time",
      "Continuous training: annual recertification is not a burden, it is the price of carrying a firearm professionally",
      "Professional conduct means you are never the reason a client loses confidence in their security investment",
      "If in doubt: de-escalate, document, consult — never improvise with lethal force"
    ],
    "callout": { "type": "tip", "text": "The Spartan Standard is not a slogan. It is the decision you make every time you put on your badge, pick up your weapon, and step into a client's environment. Represent it." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Certification and Next Steps",
    "body": "Upon passing the Final Accreditation Examination with a score of 85% or higher, your MJM 2026 Armed Security Accreditation is complete on this platform. Your completion record is immutably logged and available for GBPDSA compliance reporting. The next steps are your live-fire range qualification with a GBPDSA-licensed instructor and submission of your completed training records to your agency's compliance officer. Welcome to the standard.",
    "keyPoints": [
      "Platform accreditation: all 16 modules passed at their respective competency thresholds",
      "Next: live-fire range qualification with your duty weapon at 80% minimum",
      "Your operator ID and completion timestamps are your official MJM 2026 training record",
      "Annual renewal: this platform will be updated each year — your training record carries forward",
      "Questions or compliance issues: contact mak@palisadeintl.com (770-639-3939)"
    ],
    "callout": { "type": "info", "text": "Congratulations on completing the MJM 2026 Armed Security Accreditation. You have met and exceeded the GBPDSA standard. The Spartan Training record follows you throughout your career." },
    "narrationUrl": null
  }
]
$slides_16$
);


-- ═══════════════════════════════════════════════════════════════════
-- QUIZ QUESTIONS — MOD-10 through MOD-16
-- 5 questions per module, 1 critical per module (is_critical = true)
-- ═══════════════════════════════════════════════════════════════════

-- ── MOD-10 Quiz Questions ──────────────────────────────────────────────────────
INSERT INTO public.quiz_questions
  (id, module_id, sequence, question, option_a, option_b, option_c, option_d, correct, explanation, is_critical, topic)
VALUES
(
  'mod-10-q1', 'MOD-10', 1,
  'Under GA Admin Code 509-3-.01, what is the MINIMUM number of annual firearms training hours required for a licensed armed security officer in Georgia?',
  '8 hours', '12 hours', '16 hours', '24 hours',
  'C',
  '509-3-.01 mandates a minimum of 16 hours of firearms training per calendar year for all armed security officers in Georgia. This requirement applies regardless of prior law enforcement experience.',
  false, 'GBPDSA Training Requirements'
),
(
  'mod-10-q2', 'MOD-10', 2,
  'A licensed individual armed security officer discovers their employing agency''s PDSC license lapsed 3 days ago. The officer''s personal PDSG license is current. Which of the following is CORRECT?',
  'The officer may continue working because their personal license is valid',
  'The officer is legally prohibited from working as an armed security officer until the agency renews its license',
  'The officer may work unarmed but not armed',
  'The officer has a 30-day grace period to find a licensed agency',
  'B',
  'Both the individual PDSG license AND the employing agency PDSC license must be current simultaneously. An officer working for an unlicensed agency is operating illegally regardless of their personal license status. There is no grace period.',
  true, 'Dual Licensure Requirement'
),
(
  'mod-10-q3', 'MOD-10', 3,
  'Under GBPDSA Board Rule 509-4-.01, what is the MINIMUM passing score required on the live-fire range qualification?',
  '70%', '75%', '80%', '85%',
  'C',
  'Board Rule 509-4-.01 requires a minimum passing score of 80% on the live-fire range qualification, proctored by a GBPDSA-licensed firearms instructor. This applies to both initial certification and annual renewal.',
  false, 'Range Qualification Standards'
),
(
  'mod-10-q4', 'MOD-10', 4,
  'How many rounds of practice ammunition must a security officer fire BEFORE beginning the official qualification course under Board Rule 509-4-.01?',
  '48 rounds', '96 rounds', '144 rounds', '192 rounds',
  'C',
  '509-4-.01 requires a minimum of 144 rounds of practice ammunition to be fired before the qualification course begins. The qualification itself consists of two iterations of 48 rounds each.',
  false, 'Range Qualification Protocol'
),
(
  'mod-10-q5', 'MOD-10', 5,
  'An armed security officer''s PDSG license expired yesterday. They are scheduled to work an armed shift today. Under OCGA 43-38, what is the consequence for working this shift?',
  'A verbal warning from the Board on first offense',
  'An administrative fine only, with no criminal exposure',
  'A Class A misdemeanor on first offense, escalating to felony on repeat offense',
  'License suspension for 30 days',
  'C',
  'Operating as an armed security officer without a current GBPDSA license is a Class A misdemeanor on first offense and escalates to felony charges on subsequent offenses under OCGA 43-38. There are no warnings or administrative-only first-offense options.',
  false, 'License Compliance Penalties'
),

-- ── MOD-11 Quiz Questions ──────────────────────────────────────────────────────
(
  'mod-11-q1', 'MOD-11', 1,
  'According to the Use of Force Continuum, which force option immediately PRECEDES Intermediate Weapons (less-lethal tools)?',
  'Officer Presence', 'Verbal Commands', 'Soft Empty Hands', 'Hard Empty Hands',
  'D',
  'The Use of Force Continuum progresses: Presence → Verbal → Soft Empty Hands → Hard Empty Hands → Intermediate Weapons → Lethal Force. Hard Empty Hands (strikes, takedowns) is the level immediately below Intermediate Weapons.',
  false, 'Use of Force Continuum'
),
(
  'mod-11-q2', 'MOD-11', 2,
  'A security officer is confronting an individual who verbally refuses to leave the premises but is standing still and not making any physical movement toward the officer. Which resistance level does this BEST represent?',
  'Active Resistance', 'Defensive Resistance', 'Passive Resistance', 'Lethal Resistance',
  'C',
  'Passive resistance is when a subject uses non-movement tactics to resist compliance — standing still and refusing to comply without physical aggression or evasion. The appropriate response is Soft Empty Hands control, not striking.',
  false, 'Resistance Levels'
),
(
  'mod-11-q3', 'MOD-11', 3,
  'A terminated employee is advancing rapidly toward a secured door while shouting threats. The officer has deployed verbal commands with no effect. The subject reaches out and physically grabs the officer''s arm to push past. Under the Use of Force Continuum, this now constitutes:',
  'Passive Resistance — the subject is emotionally distressed',
  'Defensive Resistance — the subject is evading, not assaulting',
  'Active Aggression — physical assault has occurred',
  'Lethal Resistance — any physical contact justifies lethal force',
  'C',
  'Physical assault on the officer — grabbing, pushing, or striking — constitutes Active Aggression, which justifies Hard Empty Hands or Intermediate Weapons. It does NOT immediately justify lethal force unless a deadly weapon is introduced.',
  true, 'Force Escalation Decision'
),
(
  'mod-11-q4', 'MOD-11', 4,
  'Which of the following is the MOST effective first step in de-escalating an agitated individual?',
  'Issue a direct ultimatum to comply immediately',
  'Approach quickly to demonstrate authority and control the space',
  'Maintain tactical distance, lower your voice, and acknowledge their emotional state',
  'Draw your firearm to demonstrate the consequences of non-compliance',
  'C',
  'Effective de-escalation begins with maintaining tactical distance (6-8 feet minimum), lowering voice tone and cadence, and verbally acknowledging the subject''s emotional state. Ultimatums, rapid approach, and weapon display all escalate rather than de-escalate.',
  false, 'De-escalation Techniques'
),
(
  'mod-11-q5', 'MOD-11', 5,
  'Following any use-of-force incident, within what timeframe should an incident report be submitted?',
  'Before end of shift, or within 24 hours if the shift ends immediately after the incident',
  'Within 72 hours',
  'Within 7 days',
  'Only if law enforcement requests it',
  'A',
  'Incident reports must be filed before end of shift when possible, or within 24 hours maximum. Delayed documentation loses precision, creates legal vulnerability, and may be interpreted as an attempt to obscure facts. All use-of-force incidents require documentation regardless of whether law enforcement is involved.',
  false, 'Post-Incident Documentation'
),

-- ── MOD-12 Quiz Questions ──────────────────────────────────────────────────────
(
  'mod-12-q1', 'MOD-12', 1,
  'Which of the following BEST describes a social engineering attack known as "pretexting"?',
  'Sending a malicious email link to harvest login credentials',
  'Following an authorized person through a secured door without badging',
  'An attacker creates a fabricated scenario or identity to manipulate a target into providing access or information',
  'Installing malicious software on an unattended workstation',
  'C',
  'Pretexting involves creating a false identity or scenario — such as posing as an IT contractor or building inspector — to manipulate security personnel into granting access or revealing sensitive information. It targets human trust rather than technical systems.',
  false, 'Social Engineering'
),
(
  'mod-12-q2', 'MOD-12', 2,
  'A security officer observes a person in a technician''s uniform near a network communications closet in a restricted area. The person claims to be from IT and says they were sent to check the router. The officer does not see them on the authorized visitor list. What is the CORRECT response?',
  'Allow access because the uniform indicates authorization',
  'Allow supervised access while notifying the supervisor',
  'Verify the individual against the authorized visitor list, deny access until confirmed, and notify your supervisor',
  'Immediately detain the individual as a criminal suspect',
  'C',
  'Legitimate IT personnel will always be on an authorized access list. The correct response is to verify identity against the visitor list, deny access until confirmed by the responsible manager, and notify your supervisor. Uniforms and tools are not authorization.',
  true, 'Access Control and Verification'
),
(
  'mod-12-q3', 'MOD-12', 3,
  'An OPSEC failure that commonly affects security officers involves:',
  'Filing incident reports too quickly',
  'Posting photos of the patrol route, client site, or camera locations on social media',
  'Wearing a uniform in public outside of working hours',
  'Carrying a phone on duty',
  'B',
  'OPSEC failures most commonly occur through social media — posting photos that reveal camera placement, patrol routes, access points, or shift schedules. Adversaries conduct open-source intelligence gathering before physical attacks, and a single post can compromise months of security investment.',
  false, 'Operational Security'
),
(
  'mod-12-q4', 'MOD-12', 4,
  'Which of the following is a potential cyber-physical threat indicator that a security officer should immediately report?',
  'A visitor who takes longer than usual to badge in at the main entrance',
  'A surveillance camera in a specific zone that goes offline unexpectedly and access readers in the same zone malfunction simultaneously',
  'An employee who forgets their badge and enters through a courtesy door',
  'A delivery that arrives after hours',
  'B',
  'Multiple security systems failing simultaneously in the same zone — cameras going dark and access readers malfunctioning together — is a pattern consistent with a coordinated cyber-enabled breach attempt. This combination of indicators requires immediate supervisor notification and a security sweep.',
  false, 'Cyber-Physical Threat Indicators'
),
(
  'mod-12-q5', 'MOD-12', 5,
  'What is the CORRECT action when a security officer receives an unexpected phone call from someone claiming to be from "IT support" and requesting the access code to the server room?',
  'Provide the code because IT requests are routine',
  'Provide the code but document the call in the incident log',
  'Refuse to provide codes over the phone, end the call, and verify the request through your supervisor using a confirmed contact number',
  'Transfer the caller to building management',
  'C',
  'Legitimate IT support never requests access codes over the phone. This is a classic vishing (voice phishing) social engineering attempt. The correct response is to refuse, end the call, and verify through a confirmed supervisor contact — not through a number the caller provides.',
  false, 'Vishing and Credential Security'
),

-- ── MOD-13 Quiz Questions ──────────────────────────────────────────────────────
(
  'mod-13-q1', 'MOD-13', 1,
  'The Chain of Custody begins at which point?',
  'When law enforcement arrives and takes control of the scene',
  'When the incident report is filed',
  'The moment a security officer identifies an item as potential evidence',
  'When the item is photographed by the investigating agency',
  'C',
  'The chain of custody begins the moment a security officer identifies an item as potential evidence — not when law enforcement arrives, not when the report is filed. Every person who handles the item from that moment forward must be documented.',
  false, 'Chain of Custody Fundamentals'
),
(
  'mod-13-q2', 'MOD-13', 2,
  'A security officer arrives first on scene at a workplace altercation and observes a knife on the floor near the involved parties. What is the CORRECT immediate action regarding the knife?',
  'Pick up the knife and secure it in a locked location to prevent further use',
  'Leave the knife exactly where it is, secure the scene perimeter, and document its exact position before law enforcement arrives',
  'Photograph the knife and then move it to a safe location',
  'Hand the knife to the victim for safekeeping',
  'B',
  'Physical evidence must not be moved unless it presents an immediate safety hazard. The correct action is to leave the knife in place, secure the perimeter around it, document its exact position with time-stamped observations, and preserve it for law enforcement. Moving evidence breaks the chain of custody.',
  true, 'Evidence Preservation Protocol'
),
(
  'mod-13-q3', 'MOD-13', 3,
  'Most surveillance systems overwrite footage on what typical cycle?',
  '7–14 days', '24–72 hours', '30 days', '6 months',
  'B',
  'Most surveillance systems overwrite footage on a rolling 24–72 hour cycle. This makes immediate action critical when an incident occurs — supervisors and IT/facilities must be notified within the first hour to flag and preserve relevant footage.',
  false, 'Digital Evidence Preservation'
),
(
  'mod-13-q4', 'MOD-13', 4,
  'Under OCGA 16-10-94, what is the classification of deliberately altering or destroying physical evidence?',
  'A civil violation resulting in license suspension',
  'A Class B misdemeanor',
  'A Class A misdemeanor',
  'A felony',
  'D',
  'Under OCGA 16-10-94, tampering with physical evidence is classified as a felony in Georgia. This applies regardless of who instructs the action — there is no employer instruction that overrides this legal obligation.',
  false, 'Evidence Tampering Law'
),
(
  'mod-13-q5', 'MOD-13', 5,
  'A security officer''s supervisor instructs them to erase a surveillance recording that captured the supervisor improperly accessing a restricted area. What is the CORRECT response?',
  'Follow the instruction as the supervisor has authority over security systems',
  'Follow the instruction but document it privately',
  'Refuse the instruction, document it in writing with time and date, and report it through the agency''s chain of command above the supervisor',
  'Erase the footage to protect the company from liability',
  'C',
  'No supervisor instruction overrides the legal prohibition on destroying evidence under OCGA 16-10-94. The officer must refuse, document the instruction with specifics, and report it through appropriate channels. Compliance with an instruction to destroy evidence makes the officer criminally liable alongside the supervisor.',
  false, 'Ethical Obligations and Evidence'
),

-- ── MOD-14 Quiz Questions ──────────────────────────────────────────────────────
(
  'mod-14-q1', 'MOD-14', 1,
  'What is the PRIMARY mission objective of an Executive Protection operator?',
  'To respond effectively to an attack on the principal',
  'To project a visible armed deterrence around the principal at all times',
  'To prevent threats from materializing through advance work, route variation, and early warning',
  'To maintain constant physical contact with the principal during all movements',
  'C',
  'The primary EP mission is threat prevention — not response. The best protection operation is one in which the principal never knows they were in danger because the operator had already neutralized the threat through intelligence, advance work, and route variation before it could materialize.',
  false, 'Executive Protection Fundamentals'
),
(
  'mod-14-q2', 'MOD-14', 2,
  'During an advance for an executive visit to a hotel venue, what is a CRITICAL element the advance agent must confirm?',
  'The hotel''s star rating and amenities',
  'The location of the nearest Level 1 trauma center and estimated transport time',
  'The names of all hotel staff on duty',
  'Whether parking is available for the principal''s vehicle',
  'B',
  'Medical advance is a critical element — the advance agent must confirm the nearest Level 1 trauma center, calculate transport time, and identify the fastest route. In a medical emergency or attack, this information must be immediately available without delay.',
  false, 'Advance Work'
),
(
  'mod-14-q3', 'MOD-14', 3,
  'An EP operator observes the same male subject appearing near the principal''s residence on three consecutive mornings, photographing the entrance from a vehicle. This MOST likely represents:',
  'A journalist conducting a routine news story',
  'Pre-attack surveillance that must be documented and reported immediately',
  'A coincidence requiring no action',
  'A delivery driver checking addresses',
  'B',
  'The same individual appearing near the principal''s residence on multiple occasions and photographing the entrance is a classic pre-attack surveillance pattern. This must be documented with full description, vehicle details, and timestamps — and reported immediately to the EP team leader and the principal.',
  true, 'Counter-Surveillance and Threat Recognition'
),
(
  'mod-14-q4', 'MOD-14', 4,
  'For an EP assignment in close-contact environments (handshake lines, crowded venues), which holster retention level is the MINIMUM recommended?',
  'Level I (friction retention only)', 'Level II retention', 'Level III retention', 'No holster — weapon should be concealed in a jacket',
  'B',
  'Level II or Level III retention holsters are required for EP assignments where close public contact is anticipated. Level I friction holsters provide insufficient protection against the weapon grabs that are elevated in close-contact environments.',
  false, 'Weapon Retention in EP'
),
(
  'mod-14-q5', 'MOD-14', 5,
  'Predictable patterns in a principal''s movements are dangerous because:',
  'They make it difficult for the EP team to plan advance work efficiently',
  'They reduce the principal''s operational efficiency',
  'They give an adversary conducting surveillance the information needed to plan an attack with certainty',
  'They attract media attention',
  'C',
  'Predictable patterns — same route, same time, same vehicle — allow an adversary conducting pre-attack surveillance to know exactly where the principal will be and when. Route variation and timing unpredictability are among the most effective EP countermeasures available.',
  false, 'Pattern of Life and Counter-Surveillance'
),

-- ── MOD-15 Quiz Questions ──────────────────────────────────────────────────────
(
  'mod-15-q1', 'MOD-15', 1,
  'The three elements of AOJ — Ability, Opportunity, and Jeopardy — must be present in which configuration to justify lethal force?',
  'Any one of the three elements is sufficient',
  'Any two of the three elements are sufficient',
  'All three elements must be present simultaneously',
  'Only Jeopardy is required if the threat is serious enough',
  'C',
  'All three elements of AOJ must be present simultaneously to justify lethal force. The absence of ANY single element — ability, opportunity, or jeopardy — means lethal force is not legally justified. This is the foundational standard under OCGA 16-3-21.',
  true, 'AOJ Doctrine — Lethal Force Standard'
),
(
  'mod-15-q2', 'MOD-15', 2,
  'A subject flees a store with laptops he did not pay for and has not threatened the officer or any other person. Which of the following CORRECTLY states the armed security officer''s authority to use lethal force?',
  'Lethal force is authorized to prevent a felony theft',
  'Lethal force is authorized because the officer has a duty to stop crimes in progress',
  'Lethal force is NOT authorized because property theft alone — without forcible felony or threat of serious harm — does not satisfy the AOJ standard',
  'Lethal force is authorized at the officer''s discretion based on the value of the stolen property',
  'C',
  'Property theft — even felony-level theft — does not justify lethal force. Lethal force requires imminent threat of death or great bodily harm to the officer or a third person, or to prevent a FORCIBLE felony. Theft without violence is not a forcible felony under OCGA 16-3-21.',
  false, 'Property vs. Life — Use of Force'
),
(
  'mod-15-q3', 'MOD-15', 3,
  'OCGA 16-3-21 authorizes the use of lethal force to prevent the commission of a forcible felony. Which of the following qualifies as a FORCIBLE FELONY under OCGA 16-1-3(6)?',
  'Theft of property valued over $500',
  'Trespassing on a secured property',
  'Armed robbery — a theft committed with a firearm or deadly weapon',
  'Vandalism of a vehicle',
  'C',
  'Under OCGA 16-1-3(6), a forcible felony is any felony involving the use or threat of physical force or violence against a person. Armed robbery qualifies because it involves a deadly weapon threat. Property theft alone, trespassing, and vandalism are not forcible felonies.',
  false, 'Forcible Felony Definition'
),
(
  'mod-15-q4', 'MOD-15', 4,
  'During a weapon retention attempt, which step of the Lindell Method takes IMMEDIATE priority?',
  'Drawing the weapon from the holster',
  'Verbal commands to release the weapon',
  'Securing the weapon in the holster and moving to a position of advantage over the attacker',
  'Calling for backup on the radio',
  'C',
  'The Lindell Method prioritizes: (1) securing the weapon in the holster, (2) moving to a position of advantage over the attacker, then (3) releasing and regaining control of the weapon. Drawing the weapon during an active grab attempt against you may accelerate the disarm — secure it first.',
  false, 'Weapon Retention — Lindell Method'
),
(
  'mod-15-q5', 'MOD-15', 5,
  'After using force in a workplace incident, a fellow officer tells you that he saw everything and will back up any version of events you want to report. What is the CORRECT response?',
  'Accept the offer to ensure a consistent account protects both officers',
  'Decline and instruct the officer to provide their own independent, accurate account — then both submit truthful reports separately',
  'Agree to coordinate accounts with the supervisor present',
  'Decline but ask the officer to simply "not mention" certain details',
  'B',
  'Coordinating false or misleading accounts constitutes falsification of records and potentially obstruction of justice under OCGA 16-10-94 and 16-10-24. Every officer must provide their own independent, truthful, accurate account. Coordinated false accounts expose both officers to criminal charges and license revocation.',
  false, 'Post-Incident Integrity and Reporting'
),

-- ── MOD-16 Quiz Questions ──────────────────────────────────────────────────────
(
  'mod-16-q1', 'MOD-16', 1,
  'The Georgia GBPDSA mandate under Admin Code 509-3-.01 requires which COMBINATION of training annually?',
  'Written examination only, at 80% passing',
  'Range qualification only, with 144 rounds practice minimum',
  'Both classroom instruction covering legal, safety, and technical topics AND live-fire range qualification — 16 hours total',
  'Online modules only, at 85% passing score',
  'C',
  '509-3-.01 requires 16 hours of training that includes BOTH classroom instruction (legal, safety, technical content) AND live-fire range qualification. Neither component alone satisfies the mandate. The training must be proctored by a GBPDSA-licensed firearms instructor.',
  false, 'GBPDSA Compliance Summary'
),
(
  'mod-16-q2', 'MOD-16', 2,
  'Under the Graham v. Connor objective reasonableness standard, a security officer''s use of force is evaluated against:',
  'What the officer subjectively believed was reasonable given their personal experience',
  'What a reasonable, trained officer in the same circumstances would have known and done at the moment of the decision',
  'The outcome of the incident — if no one was seriously hurt, the force was reasonable',
  'What the officer''s agency policy permits',
  'B',
  'Graham v. Connor (490 U.S. 386) establishes the objective reasonableness standard: the officer''s actions are judged against what a hypothetical reasonable, trained officer in the same circumstances would have known and done at the moment of the decision — not with hindsight, and not based on subjective belief alone.',
  true, 'Graham v. Connor Standard'
),
(
  'mod-16-q3', 'MOD-16', 3,
  'Three (3) situations justify the use of deadly force under OCGA 16-3-21. Which of the following is one of those three?',
  'To protect property valued over $10,000',
  'To prevent a suspect from fleeing after any criminal act',
  'To prevent the commission of a forcible felony',
  'When a supervisor orders deployment of lethal force',
  'C',
  'OCGA 16-3-21 authorizes lethal force in exactly three situations: (1) defense of self from great bodily harm or death, (2) defense of a third person from great bodily harm or death, and (3) to prevent the commission of a forcible felony. Property protection and supervisor orders are not among them.',
  false, 'Three Situations — Deadly Force'
),
(
  'mod-16-q4', 'MOD-16', 4,
  'What is the MINIMUM written examination passing score required by GBPDSA for annual certification?',
  '70%', '75%', '80%', '85%',
  'C',
  'GBPDSA requires a minimum passing score of 80% on the written examination and 80% on the live-fire range qualification. The Final Accreditation Examination on this platform requires 85% to reflect the Spartan Training standard — which exceeds the GBPDSA minimum.',
  false, 'Certification Standards'
),
(
  'mod-16-q5', 'MOD-16', 5,
  'A security officer who falsifies a training completion record to satisfy GBPDSA annual requirements is subject to:',
  'A verbal warning from their employer only',
  'An administrative fine from GBPDSA only',
  'Criminal fraud charges under OCGA and potential license revocation by GBPDSA',
  'No consequence if the falsification is never detected',
  'C',
  'Falsifying training records to satisfy GBPDSA requirements constitutes fraud under Georgia law and is grounds for both criminal prosecution and license revocation by the Board. The GBPDSA takes falsification of certification records among its most serious violations.',
  false, 'Training Record Integrity'
);
