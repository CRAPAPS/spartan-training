-- ============================================================
-- 019_uas_lessons_07_12.sql
-- Slide content for UAS-07 through UAS-12
-- MJM 2026 Unarmed Security Officer curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('UAS-07','UAS-08','UAS-09','UAS-10','UAS-11','UAS-12');

-- ── UAS-07: Use of Force Continuum — Unarmed Officers ────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-07', 'Use of Force Continuum — Unarmed Officers',
$slides_uas07$
[
  {
    "type": "slide",
    "heading": "The Use-of-Force Continuum: A Legal Framework, Not a Checklist",
    "body": "The use-of-force continuum describes escalating levels of force available to security officers in response to escalating levels of subject resistance. It is a legal framework — not a rigid checklist requiring you to exhaust each level before moving to the next. If a subject immediately presents a serious physical threat, you may respond with the appropriate level of force without cycling through every prior step. The key principle is proportionality: your force response must be proportional to the threat presented. The continuum for unarmed security officers includes: officer presence, verbal commands, soft empty-hand control (guiding, directing), hard empty-hand control (defensive blocks and holds), and calling law enforcement as the ultimate escalation. Lethal force — because you are unarmed — is not available on your continuum.",
    "keyPoints": [
      "Proportionality: force must match the threat level — never exceed what is necessary",
      "Not a rigid checklist: you may skip levels if the threat level demands it",
      "Level 1: Officer presence — uniform and visible authority often resolves situations",
      "Level 2: Verbal commands — clear, calm, specific directions",
      "Level 3: Soft empty-hand control — guiding and directing without pain compliance",
      "Level 4: Hard empty-hand control — defensive blocks and holds only",
      "Level 5: Call law enforcement — your escalation ceiling as an unarmed officer"
    ],
    "legalRef": "OCGA 17-4-60",
    "callout": { "type": "warning", "text": "The moment a threat stops, your use of force must stop. Continuing to apply force after a subject has ceased resistance is excessive force — a criminal offense and grounds for license revocation." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Imminent Threat Standard: When Physical Force Is Justified",
    "body": "Physical force by an unarmed security officer is legally justified only in response to an imminent threat — one that is immediate, credible, and cannot be avoided by withdrawal. 'Imminent' means the harm is about to happen, not that it might happen in the future. A person who verbally threatens you is not an imminent threat until they take action to carry out that threat. A person who physically attacks you or a person you are lawfully protecting presents an imminent threat. The objective standard — what a reasonable person in your position would perceive as an imminent threat — is the legal test courts apply. Your subjective fear alone is not sufficient. Document everything that made you perceive an imminent threat, and document it contemporaneously.",
    "keyPoints": [
      "Imminent: immediate, credible, unavoidable — not future or speculative",
      "Verbal threats alone do not constitute an imminent threat until action begins",
      "Physical attack on you or a person you are lawfully protecting = imminent threat",
      "Objective standard: what a reasonable person would perceive — not just your subjective fear",
      "Document the specific observations that made the threat imminent"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Permitted Physical Responses for Unarmed Security Officers",
    "body": "As an unarmed security officer, your permitted physical responses are strictly limited to defensive techniques. You may guide or physically direct a person when you have lawful authority and the person is not actively resisting. You may block a physical attack directed at you. You may use holds designed to prevent a subject from fleeing a lawful detention. You may not strike a person with your hands, fists, feet, or any improvised instrument. You may not apply chokeholds or neck restraints of any kind. You may not use techniques designed to inflict pain for compliance. If the situation requires more force than you are authorized to apply, disengage if safely possible and call law enforcement.",
    "keyPoints": [
      "Permitted: guiding, directing, defensive blocks, and escape-prevention holds",
      "Prohibited: strikes of any kind — fists, palms, kicks, elbows",
      "Prohibited: chokeholds, neck restraints, or any technique targeting the airway",
      "Prohibited: pain compliance techniques unless explicitly authorized in writing by your employer",
      "Situation exceeds your force authority: disengage safely and call law enforcement"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Post-Incident Reporting: Documenting Every Use of Force",
    "body": "Every use of force — even a hand placed on a person's arm to guide them — requires a written incident report completed within 30 minutes of the incident. The report must include: the date, time, and location; the identity or description of the subject; the specific actions that prompted the force response; the exact force technique applied; the result; whether law enforcement was called and their response; and whether anyone was injured. Your report must use objective language. The report is a legal document and will be reviewed by your supervisor, your employer's legal counsel, and potentially by attorneys and courts.",
    "keyPoints": [
      "Every use of force requires a written incident report within 30 minutes",
      "Include: date, time, location, subject description, specific actions, force technique used, result",
      "Objective language only: describe observable behavior, not characterizations",
      "Report reviewed by: supervisor, legal counsel, potentially attorneys and courts",
      "Failure to report a use of force is itself a disciplinary violation"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are working the lobby of a corporate office building. A visibly agitated person enters and demands to see a specific employee who is not in the building. When you tell them the employee is not available, they begin loudly threatening to 'take care of it themselves' and move toward the elevator bank. You step in front of them and place your hand on their chest to stop their movement. They push your hand away and continue shouting. You grab their arm with both hands.",
    "reflection": "Analyze each physical action you took. Was the hand on the chest justified under the imminent threat standard? What force level does that represent on the continuum? Was grabbing their arm with both hands proportional to the resistance they presented? At what point should law enforcement have been called? What would you document in your incident report?"
  },
  {
    "type": "checklist",
    "title": "Use-of-Force Post-Incident Checklist",
    "items": [
      { "label": "Medical Assessment", "description": "Immediately after any use of force, assess whether the subject or any bystander has been injured. Call EMS if there is any injury — even minor. Document the assessment." },
      { "label": "Law Enforcement Notification", "description": "Ensure law enforcement has been called or is on scene. Use-of-force incidents require a law enforcement report." },
      { "label": "Supervisor Notified", "description": "Notify your supervisor of the incident as soon as safely possible — do not wait until end of shift." },
      { "label": "Incident Report Completed", "description": "Complete a written incident report within 30 minutes. Use objective language describing exactly what you observed, what you did, and the result." },
      { "label": "Evidence Preserved", "description": "If cameras recorded the incident, notify your supervisor immediately so footage is preserved before it can be overwritten." }
    ]
  }
]
$slides_uas07$
);

-- ── UAS-08: De-escalation & Conflict Resolution ──────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-08', 'De-escalation & Conflict Resolution',
$slides_uas08$
[
  {
    "type": "slide",
    "heading": "Why De-escalation Is a Security Skill, Not a Soft Skill",
    "body": "De-escalation is the most important professional capability a security officer possesses. Every physical confrontation that does not occur because of effective de-escalation generates no incident report, no civil liability, no workers' compensation claim, no GBPDSA investigation, and no contract risk for your employer. De-escalation is not weakness — it is the highest-leverage tool in your professional toolkit. Officers who master verbal de-escalation are more valuable, more legally protected, and more promotable than officers who rely on physical authority.",
    "keyPoints": [
      "Every avoided confrontation = zero liability, zero reports, zero risk",
      "De-escalation is a professional skill requiring deliberate practice",
      "Most security incidents begin with a verbal exchange that could be resolved verbally",
      "Officers with strong de-escalation skills carry lower civil liability exposure",
      "Physical confrontation is a failure of earlier de-escalation opportunities in most cases"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The LEAPS Method: Listen, Empathize, Ask, Paraphrase, Summarize",
    "body": "The LEAPS method is a structured verbal de-escalation framework. Listen actively — give the person your full attention without interrupting; people who feel heard de-escalate faster. Empathize — acknowledge their frustration without validating unreasonable demands: 'I understand this is frustrating.' Ask open-ended questions that invite the person to explain themselves. Paraphrase what they have told you to demonstrate you were listening: 'So what I'm hearing is...' Summarize the situation and the options available to them. LEAPS does not require you to agree with the person or grant their demands. It requires you to communicate professionally.",
    "keyPoints": [
      "Listen: full attention, no interruption, people who feel heard de-escalate faster",
      "Empathize: acknowledge frustration without validating unreasonable demands",
      "Ask: open-ended questions invite explanation and reduce defensiveness",
      "Paraphrase: demonstrate active listening — 'What I am hearing is...'",
      "Summarize: explain what you can do — not just what you cannot do"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Proxemics: Using Space to Control Tension",
    "body": "Proxemics — the study of personal space — is a practical de-escalation tool. Most people have a personal space threshold of approximately 18–24 inches in social contexts and 3–4 feet in professional contexts. Moving inside that threshold during a confrontation signals threat and triggers a fight-or-flight response. Maintain a conversational distance of 6–8 feet when approaching an agitated person. Position yourself at a slight angle — not squared off directly in front of the person. A squared stance is universally read as confrontational. Angling your body slightly reduces threat signaling and protects your centerline. Never stand directly between an agitated person and their only exit.",
    "keyPoints": [
      "Personal space threshold: approximately 18 inches — inside this triggers fight-or-flight",
      "Approach agitated persons at 6–8 feet: reaction time plus non-threatening signal",
      "Slight body angle: less confrontational than a squared-off stance",
      "Protect your centerline by angling — reduces your target profile if violence occurs",
      "Never block a person's only exit — it escalates panic and legal exposure"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Pre-Attack Indicators: Recognizing When De-escalation Has Failed",
    "body": "Even skilled de-escalation fails sometimes. Recognizing pre-attack indicators allows you to reposition and call for backup before violence occurs. The most reliable indicators include: target glance (eyes move to where they intend to strike), thousand-yard stare (dissociation suggesting mental health crisis or commitment to violence), rhythmic weight shifting (preparing to launch), blading of the body (turning to protect their dominant side), clenched fists and jaw (physiological preparation for violence), and sudden calm after escalation (the decision has been made). When you observe these indicators, create distance, call law enforcement, and notify your supervisor immediately.",
    "keyPoints": [
      "Target glance: eyes briefly move to where they intend to strike — highly reliable indicator",
      "Thousand-yard stare: dissociation suggests crisis or committed intent",
      "Weight shifting and body blading: physical preparation for movement or attack",
      "Clenched fists/jaw: physiological arousal for violence",
      "Sudden calm after escalation: often means a decision to act has been made — reposition and call law enforcement"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. A man is arguing loudly in the lobby of an office building you secure. He is upset because he was denied entry to see a tenant who has a restraining order against him. He has been told three times to leave and has not left. He is now pacing, clenching his fists, and periodically glancing toward the elevator bank. Another visitor is in the lobby watching the situation unfold.",
    "reflection": "Identify the pre-attack indicators present. At what point should you have called law enforcement — before this moment, or is now still appropriate? What de-escalation approaches are still available and in what order do you attempt them? What is your priority if he moves toward the elevator, and what is your obligation to the other visitor in the lobby?"
  },
  {
    "type": "checklist",
    "title": "De-escalation Response Framework",
    "items": [
      { "label": "Tone and Volume Set", "description": "Lower your own voice to a calm, moderate pace before initiating contact. An agitated person's nervous system will mirror yours — model the state you want them to reach." },
      { "label": "Space Maintained", "description": "Maintain at least 6 feet of conversational distance. Do not allow the person to close that distance without repositioning. Never let your back be to a wall or corner." },
      { "label": "LEAPS Initiated", "description": "Listen and acknowledge before you direct. Do not lead with commands — lead with acknowledgment of the person's stated concern." },
      { "label": "Law Enforcement Notified", "description": "If de-escalation is not succeeding within 2–3 exchanges, notify dispatch and have law enforcement en route. You do not have to wait for violence to call for backup." },
      { "label": "Pre-Attack Indicators Monitored", "description": "Continuously monitor for pre-attack indicators throughout the encounter. If any appear, reposition immediately — do not wait to complete your de-escalation attempt." }
    ]
  }
]
$slides_uas08$
);

-- ── UAS-09: Observation, Patrol & Situational Awareness ──────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-09', 'Observation, Patrol & Situational Awareness',
$slides_uas09$
[
  {
    "type": "slide",
    "heading": "Patrol Methodologies: Fixed Post, Roving, and Vehicle",
    "body": "Security patrol is conducted in three primary forms. Fixed post: the officer remains at a designated location — a lobby desk, a gate, a checkpoint. This provides visible presence and access control but limits coverage area. The risk of fixed post is complacency. Roving patrol: the officer moves through an assigned area on a variable schedule. Variable routes are critical — a predictable patrol route can be exploited. Never patrol the same path at the same time twice in succession. Vehicle patrol: used for large properties, parking structures, or outdoor perimeters. Applies the same variable-route principle and requires maintaining situational awareness inside and outside the vehicle simultaneously.",
    "keyPoints": [
      "Fixed post: maximum access control, limited coverage, risk of complacency",
      "Roving patrol: broader coverage, must vary routes and timing to prevent exploitation",
      "Vehicle patrol: large perimeters, same variable-route requirement",
      "Variable routes: never patrol the same path at the same time twice in a row",
      "Complacency is the primary risk at fixed post — structure active observation routines"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The OODA Loop Applied to Security Patrol",
    "body": "The OODA loop — Observe, Orient, Decide, Act — is a decision-making framework that applies directly to security patrol. Observe: actively scan your environment for anomalies — things that are out of place compared to baseline. Orient: apply your training and experience to interpret what you observe. Decide: select a response from your available options. Act: execute the response. The faster you move through the OODA loop, the more initiative you maintain in a developing situation. Patrol officers who develop strong observational habits cycle through OODA faster and see threats earlier, when more options are still available.",
    "keyPoints": [
      "Observe: active environmental scanning, looking for deviations from baseline",
      "Orient: apply training and experience to interpret observations",
      "Decide: select the best available response",
      "Act: execute promptly — hesitation loses initiative",
      "Faster OODA cycling = earlier threat recognition = more response options"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Baseline and Anomaly Recognition",
    "body": "Every environment you secure has a baseline — the normal pattern of activity at a specific time of day and day of week. Anomaly recognition is the skill of identifying deviations from that baseline: a person standing still in a moving crowd, a vehicle parked in an unusual location and occupied for an extended period, a door that is normally locked standing open, a person dressed inconsistently with the environment. Every anomaly is a question that requires an answer. Most anomalies have innocent explanations. But the anomalies that were never investigated are the ones that appear in incident reports afterward.",
    "keyPoints": [
      "Baseline: the normal activity pattern for your specific environment at your specific time",
      "Anomaly: any deviation from baseline — most are innocent but all require acknowledgment",
      "Common anomalies: stationary person in a mobile crowd, unusual vehicle positioning, open locked doors",
      "Investigate anomalies with low-profile observation before direct approach when possible",
      "Document anomalies in your patrol log even when they resolve innocently"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Patrol Log Standards: Documenting What You Observe",
    "body": "The patrol log is your contemporaneous record of what you observed, when you observed it, where you were, and what you did about it. A patrol log written during or immediately after each patrol circuit is legally valuable. A patrol log written at the end of a shift from memory is legally suspect. Entries must be objective and specific: 'At 1423 hours, observed vehicle GA plate [XXX-XXXX] parked in fire lane at Building C entrance — driver absent — notified dispatch' rather than 'saw a car blocking the fire lane.' The log must be dated, timed to the nearest minute, and signed. Do not alter entries — if you make an error, draw a single line through it, initial it, and write the correction.",
    "keyPoints": [
      "Contemporaneous log: written during or immediately after each patrol circuit — not at end of shift",
      "Objective and specific: exact time, exact location, exact description, exact action taken",
      "Legal weight: contemporaneous logs are more credible than memory-reconstructed accounts",
      "No alterations: single line through errors, initial and date, write correction adjacent",
      "Sign every log entry — unsigned entries have no legal authentication"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are conducting a roving patrol of a commercial office park at 0200 hours. You have patrolled the same clockwise loop three times in a row. On your fourth loop, you notice a vehicle you have not seen before parked in a shadowed area near the service entrance to the largest building in the park. The vehicle's engine is off but you observe the faint glow of a phone screen inside the vehicle.",
    "reflection": "What anomalies are present in this scenario? What baseline deviations triggered your attention? What is your next action — and what is your order of operations before approaching the vehicle? Is this a law enforcement matter or a security matter at this stage? What do you document and when?"
  },
  {
    "type": "checklist",
    "title": "Patrol Discipline Checklist",
    "items": [
      { "label": "Route Varied", "description": "Confirm your patrol route for this circuit differs from your previous circuit in at least one element — starting point, direction of travel, or timing." },
      { "label": "Baseline Established", "description": "Before your first patrol circuit, take 5 minutes to establish the baseline: who is present, where vehicles are parked, which doors are open or closed." },
      { "label": "Anomalies Logged", "description": "Log every anomaly observed during patrol — even those that resolve innocently. The log demonstrates active observation." },
      { "label": "Log Current", "description": "Confirm your patrol log entries are current within 15 minutes of each observation. Do not accumulate entries for end-of-shift documentation." },
      { "label": "Dispatch Informed", "description": "Notify dispatch at the start and end of each patrol circuit and any time you investigate an anomaly. Radio silence during patrol is a safety risk." }
    ]
  }
]
$slides_uas09$
);

-- ── UAS-10: Access Control & Perimeter Security ───────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-10', 'Access Control & Perimeter Security',
$slides_uas10$
[
  {
    "type": "slide",
    "heading": "Layered Perimeter Defense: The Security Officer's Framework",
    "body": "Effective access control is built on layered perimeter defense — concentric rings of security that force an unauthorized person to defeat multiple barriers rather than a single checkpoint. The outer perimeter is the property boundary: fencing, vehicle barriers, and no-trespassing signage. The inner perimeter is the building envelope: doors, windows, loading docks, and rooftop access points. The interior access control layer controls movement within the facility: badge readers, visitor escort requirements, and restricted area designations. Understanding how they interact — and how a breach in one layer affects the others — is essential to performing your role effectively at each post.",
    "keyPoints": [
      "Outer perimeter: property boundary — fencing, vehicle barriers, no-trespassing signage",
      "Inner perimeter: building envelope — doors, windows, loading docks, rooftop",
      "Interior layer: badge readers, escort requirements, restricted zone enforcement",
      "Each layer must be assumed compromised when an outer layer is breached",
      "Your post assignment may cover one or all three layers — know which and how they interact"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Credential Verification Procedures",
    "body": "Access credential verification fails most often because it is performed inconsistently. Consistent verification means checking every credential every time — not just for unfamiliar faces, but for every person, including people you recognize. The value of the control is destroyed the moment exceptions are made for convenience. When verifying a credential, confirm: (1) the credential is current and not expired; (2) the photo matches the bearer; (3) the access level on the credential authorizes the area the person is attempting to enter; and (4) the credential has not been reported lost or stolen. If any check fails, the person does not enter. You direct them to the appropriate point of contact for resolution.",
    "keyPoints": [
      "Verify every credential every time — no exceptions for familiar faces",
      "Check: current status, photo match, authorized access level, not reported lost or stolen",
      "Any failed check = no entry, redirect to appropriate point of contact",
      "You do not have authority to grant exceptions to the access control policy",
      "Document every access denial: time, person description, reason for denial"
    ],
    "legalRef": "OCGA 16-7-21 (trespass — your authority to enforce no-entry)",
    "callout": { "type": "warning", "text": "Allowing a person to enter because you recognize their face is a policy violation and a personal liability risk. Recognition is not a substitute for credential verification." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Tailgating & Piggybacking: The Access Control Bypass",
    "body": "Tailgating is the act of following an authorized person through a controlled access point without presenting credentials. Piggybacking is the same act with the authorized person's knowledge and consent. Both are access control failures your post is designed to prevent. Address tailgating by positioning yourself at the access control point to require everyone to badge or present credentials independently before passing. Address piggybacking by reminding employees that holding doors for uncredentialed persons creates liability for them. When you observe a tailgating attempt, address it immediately, verify credentials or deny entry, and document the incident.",
    "keyPoints": [
      "Tailgating: following through a controlled door without credentials — unauthorized",
      "Piggybacking: same act with the badge holder's consent — still a policy violation",
      "Prevention: require independent credential presentation for every person",
      "Address immediately: stop the person, verify credentials or deny entry, document",
      "Employees holding doors for uncredentialed persons creates personal liability"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Key and Badge Accountability",
    "body": "Physical keys and access badges are the tangible manifestation of your access control system. A key or badge that is unaccounted for is a potential access bypass that you cannot detect or monitor. Your post orders should include a key and badge accountability log: every key and badge issued should be logged out with the recipient's name, the time of issuance, and the expected return time. Every key and badge returned should be logged in with confirmation that the item is accounted for and undamaged. Lost or stolen credentials must be immediately reported to your supervisor so the credential can be deactivated. Do not wait until the end of a shift to report a missing credential.",
    "keyPoints": [
      "Key/badge log: log out with name and time, log in with confirmation — every transaction",
      "Unaccounted credentials = unmonitored access bypass — treat as a security incident",
      "Report lost or stolen credentials immediately — not at end of shift",
      "Deactivate electronic badges the moment loss is confirmed",
      "Document the gap: from last confirmed possession to report of loss"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are staffing a lobby access control desk at a corporate headquarters during a busy morning arrival. A well-dressed woman approaches your desk, smiles, and says 'Good morning — I am here for the 9 AM board meeting.' She does not present a credential and you do not have her on your visitor list. As you are processing her, four employees swipe through the turnstile in quick succession. You notice one of them did not badge — they simply followed closely behind the person ahead of them.",
    "reflection": "Walk through your response to each situation simultaneously. How do you handle the unannounced visitor without creating a scene that embarrasses the organization? What is your process to verify her authorization? How do you address the tailgating incident without abandoning your desk? What do you document, and when?"
  },
  {
    "type": "checklist",
    "title": "Access Control Post Checklist",
    "items": [
      { "label": "Visitor List Current", "description": "Before your shift begins, obtain the current day's expected visitor list and confirm the process for handling visitors not on the list." },
      { "label": "Credential Verification Equipment Operational", "description": "Confirm badge readers, credential scanners, and access control software are operational at the start of your shift. Report failures immediately." },
      { "label": "Key and Badge Inventory Complete", "description": "Count and document all keys and badges in your control at the start of your shift. Any discrepancy from the previous shift's log must be reported immediately." },
      { "label": "Tailgating Position Set", "description": "Position yourself so you have a clear line of sight to the access control point and can observe each person presenting credentials independently." },
      { "label": "Denial Procedure Ready", "description": "Know the process for denying entry and the appropriate point of contact before you encounter a denial situation. A well-prepared denial is professional and low-conflict." }
    ]
  }
]
$slides_uas10$
);

-- ── UAS-11: Report Writing & Documentation Standards ─────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-11', 'Report Writing & Documentation Standards',
$slides_uas11$
[
  {
    "type": "slide",
    "heading": "The Legal Weight of a Security Incident Report",
    "body": "A security incident report is a legal document from the moment it is written. It may be subpoenaed in civil litigation, used in criminal proceedings, reviewed by legal counsel to assess liability, and read by a jury. Everything in that report — every fact, every description, every timeline — will be tested against your memory in a deposition and your employer's records in discovery. The difference between a report that protects you and one that creates liability is the difference between objective, contemporaneous documentation and vague, reconstructed accounts. Write reports as if the opposing party's attorney will read every sentence. Because eventually, they may.",
    "keyPoints": [
      "Security incident reports are legal documents subject to subpoena and discovery",
      "Contemporaneous: written during or immediately after the incident carries far more legal weight",
      "Objective: describe what you observed, not what you concluded or assumed",
      "Complete: missing information becomes 'the officer did not know' in a deposition",
      "Accurate: a single factual error taints the credibility of the entire report"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Report Structure: The Five Ws and How",
    "body": "Every security incident report must answer six questions: Who was involved (names, descriptions, badge numbers, witness identities)? What happened (the specific incident, actions taken, and outcome)? When did it occur (date, time to the nearest minute, duration)? Where did it occur (precise location — not 'the parking lot' but 'the north surface parking lot, row C, near the access gate on Building 3')? Why did the situation arise (the precipitating event or condition you observed)? How was it resolved (law enforcement called, person departed voluntarily, medical response, etc.)? A report that answers all six questions completely withstands scrutiny. A report missing any element creates gaps that opposing counsel will exploit.",
    "keyPoints": [
      "Who: all persons involved — names, descriptions, badge numbers, witness identities",
      "What: the incident, actions taken, and outcome — specific and sequential",
      "When: date and time to the nearest minute, duration of the incident",
      "Where: precise location — building number, floor, area designation",
      "Why: the precipitating event or condition that initiated your response",
      "How: resolution — law enforcement, voluntary compliance, medical response, or no resolution"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Objective vs. Subjective Language: The Critical Distinction",
    "body": "Objective language describes observable facts: what you saw, heard, smelled, or directly experienced. Subjective language describes your interpretation, feelings, or conclusions about what you observed. In a security report, only objective language belongs. 'The subject appeared intoxicated' is subjective. 'The subject's speech was slurred, his gait was unsteady, and there was a strong odor of alcohol on his breath' is objective — it gives a reader the specific observations from which they can draw their own conclusion. Your subjective conclusions will be challenged in court. Your objective observations will be credited. Describe. Do not evaluate.",
    "keyPoints": [
      "Objective: what you directly observed — saw, heard, smelled, experienced",
      "Subjective: your interpretation or conclusion — 'appeared intoxicated,' 'seemed threatening'",
      "Only objective language belongs in a security report",
      "List the observable facts that support your conclusion — let the reader draw the conclusion",
      "Your subjective language will be challenged in court; your objective observations will be credited"
    ],
    "callout": { "type": "info", "text": "Instead of: 'The subject was acting suspicious.' Write: 'The subject stood at the east entrance for 14 minutes without entering, repeatedly glanced toward the lobby interior, and departed when approached.' The first tells a reader your conclusion. The second lets them reach the same conclusion from the facts." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Report Integrity: No Alterations, No Additions",
    "body": "A security incident report must be completed, reviewed, and submitted in its original form. Do not add information to a report after it has been submitted. Do not alter entries — if you made an error, draw a single line through it, initial it, date it, and write the correction adjacent to the error. Never use correction fluid on a report. If additional information becomes available after submission, write a supplemental report with a new timestamp — do not revise the original. Altered reports are discovered in discovery, and when they are, they suggest to a jury that the writer knew the original was problematic and tried to change it.",
    "keyPoints": [
      "No alterations: single line through errors, initial and date, write correction adjacent",
      "No correction fluid — physical or electronic",
      "Post-submission additions: write a supplemental report, do not revise the original",
      "Electronic reports: audit trail must remain intact — no deletions without logged record",
      "Altered reports discovered in discovery suggest consciousness of guilt to a jury"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Last Tuesday, you responded to a verbal altercation in the parking structure between two employees. You filed your incident report at end-of-shift from memory. Today, your supervisor tells you that one of the employees has filed an HR complaint and that HR is requesting your report. You re-read your report and realize you recorded the time of the incident as 1615 when the access control log shows you badged through the parking structure gate at 1623. You also realize you wrote 'the subject appeared threatening' without describing what you observed.",
    "reflection": "Can you correct the time error in your original report? What is the correct procedure? How should you address the vague language — and can you supplement the report with specific observations you remember now? What does this scenario teach about the importance of contemporaneous reporting?"
  },
  {
    "type": "checklist",
    "title": "Report Writing Quality Control",
    "items": [
      { "label": "Five Ws and How Complete", "description": "Before submitting any report, confirm it answers all six questions: who, what, when, where, why, and how. A report missing any element is incomplete." },
      { "label": "Objective Language Only", "description": "Read your report and identify every word that describes a conclusion rather than an observation. Replace each with the specific observation that led you to that conclusion." },
      { "label": "Timestamps Verified", "description": "Confirm all times in your report are consistent with access control logs, camera timestamps, and dispatch records. Discrepancies create liability in litigation." },
      { "label": "No Alterations Made", "description": "Confirm all corrections use a single strikethrough, initials, and date — no corrections using deletion or white-out." },
      { "label": "Submitted Within Time Standard", "description": "Confirm the report was submitted within the timeframe required by your employer's policy — typically 30 minutes to 2 hours after the incident, depending on severity." }
    ]
  }
]
$slides_uas11$
);

-- ── UAS-12: Emergency Procedures — Fire, Medical & Evacuation ─────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-12', 'Emergency Procedures — Fire, Medical & Evacuation',
$slides_uas12$
[
  {
    "type": "slide",
    "heading": "The Security Officer's Role in Emergency Response",
    "body": "In any emergency, the security officer is the first professional on scene. This does not mean the security officer is the incident commander — it means the security officer initiates the response chain while professional emergency services are en route. Your role is specific and limited: activate the appropriate alarm or notification system, call 911, begin evacuation of your assigned area, render only the first aid you are trained to deliver, preserve the scene, and meet emergency responders at the entry point with location information. You are not the firefighter and not the paramedic. You are the person who starts the chain, clears the path, and gets responders to the right place.",
    "keyPoints": [
      "First on scene = initiates the response chain — not the incident commander",
      "Core role: activate notification, call 911, begin evacuation, render basic first aid if trained",
      "Preserve the scene for professional responders",
      "Meet emergency responders at the entry point with location and nature of emergency",
      "Attempting actions beyond your training delays professional response and creates liability"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Fire Response: R-A-C-E",
    "body": "The RACE protocol is the standard fire response sequence for building safety personnel. Rescue: remove persons in immediate danger who cannot self-evacuate. Alert: activate the building fire alarm and call 911. Confine: close doors to contain the fire — a closed door can reduce fire spread significantly and buys critical time for evacuation. Extinguish or Evacuate: use a fire extinguisher only if the fire is small, contained, and you have a clear evacuation path behind you. If the fire is not immediately controllable, evacuate. The decision to use a fire extinguisher must be made in seconds. Attempting to fight a fire beyond a single-extinguisher response is how security officers become fatalities.",
    "keyPoints": [
      "R — Rescue: remove persons in immediate danger who cannot self-evacuate",
      "A — Alert: activate fire alarm and call 911",
      "C — Confine: close all doors to slow fire spread",
      "E — Extinguish: only if fire is small, contained, and you have a clear exit behind you",
      "E — Evacuate: if any doubt about extinguishing — evacuate without hesitation"
    ],
    "callout": { "type": "warning", "text": "Never let a fire get between you and your exit while attempting to use a fire extinguisher. An extinguisher buys approximately 30 seconds of suppression. If the fire is not out in that window, evacuate." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Medical Emergency Response: Your Role Before EMS Arrives",
    "body": "When you encounter a medical emergency, your priorities in order are: call 911 immediately, retrieve the AED if one is accessible, render only the first aid you are trained to provide, and clear bystanders from the area to give the subject space and allow EMS access. Do not move a person who may have a spinal injury unless they are in immediate life-threatening danger from a secondary hazard. If the subject is unconscious and not breathing normally, begin CPR if you are trained — call 911 first, then start compressions. Survival rates from cardiac arrest drop approximately 10% for every minute without defibrillation. Know every AED location in your facility before an emergency occurs.",
    "keyPoints": [
      "Call 911 first — before any other action in a medical emergency",
      "Retrieve the AED: know every AED location in your facility before an emergency occurs",
      "Render only the first aid you are trained and certified to provide",
      "Do not move potential spinal injury victims unless a secondary life-threatening hazard is present",
      "Cardiac arrest: 10% survival drop per minute without defibrillation — AED retrieval is time-critical"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Evacuation Procedures: Coordination and Accountability",
    "body": "A building evacuation is only successful if every person in the building reaches the designated muster point and is accounted for. Your role in an evacuation may include: directing persons to the nearest exit, clearing stairwells and corridors as you move, assisting mobility-impaired persons to designated areas of rescue assistance (not physically carrying them down stairwells), accounting for persons in your assigned zone at the muster point, and communicating zone status to the incident commander or dispatch. The areas of rescue assistance — designated spaces on each floor where mobility-impaired persons wait for fire department rescue — must be identified in your post orders before an emergency occurs.",
    "keyPoints": [
      "Evacuation success = every person at the muster point and accounted for",
      "Direct to exits, clear stairwells, assist mobility-impaired to areas of rescue assistance",
      "Areas of rescue assistance: designated floor spaces where fire department rescues mobility-impaired persons",
      "Do not carry mobility-impaired persons down stairwells — take them to area of rescue assistance",
      "Report zone status to incident commander: how many evacuated, any unaccounted for"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are on post at a 6-story office building. At 1435 hours, you smell smoke coming from the third floor stairwell. You open the stairwell door and observe smoke at the ceiling level — no visible flames. An employee on the third floor appears confused about what to do. On the second floor, you know there is an employee who uses a motorized wheelchair.",
    "reflection": "Walk through your RACE sequence for this situation. Who do you call first and what do you say? What do you do with the confused employee on the third floor? What is your obligation to the wheelchair user on the second floor, and what specifically should you do — and not do? When emergency responders arrive, what information do you give them first?"
  },
  {
    "type": "checklist",
    "title": "Emergency Preparedness Verification Checklist",
    "items": [
      { "label": "Emergency Numbers Posted", "description": "Confirm 911, your facility's emergency line, and key tenant contacts are posted at your post and memorized. In an emergency you do not have time to search for numbers." },
      { "label": "AED Locations Memorized", "description": "Before each shift, confirm you know the location of every AED in your assigned facility. Test your memory — do not check your notes to answer this." },
      { "label": "Muster Points Confirmed", "description": "Confirm the location of the muster point for each building section in your assigned area. Know which entrance emergency responders will use for each scenario." },
      { "label": "Areas of Rescue Assistance Known", "description": "Identify the designated areas of rescue assistance on each floor of your facility. Confirm any mobility-impaired regular occupants have a personal emergency evacuation plan on file." },
      { "label": "Fire Extinguisher Locations and Type", "description": "Identify every fire extinguisher in your patrol area and confirm the classification (ABC, CO2, etc.). Know which extinguisher type is appropriate for which fire class." }
    ]
  }
]
$slides_uas12$
);
