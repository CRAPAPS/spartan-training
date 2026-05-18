-- ============================================================
-- 018_uas_lessons_01_06.sql
-- Slide content for UAS-01 through UAS-06
-- MJM 2026 Unarmed Security Officer curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('UAS-01','UAS-02','UAS-03','UAS-04','UAS-05','UAS-06');

-- ── UAS-01: Role & Legal Authority of Unarmed Security Officers ───────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-01', 'Role & Legal Authority of Unarmed Security Officers',
$slides_uas01$
[
  {
    "type": "slide",
    "heading": "Who You Are: A Private Security Officer, Not a Police Officer",
    "body": "The single most important legal fact of your career begins here: you are a private security officer, not a peace officer. Georgia law draws a sharp line between the two. A peace officer — a sworn police officer, sheriff's deputy, or state trooper — derives authority from the state and can compel compliance, execute warrants, and make custodial arrests under broad legal authority. You derive your authority from the property owner or employer who hired you, and from the limited rights every Georgia citizen possesses. You can observe, report, access-control, and in narrow circumstances detain — nothing more. Misunderstanding this distinction is the most common source of criminal liability for security officers.",
    "keyPoints": [
      "Security officers are private citizens — no peace officer powers granted by licensure",
      "Your authority comes from the property owner and Georgia citizen rights — not the state",
      "You cannot compel compliance, execute warrants, or make arrests beyond citizen authority",
      "Your GBPDSA license authorizes you to work — it does not grant law enforcement powers",
      "Acting beyond your authority exposes you to criminal charges and civil liability"
    ],
    "legalRef": "OCGA Title 43, Chapter 38 | OCGA 17-4-60",
    "callout": { "type": "warning", "text": "Displaying a badge-style credential that implies law enforcement authority when you have none is a misdemeanor at minimum — and a felony under OCGA 16-10-23 if you claim to be a police officer." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "What You Can Lawfully Do: The Security Officer's Legal Toolkit",
    "body": "Your lawful authority as an unarmed security officer falls into four categories. First, observation: you may watch, document, and report any activity occurring in your assigned area. Second, access control: you may admit or deny entry to private property on behalf of the property owner — this is one of your most powerful tools and carries no more legal complexity than the property owner's own right to exclude. Third, public order maintenance: you may ask persons to comply with the property owner's rules, and if they refuse, request that they leave. Fourth, citizen detention: under OCGA 17-4-60, you may detain a person who has committed a felony in your presence, using only reasonable force, until law enforcement arrives. That is the complete list.",
    "keyPoints": [
      "Observation and reporting: your most-used tool, legally uncomplicated",
      "Access control: property owner's right to exclude — you enforce it on their behalf",
      "Rule compliance requests: ask, then request departure if refused — escalate to law enforcement",
      "Citizen detention (OCGA 17-4-60): felony committed in your presence only, minimum necessary force",
      "Searches, confiscation, and custodial arrest: law enforcement only"
    ],
    "legalRef": "OCGA 17-4-60 | OCGA 16-7-21",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Scope of Employment: Authority Bounded by Your Post",
    "body": "Your legal authority as a security officer is bounded by your post assignment. You have no authority to act as a security officer outside the scope of your assigned deployment. If you are posted at a commercial property and you witness an incident in an adjacent parking lot you are not assigned to, you are acting as a private citizen — your employer's liability coverage and your GBPDSA licensure do not extend to that action. Always operate within your assigned post. If you observe something outside your zone, report it to dispatch and let law enforcement handle it. Scope creep — physically inserting yourself into situations outside your post — is one of the most common sources of liability for security officers and their employers.",
    "keyPoints": [
      "Authority is bounded by your specific post assignment, not geography",
      "Off-post action = private citizen action: no employer liability coverage, no GBPDSA protection",
      "Witness something outside your post: report to dispatch, do not physically respond",
      "Scope creep creates personal criminal and civil exposure for you and employer liability",
      "Your post assignment is a legal boundary — treat it that way"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Civil Liability: When Security Officers Get Sued",
    "body": "Every use of force, every detention, and every search you conduct as a security officer carries civil liability exposure. Georgia recognizes claims against security officers for false imprisonment (detaining someone without legal authority), assault and battery (threatening or applying unauthorized force), and negligence (failing to perform your duties to the standard expected of a reasonable security professional). Your employer's insurance covers you only when you act within your training, your post assignment, and the law. The moment you exceed your authority — even with good intentions — you step outside your employer's coverage and stand personally liable. This is why knowing the law is not optional. It is your personal financial protection.",
    "keyPoints": [
      "False imprisonment: detaining anyone without lawful authority",
      "Assault/battery: threatening or applying unauthorized force during a security encounter",
      "Negligence: failure to perform duties to the reasonable security professional standard",
      "Employer coverage ends when you exceed your authority or training",
      "Personal liability is real: individuals can be sued independently of their employer"
    ],
    "legalRef": "OCGA Title 51 | OCGA 51-1-14 (false imprisonment)",
    "callout": { "type": "info", "text": "The legal standard for negligence in security work is the 'reasonably prudent security officer' standard — what would a properly trained, licensed security professional do in your situation? That is the benchmark a jury will apply." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are posted at the entrance of a commercial office building. A person enters the lobby, refuses to sign in, and states they have a right to be there to 'handle some business.' The property manager's standing order is that all visitors must sign in. The person becomes verbally aggressive when you ask them to sign in or leave. As you are watching this unfold, you see someone in the parking lot — outside your assigned post — appear to break into a vehicle.",
    "reflection": "What is your legal authority with the person in the lobby? What steps must you take in order before escalating? What is your obligation regarding the car break-in in the parking lot — are you required to intervene, and what happens legally if you do? Who decides at what point law enforcement is called, and when?"
  },
  {
    "type": "checklist",
    "title": "Daily Authority Boundary Checklist",
    "items": [
      { "label": "Post Assignment Confirmed", "description": "Before your shift begins, confirm the boundaries of your assigned post. Know exactly where your authority begins and ends geographically." },
      { "label": "Post Orders Reviewed", "description": "Re-read your post orders at the start of each shift. Post orders define the specific rules the property owner wants enforced — these are your lawful instructions." },
      { "label": "Law Enforcement Contact Ready", "description": "Know the non-emergency and emergency dispatch numbers for your jurisdiction. When a situation exceeds your authority, your first tool is your radio — not escalation." },
      { "label": "No Badge Confusion", "description": "Confirm that your credentials identify you as a 'Security Officer' or 'Private Security' — never as a police officer, deputy, or law enforcement officer." },
      { "label": "Use of Force Standard Refreshed", "description": "Force is a last resort, proportional to the threat, and must stop the moment the threat stops. Document every use of force within 30 minutes of the incident." }
    ]
  }
]
$slides_uas01$
);

-- ── UAS-02: GBPDSA Framework — OCGA Title 43, Chapter 38 ─────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-02', 'GBPDSA Framework — OCGA Title 43, Chapter 38',
$slides_uas02$
[
  {
    "type": "slide",
    "heading": "The Georgia Board: Your Licensing Authority",
    "body": "The Georgia Board of Private Detectives and Security Agencies (GBPDSA) is the sole regulatory authority for private security officers and private investigators in Georgia. It operates under the Secretary of State's Professional Licensing Boards Division and has authority to issue, deny, suspend, and permanently revoke licenses. The Board investigates complaints, audits training records, and imposes civil penalties. Working without a valid GBPDSA license as a compensated security officer is a criminal offense. A first offense is a misdemeanor; subsequent offenses are felonies under OCGA 43-38-18.",
    "keyPoints": [
      "GBPDSA is the sole licensing authority for security officers in Georgia — no county-level exceptions",
      "Board powers: issue, deny, suspend, revoke, investigate, audit, fine",
      "Unlicensed security work: misdemeanor first offense, felony on repeat (OCGA 43-38-18)",
      "License must be current on every day you perform compensated security duties",
      "License status is public record — clients and employers can verify online at any time"
    ],
    "legalRef": "OCGA 43-38-1 through 43-38-18 | GA Admin Code 509-1 et seq.",
    "callout": { "type": "warning", "text": "A license expired by even one day means you are unlicensed for every hour you work that day. There is no grace period under Georgia law." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The 24-Hour Training Mandate: GA Admin Code 509-3-.01",
    "body": "Georgia Admin Code 509-3-.01 requires a minimum of 24 hours of Board-approved instruction before an unarmed security officer may begin compensated employment. This is a legal prerequisite. The 24 hours must be documented and available for Board audit on demand. Your employer is also required to hold a current GBPDSA Agency License. If your employer is unlicensed, your individual license does not protect you. Before your first paid security assignment, confirm: (1) your individual license is current, (2) the agency holds a current agency license, and (3) your 24-hour training record is on file.",
    "keyPoints": [
      "24 hours of Board-approved instruction is a legal prerequisite — not a recommendation",
      "Training records must be documented and available to Board on demand",
      "Employer must hold a current GBPDSA Agency License",
      "Working for an unlicensed agency exposes you to enforcement action independent of your license",
      "Confirm all three conditions before your first paid shift"
    ],
    "legalRef": "GA Admin Code 509-3-.01 | OCGA 43-38-4",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "License Renewal, Continuing Education & Reciprocity",
    "body": "GBPDSA individual security officer licenses must be renewed annually. Renewal requires payment of the renewal fee and completion of any required continuing education hours. Licenses that lapse create a break in your lawful work authority — you cannot retroactively fix a lapsed license. Georgia does not have broad reciprocity with other states for security officer licensure. A license from another state does not authorize you to work as a paid security officer in Georgia. If you move to Georgia or accept a Georgia assignment, you must obtain a Georgia GBPDSA license before beginning work.",
    "keyPoints": [
      "Annual renewal: fee plus continuing education as required by current Board rules",
      "Lapsed license = unlicensed status: no retroactive fix available",
      "No broad interstate reciprocity: out-of-state license does not authorize Georgia security work",
      "Georgia assignment = Georgia license required regardless of where you are primarily licensed",
      "Check CE requirements at each renewal — Board rules can change annually"
    ],
    "legalRef": "OCGA 43-38-7 | GA Admin Code 509-1-.05",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Board Discipline: What Gets Licenses Revoked",
    "body": "The GBPDSA can discipline any licensee for conduct that violates the Board's professional standards, even without a criminal conviction. Grounds for disciplinary action include: conviction of a crime involving moral turpitude; willful misrepresentation on a license application; unauthorized disclosure of client or employer confidential information; engaging in dishonest, fraudulent, or deceptive conduct; violating any provision of OCGA Title 43, Chapter 38; and engaging in conduct that brings the profession into disrepute. Board disciplinary decisions are public record and appear permanently on your professional history.",
    "keyPoints": [
      "Discipline can occur without a criminal conviction — Board standards are independent of criminal law",
      "Moral turpitude conviction: automatic license review, likely suspension or revocation",
      "Application fraud: permanent bar from relicensure for a minimum of five years",
      "Confidentiality breach: civil liability plus Board discipline",
      "Board decisions are public record — visible to any prospective employer or client"
    ],
    "legalRef": "OCGA 43-38-11 | GA Admin Code 509-1-.01 et seq.",
    "callout": { "type": "info", "text": "Appeal path for Board decisions: Office of State Administrative Hearings (OSAH) under the Georgia Administrative Procedure Act (OCGA 50-13). Board decisions are not final until the OSAH appeal window closes." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You have been working for a security agency for three months. Your employer tells you not to worry about the agency license renewal — 'it is just paperwork' — and asks you to continue working your regular shifts while the renewal is pending. You check the GBPDSA website and confirm the agency's license expired 12 days ago. Your individual license is current.",
    "reflection": "What is your legal exposure if you continue working during the agency's lapsed license period? Does your current individual license protect you from enforcement action? What should you do? If you stop working, do you have any recourse against the employer for asking you to work unlicensed?"
  },
  {
    "type": "checklist",
    "title": "License Compliance Checklist",
    "items": [
      { "label": "Individual License Current", "description": "Verify your GBPDSA license is active and not within 30 days of expiration. Set a calendar reminder for renewal 45 days before your expiration date." },
      { "label": "Agency License Current", "description": "Confirm your employing agency's GBPDSA Agency License is current via the Board's public license lookup — do not rely solely on your employer's word." },
      { "label": "Training Record on File", "description": "Confirm your 24-hour training completion is in your personnel file and accessible to the Board on demand." },
      { "label": "CE Hours Tracked", "description": "If continuing education is required for your current renewal cycle, confirm you are on track to complete the required hours before your renewal deadline." },
      { "label": "No Out-of-State License Reliance", "description": "If you recently relocated to Georgia or are accepting a Georgia assignment, confirm you hold a Georgia GBPDSA license — not just a license from another state." }
    ]
  }
]
$slides_uas02$
);

-- ── UAS-03: Ethics & Professional Conduct ────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-03', 'Ethics & Professional Conduct',
$slides_uas03$
[
  {
    "type": "slide",
    "heading": "Integrity: The Non-Negotiable Foundation",
    "body": "Integrity in security work is not a soft concept — it is a legal and professional obligation. The GBPDSA Code of Conduct prohibits misrepresentation in any form: falsifying incident reports, lying to supervisors about what you observed, claiming you performed duties you did not perform, and misrepresenting your credentials or training. A security officer who fabricates an incident report has committed fraud. A security officer who lies to law enforcement during a joint incident response may face obstruction charges. Your written reports may be subpoenaed, read by attorneys, and introduced in court proceedings. Write what you saw, not what you assumed. Write what happened, not what you wish had happened.",
    "keyPoints": [
      "GBPDSA Code of Conduct prohibits all misrepresentation — in reports, conduct, and credentials",
      "Falsifying an incident report is fraud — a criminal offense independent of your licensure",
      "Lying to law enforcement during a joint response can constitute obstruction of justice",
      "Every report you write is a potential court document — write as if under oath",
      "Objective language only: what you saw, heard, and did — not assumptions or interpretations"
    ],
    "legalRef": "GBPDSA Code of Conduct | OCGA 43-38-11 | OCGA 16-10-20 (false statements)",
    "callout": { "type": "warning", "text": "A security officer who falsifies one report has tainted every report they have ever written. Opposing counsel will use that history to challenge every piece of evidence you have ever produced." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Confidentiality: What You See Stays Where It Belongs",
    "body": "As a security officer, you are trusted with information that clients and employers consider sensitive: access patterns, visitor identities, incident details, personnel matters, and facility vulnerabilities. This information is confidential in a legal sense. Unauthorized disclosure of client or employer confidential information is grounds for GBPDSA license revocation and potential civil liability. This obligation does not end when your shift ends or when you leave the employer. Social media posts about your work, conversations about what happened on your post, and sharing incident details with friends are all confidentiality violations — even when you do not use names. The standard is simple: if it happened at work, it stays at work.",
    "keyPoints": [
      "Confidentiality obligation: legal duty, not professional courtesy",
      "Covers access patterns, incidents, visitor identities, personnel matters, facility vulnerabilities",
      "Obligation survives the end of your shift and your employment",
      "Social media posts about work incidents are confidentiality violations even without names",
      "Breach: grounds for GBPDSA revocation plus civil liability for damages"
    ],
    "legalRef": "GBPDSA Code of Conduct | OCGA 43-38-11",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Impartiality & Non-Discrimination",
    "body": "Professional security requires that you apply the property owner's rules consistently to all persons, without regard to race, ethnicity, religion, national origin, sex, age, disability, or any other protected characteristic. Selectively enforcing rules — allowing some visitors to bypass sign-in while requiring others, targeting specific demographic groups for stops, or applying different standards based on appearance — is not only a violation of the GBPDSA Code of Conduct, it exposes the property owner and your employer to federal civil rights litigation under 42 U.S.C. § 1981 and Title II of the Civil Rights Act. When you apply the rules differently to different people, you become a legal liability to everyone who employs you.",
    "keyPoints": [
      "Rules must be applied consistently to all persons regardless of protected characteristics",
      "Selective enforcement based on race, ethnicity, religion, or appearance creates civil rights exposure",
      "42 U.S.C. § 1981 and Title II of the Civil Rights Act apply to private security conduct",
      "Document that rules were applied consistently — your logs protect you and your employer",
      "Observe a colleague engaging in discriminatory enforcement: you have a duty to report it"
    ],
    "legalRef": "42 U.S.C. § 1981 | Civil Rights Act of 1964, Title II | GBPDSA Code of Conduct",
    "callout": { "type": "info", "text": "Consistent enforcement is not just ethical — it is your legal protection. If you apply the same rule the same way to every person, you are insulated from discrimination claims." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Prohibited Conduct: Career-Ending Mistakes",
    "body": "The GBPDSA Code of Conduct identifies categories of prohibited conduct that result in immediate license suspension or permanent revocation: (1) sleeping on duty; (2) consuming alcohol or controlled substances while on duty or in uniform; (3) abandoning your post without authorization; (4) using excessive force; (5) accepting bribes or gratuities in exchange for overlooking violations; (6) misrepresenting yourself as a law enforcement officer; (7) using your position to conduct personal investigations; and (8) using your access to client facilities to commit theft. Any of these can result in criminal charges in addition to Board discipline. They are absolute prohibitions — not judgment calls.",
    "keyPoints": [
      "Sleeping on duty: Board discipline plus potential contract termination",
      "Alcohol or substances on duty/in uniform: criminal charges possible, certain Board action",
      "Post abandonment: discipline plus liability for any incident that occurs during absence",
      "Bribery/gratuities: felony under OCGA 16-10-2, permanent license revocation",
      "Using position for personal investigations or theft: criminal charges plus permanent bar"
    ],
    "legalRef": "OCGA 43-38-11 | OCGA 16-10-2 | GA Admin Code 509-1-.01",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are working a night shift at a corporate office complex. A mid-level manager from the tenant company approaches you and offers you $100 cash to 'look the other way' if a specific vehicle enters the parking garage after hours — the manager says it is a personal matter. Additionally, a friend texts you asking for details about an incident from yesterday's shift that they heard about through mutual contacts. You have the incident report on your phone.",
    "reflection": "What is the legal nature of the manager's request? What are the specific offenses involved in accepting the cash? What is the correct response? Regarding your friend's text — can you share the incident report, describe what happened verbally, or confirm whether an incident occurred at all? What is your confidentiality obligation here?"
  },
  {
    "type": "checklist",
    "title": "Ethics Self-Check — Start of Every Shift",
    "items": [
      { "label": "Fitness for Duty", "description": "Confirm you are free from alcohol, controlled substances, and any impairment that could affect your judgment or physical capacity." },
      { "label": "No Conflicts of Interest", "description": "Confirm you have no personal relationships with any expected visitors or persons of interest today that could compromise your impartiality. Disclose any conflicts to your supervisor before the shift begins." },
      { "label": "Uniform and Credentials Correct", "description": "Confirm your uniform and credentials identify you correctly as a Security Officer — not as law enforcement." },
      { "label": "Post Orders Acknowledged", "description": "Confirm you have read and understood today's post orders. If any instruction seems to require unlawful conduct, report it to your supervisor immediately — do not execute the unlawful instruction." },
      { "label": "Report Accuracy Commitment", "description": "Commit to documenting every incident with objective, accurate language. If you are uncertain about a fact, note the uncertainty — do not guess or fill gaps with assumptions." }
    ]
  }
]
$slides_uas03$
);

-- ── UAS-04: Criminal & Civil Law for Security Officers ───────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-04', 'Criminal & Civil Law for Security Officers',
$slides_uas04$
[
  {
    "type": "slide",
    "heading": "OCGA Title 16: The Criminal Code Security Officers Must Know",
    "body": "The Official Code of Georgia Annotated (OCGA) Title 16 governs all criminal offenses in Georgia. For security officers, the most operationally critical chapters are: Chapter 5 (offenses against persons — assault, battery, stalking, harassment), Chapter 7 (offenses against property — trespass, criminal damage), Chapter 8 (theft — relevant for retail and loss prevention assignments), Chapter 10 (offenses against public administration — false statements, obstruction, impersonation), and Chapter 11 (offenses against public order and privacy — disorderly conduct, loitering, eavesdropping). You need working familiarity with each of these because security incidents generate reports describing conduct that falls into these categories.",
    "keyPoints": [
      "Title 16, Chapter 5: assaults, batteries, stalking — common in security incident reports",
      "Title 16, Chapter 7: trespass and criminal damage — grounds for lawful removal",
      "Title 16, Chapter 8: theft — know the shoplifting statute if assigned to retail security",
      "Title 16, Chapter 10: false statements and impersonation — exposures for security officers",
      "Title 16, Chapter 11: disorderly conduct and loitering — common grounds for removal requests"
    ],
    "legalRef": "OCGA Title 16",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Misdemeanor vs. Felony: Why the Distinction Controls Your Authority",
    "body": "Georgia classifies crimes as misdemeanors or felonies. A standard misdemeanor carries a maximum of 12 months in jail and a $1,000 fine. A high and aggravated misdemeanor carries up to 12 months and a $5,000 fine. Felonies carry sentences set by the specific statute. As a security officer, the misdemeanor/felony distinction controls your citizen detention authority. Under OCGA 17-4-60, you may only detain a person who has committed a felony in your presence — you have no citizen detention authority for misdemeanors. Shoplifting below $500 in a single transaction is a misdemeanor. Shoplifting of $500 or more is a felony under OCGA 16-8-14. Detaining someone for a misdemeanor is false imprisonment.",
    "keyPoints": [
      "Misdemeanor: up to 12 months, $1,000 fine (or $5,000 for high and aggravated)",
      "Felony: sentence set by statute — typically 1 year minimum",
      "Citizen detention authority: FELONIES ONLY committed in your presence",
      "Misdemeanor shoplifting (under $500): NO citizen detention authority",
      "Felony shoplifting ($500 or more, single transaction, OCGA 16-8-14): citizen detention applies"
    ],
    "legalRef": "OCGA 17-4-60 | OCGA 16-8-14 | OCGA 17-10-3",
    "callout": { "type": "warning", "text": "Detaining a person for a misdemeanor without lawful authority is false imprisonment — a criminal offense regardless of whether the person actually committed the underlying misdemeanor." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Civil Liability: The Other Way a Security Incident Ends Careers",
    "body": "Beyond criminal exposure, every security encounter carries civil liability potential. The most common claims against security officers and their employers are: false imprisonment (unlawful detention without legal authority), assault and battery (threatening or applying unauthorized physical force), negligent hiring (employer failed to properly screen and train), negligent retention (employer kept an officer who posed known risks), and negligent security (failure to prevent a foreseeable harm that proper security would have prevented). In Georgia, civil claims require proof only by a preponderance of the evidence — more likely than not. You do not need to be convicted of a crime for a civil jury to find you liable and award damages.",
    "keyPoints": [
      "False imprisonment: the most common civil claim against security officers",
      "Assault/battery: threatening or applying unauthorized force — civil damages separate from criminal",
      "Negligent hiring/retention: employer liability for inadequate screening or known problem officers",
      "Negligent security: employer liability for failure to prevent foreseeable harm",
      "Civil standard: preponderance of evidence (51%) — much easier to meet than criminal standard"
    ],
    "legalRef": "OCGA Title 51 | OCGA 51-1-14 (false imprisonment) | OCGA 51-1-13 (assault/battery)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Merchant Protection Statute: OCGA 51-7-60",
    "body": "Georgia's merchant protection statute, OCGA 51-7-60, provides civil immunity to merchants and their agents — including security officers — for detaining a person when there are reasonable grounds to believe that person has committed shoplifting, provided the detention is in a reasonable manner and for a reasonable time. This statute provides a civil defense, not criminal arrest authority. It does not authorize you to search the person, remove merchandise forcibly, handcuff anyone, or hold the person beyond the time it takes law enforcement to arrive. 'Reasonable grounds' means specific, articulable observations — not a hunch. Exceed these parameters and the immunity evaporates.",
    "keyPoints": [
      "OCGA 51-7-60: civil immunity for merchant detention — not criminal arrest authority",
      "Requires reasonable grounds: specific observations, not a hunch",
      "Requires reasonable manner: verbal, proportional, no unnecessary force",
      "Requires reasonable time: until law enforcement arrives, not indefinitely",
      "Immunity evaporates immediately if you search, forcibly remove merchandise, or use excessive force"
    ],
    "legalRef": "OCGA 51-7-60 | OCGA 51-7-61",
    "callout": { "type": "info", "text": "OCGA 51-7-60 is a civil immunity statute — it protects you from civil false imprisonment claims if all conditions are met. It does not change your criminal law authority, which remains limited to OCGA 17-4-60 (felony in presence)." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are working loss prevention at a retail store. You observe on camera a person place three items worth a combined $340 inside their jacket and exit the store past all points of sale without paying. You approach the person in the parking lot, identify yourself as security, and ask them to return to the store. They refuse and attempt to walk to their vehicle. You grab their arm to prevent them from leaving.",
    "reflection": "Analyze the lawfulness of your detention. Was the amount below or above the felony shoplifting threshold? Which statute — if any — gives you civil immunity for the detention attempt? Did your use of physical force to prevent the person from leaving fall within the reasonable manner requirement? What should you have done instead when they refused to return?"
  },
  {
    "type": "checklist",
    "title": "Legal Classification Reference Card",
    "items": [
      { "label": "Felony Threshold Confirmed", "description": "Before detaining anyone for theft, confirm the value of merchandise involved. Shoplifting below $500 in a single transaction is a misdemeanor — no citizen detention authority applies." },
      { "label": "Observation Documented", "description": "Before any detention, confirm you have specific, articulable observations of the criminal conduct. Write these observations immediately after the incident." },
      { "label": "Force Proportionality Check", "description": "Any physical contact during a detention must be the minimum necessary to accomplish the lawful objective. Was force actually necessary, or could verbal direction have achieved the same result?" },
      { "label": "Law Enforcement Summoned", "description": "In any detention situation, law enforcement must be called immediately. Your detention authority lasts only until law enforcement arrives." },
      { "label": "Incident Report Completed", "description": "Complete a written incident report within 30 minutes of any detention, use of force, or significant security event." }
    ]
  }
]
$slides_uas04$
);

-- ── UAS-05: Laws of Arrest — Citizen Arrest Authority ────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-05', 'Laws of Arrest — Citizen Arrest Authority',
$slides_uas05$
[
  {
    "type": "slide",
    "heading": "OCGA 17-4-60: The Only Arrest Authority You Have",
    "body": "Georgia Code Section 17-4-60 grants every citizen — including private security officers — the authority to arrest a person who commits a felony in the arresting person's presence, or when the arresting person has reasonable grounds to believe a felony has been committed and that the person being arrested committed it. This is the entirety of your arrest authority. Not a misdemeanor — a felony. Not a reported felony you did not witness — one committed in your presence, or one you have reasonable grounds to believe was committed by the specific person you are detaining. Georgia's 2022 legislative reforms significantly narrowed citizen arrest authority in response to the Ahmaud Arbery case. Security officers must understand this statute precisely — errors in its application constitute false imprisonment.",
    "keyPoints": [
      "OCGA 17-4-60: citizen arrest limited to felonies committed in your presence",
      "Alternatively: reasonable grounds to believe a felony was committed by the specific person",
      "Misdemeanors: NO citizen arrest authority — removal request and law enforcement only",
      "2022 legislative narrowing: heightened scrutiny of citizen detentions after Arbery case",
      "Error in application = false imprisonment: a crime you can be charged with"
    ],
    "legalRef": "OCGA 17-4-60 | 2022 Ga. HB 479 (citizen's arrest reform)",
    "callout": { "type": "warning", "text": "The 2022 amendments eliminated broad claims of authority to detain based solely on property owner status. Your detention authority is now explicitly limited to felony crime situations. When in doubt, call law enforcement — do not detain." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The Felony-in-Presence Requirement: What It Actually Means",
    "body": "The phrase 'committed in the arresting person's presence' has a specific legal meaning. It does not mean you heard about it from a coworker. It does not mean you reviewed camera footage after the fact. It means you personally and directly observed the criminal act as it occurred. There is a secondary basis — 'reasonable grounds to believe' — but this is a high bar and involves specific, articulable facts pointing to a specific person. Courts have repeatedly found that a security officer's hunch, the subject's nervous behavior, or the fact that merchandise was missing are not sufficient 'reasonable grounds' for a citizen detention. If you cannot articulate exactly what you observed and why those observations pointed to a specific felony by a specific person, do not detain. Call law enforcement.",
    "keyPoints": [
      "'In your presence' = personally and directly observed as it occurred — not via camera review after the fact",
      "'Reasonable grounds to believe' = specific, articulable facts pointing to a specific person and felony",
      "Nervous behavior, missing merchandise, or staff suspicion alone = insufficient grounds",
      "When in doubt: call law enforcement rather than detain",
      "Your articulation of grounds will be tested in court — if you cannot say it clearly, you did not have grounds"
    ],
    "legalRef": "OCGA 17-4-60",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The Mechanics of a Lawful Citizen Detention",
    "body": "If you have lawful grounds for a citizen detention under OCGA 17-4-60, the mechanics are tightly controlled. Use the minimum force necessary to accomplish the detention — your goal is to prevent the person from fleeing, not to punish them. Identify yourself as a security officer. Tell the person they are being detained pending law enforcement arrival. Do not interrogate them. Call law enforcement immediately upon beginning the detention — do not wait to see if the person cooperates. Do not search the person. Do not restrain them beyond what is necessary to prevent flight. Release them to law enforcement. Document everything within 30 minutes of the incident.",
    "keyPoints": [
      "Minimum necessary force only — the goal is preventing flight, not punishment",
      "Identify yourself as security; state the person is detained pending law enforcement arrival",
      "Call law enforcement immediately — before you attempt to question the person",
      "Do not search, interrogate, transport, or attempt to process the detained person",
      "Release to law enforcement — your involvement ends at that handoff"
    ],
    "legalRef": "OCGA 17-4-60",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "False Imprisonment: When Your Detention Becomes a Crime",
    "body": "False imprisonment under OCGA 51-1-14 occurs when you detain a person without lawful authority, regardless of your intent or whether the person actually committed the underlying offense. If you detain someone for a misdemeanor, detain someone without witnessing the alleged offense, use excessive force to prevent departure, or hold someone after you no longer have legal grounds — you have committed false imprisonment. False imprisonment is both a civil tort and, in aggravated circumstances, a criminal offense under Georgia law. A person wrongly detained can sue you personally and your employer for damages. There is no intent defense: you either had lawful authority to detain or you did not.",
    "keyPoints": [
      "False imprisonment: detention without lawful authority, regardless of intent",
      "Civil tort: personal and employer liability for damages including emotional distress",
      "Criminal offense in aggravated circumstances: misdemeanor to felony depending on conduct",
      "Defenses require you fully met OCGA 17-4-60 OR OCGA 51-7-60 (merchant) — both conditions completely",
      "No intent defense: good intentions do not eliminate false imprisonment liability"
    ],
    "legalRef": "OCGA 51-1-14 | OCGA 16-5-41 (criminal false imprisonment)",
    "callout": { "type": "warning", "text": "Being right about the underlying crime does not protect you from false imprisonment liability. You must also have had lawful authority — under the correct statute — for the specific detention method you used." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are working security at a large grocery store. A coworker radios you and says she watched a man on camera put a bottle of wine worth $28 into his coat pocket and walk out without paying. She did not follow up further and you did not observe the incident personally. You intercept the man in the parking lot, identify yourself, and physically block him from entering his vehicle while you call police.",
    "reflection": "Do you have citizen arrest authority for this incident? Identify the specific legal problems with the basis for your detention and your method. If the man pushes past you and drives away, can you chase him? What should you have done when your coworker radioed you? Who should have made the decision to detain, and what authority did they need?"
  },
  {
    "type": "checklist",
    "title": "Pre-Detention Authority Checklist",
    "items": [
      { "label": "Personal Observation Confirmed", "description": "Confirm you personally and directly observed the alleged criminal conduct as it occurred — not via camera review after the fact, and not based on another person's report." },
      { "label": "Felony Classification Verified", "description": "Confirm the offense is a felony under Georgia law. If you cannot identify the specific felony statute, do not detain — call law enforcement and provide your observations." },
      { "label": "Specific Person Identified", "description": "Confirm your detention is directed at the specific person you observed committing the offense — not a group, not someone who fits a description." },
      { "label": "Minimum Force Plan Ready", "description": "Before initiating contact, plan your approach: verbal direction first, physical restraint only if the person actively attempts to flee after a lawful verbal detention command." },
      { "label": "Law Enforcement Called", "description": "Do not begin a detention until you have called or are actively calling law enforcement. Your detention authority exists only to preserve the situation until police arrive." }
    ]
  }
]
$slides_uas05$
);

-- ── UAS-06: Search & Seizure Fundamentals ────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-06', 'Search & Seizure Fundamentals',
$slides_uas06$
[
  {
    "type": "slide",
    "heading": "The Fourth Amendment and Private Security Officers",
    "body": "The Fourth Amendment to the U.S. Constitution prohibits unreasonable searches and seizures — but it prohibits them only by government actors. Police officers, federal agents, and government employees conducting searches must comply with the Fourth Amendment. Private security officers, acting on behalf of private employers on private property, are generally not bound by the Fourth Amendment. Evidence obtained through an unconstitutional police search may be excluded from court under the exclusionary rule. Evidence obtained through a private security officer's search is generally not excluded on Fourth Amendment grounds. However, this does not mean you have unlimited search authority. Your authority to search is constrained by consent, employer policy, and Georgia civil and criminal law.",
    "keyPoints": [
      "Fourth Amendment binds government actors only — not private security officers in most circumstances",
      "Improperly obtained evidence by a private security officer is not automatically excluded from court",
      "Your search authority is constrained by consent, employer policy, and Georgia law",
      "If you act jointly with police or at police direction, Fourth Amendment may apply to your actions",
      "Exceeding search authority creates civil liability even without a constitutional violation"
    ],
    "legalRef": "U.S. Const. amend. IV | Burdeau v. McDowell (1921) | OCGA Title 51",
    "callout": { "type": "info", "text": "Exception: if you search at the direction of or in conjunction with law enforcement, courts may apply the Fourth Amendment to your actions. Never conduct a search at a police officer's direction unless your employer's legal counsel has authorized this practice." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Consensual Searches: The Only Search You Should Conduct",
    "body": "The safest and most legally defensible search a security officer can conduct is a consensual search — one where the subject voluntarily and without coercion agrees to allow you to search their person, bag, or vehicle. Consent must be genuine: it cannot be obtained by implying you have police authority, by blocking the person's exit, or by telling them they have no choice. You must make clear that consent is voluntary and that the person may refuse. Many facilities implement 'consent as a condition of entry' policies where persons consent to inspection upon entering the property. If your employer uses such a policy, it must be clearly posted and communicated before entry, not after. Consent obtained after entry, or consent obtained through coercion, is not valid.",
    "keyPoints": [
      "Consensual search: subject voluntarily agrees without coercion — the only search you should conduct",
      "Consent cannot be obtained by implying law enforcement authority or blocking exit",
      "Must inform the person that consent is voluntary and refusal is an option",
      "Consent-as-condition-of-entry policies: must be posted and communicated BEFORE entry",
      "Consent obtained after entry or through coercion is legally invalid"
    ],
    "legalRef": "OCGA Title 51",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "What You Cannot Search: Hard Limits for Security Officers",
    "body": "The following searches are absolutely outside your authority as a security officer, regardless of your employer's instructions or the subject's suspected conduct: (1) pat-down searches of persons without their consent, even if you suspect they are concealing a weapon; (2) searches of a vehicle's interior without the owner's consent or law enforcement authority; (3) searches of a person's phone, wallet, or electronic devices; (4) strip searches or searches requiring removal of clothing; and (5) searches of areas outside your post assignment. If you need one of these searches to occur, call law enforcement. Conducting any of these searches without the proper authority is a criminal offense under Georgia law, regardless of what you find.",
    "keyPoints": [
      "Pat-down without consent: unauthorized — call law enforcement",
      "Vehicle interior search without consent: unauthorized — call law enforcement",
      "Phone or electronic device search: unauthorized — never",
      "Clothing removal or strip search: unauthorized — criminal exposure for you",
      "Off-post area search: outside your authority regardless of what you observe"
    ],
    "legalRef": "OCGA 16-9-93 (computer trespass) | OCGA 51-1-13",
    "callout": { "type": "warning", "text": "Searching someone's phone or electronic device without their consent and without law enforcement authority is a crime in Georgia under OCGA 16-9-93, regardless of what you find on the device." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Evidence Preservation: What to Do Until Law Enforcement Arrives",
    "body": "When you discover evidence of a crime on your post — a weapon, controlled substance, stolen merchandise, or any item relevant to a criminal investigation — your role is preservation, not collection. Do not touch the item. Do not move it. Do not pick it up to 'secure' it. Do not allow others to access the area. Your job is to protect the scene until law enforcement arrives. If you handle the evidence, you compromise its chain of custody, potentially making it inadmissible. Mark the location, cordon off the area if possible, document what you observed in your log with the time and precise location, and wait. Your job ends when law enforcement takes over the scene.",
    "keyPoints": [
      "Do not touch, move, or collect evidence — preserve only",
      "Cordon off the area to prevent others from accessing the scene",
      "Document: exact time, precise location, what was observed, who was present",
      "Chain of custody begins with you: your documentation is part of the evidentiary record",
      "Transfer scene control to law enforcement and note the name of the officer who took over"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are on post at an outdoor mall. A store manager approaches you and says a shopper just walked out without paying for $800 worth of electronics. The manager wants you to stop the person, search their bags, and recover the merchandise. The person is still visible in the mall. Additionally, another shopper approaches you and reports that they left their bag unattended and believe someone has gone through it.",
    "reflection": "Analyze your authority for each request. For the electronics situation: do you have citizen detention authority, and if so, can you search the person's bags? What is the correct process? For the bag-search complaint: what steps do you take, and what is your evidence preservation obligation if you locate items near the bag that may have been removed from it?"
  },
  {
    "type": "checklist",
    "title": "Search Authority Decision Tree",
    "items": [
      { "label": "Consent Obtained", "description": "Before any search, confirm explicit voluntary consent from the person whose property is to be searched. Document the consent: time, who consented, and what they consented to search." },
      { "label": "Employer Policy Reviewed", "description": "Confirm the search you are conducting is authorized by your employer's written post orders. If not authorized, do not conduct it regardless of the situation." },
      { "label": "Law Enforcement Called for Non-Consent Situations", "description": "If consent is refused and the situation requires a search, call law enforcement. Do not attempt an unauthorized search because the situation seems urgent." },
      { "label": "Evidence Untouched", "description": "If you discover potential evidence of a crime, do not touch or move it. Cordon the area, document what you see, and wait for law enforcement." },
      { "label": "Incident Documented", "description": "Document every search in your incident log: time, location, who was searched, what consent was given, what was found, and the outcome." }
    ]
  }
]
$slides_uas06$
);
