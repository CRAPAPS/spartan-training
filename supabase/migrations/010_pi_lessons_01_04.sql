-- ============================================================
-- 010_pi_lessons_01_04.sql
-- Slide content for PI-01 through PI-04
-- MJM 2026 Private Detective curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('PI-01','PI-02','PI-03','PI-04');

-- ── PI-01: History of Law Enforcement & the PI Industry ───────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-01', 'History of Law Enforcement & the PI Industry',
$slides_pi01$
[
  {
    "type": "slide",
    "heading": "Origins: From Pinkerton to GBPDSA",
    "body": "The private investigation profession traces its American origins to Allan Pinkerton, who founded the Pinkerton National Detective Agency in 1850. Pinkerton agents guarded Abraham Lincoln, disrupted Confederate spy rings, and pursued the James-Younger Gang — establishing the foundational model of private investigative work operating alongside, but separate from, sworn law enforcement. In Georgia, this profession is now governed entirely by the Georgia Board of Private Detectives and Security Agencies (GBPDSA), operating under Title 43, Chapter 38 of the Official Code of Georgia Annotated. You are the modern continuation of that tradition — and you carry a legal obligation that Pinkerton never did.",
    "keyPoints": [
      "Pinkerton Agency (1850) established the American PI profession model",
      "Georgia regulates all PI work under OCGA Title 43, Chapter 38",
      "GBPDSA is the sole licensing authority — not counties, not municipalities",
      "Georgia Admin Code 509-3-.06 sets the mandatory 72-hour PI training standard",
      "History matters: today's legal framework grew directly from 19th-century abuses"
    ],
    "legalRef": "OCGA Title 43, Chapter 38 | GA Admin Code 509-3-.06",
    "callout": { "type": "info", "text": "The GBPDSA was created precisely because unregulated private detectives caused serious civil rights violations. Understanding that history explains why every rule in this course exists." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Georgia Licensing: What Title 43 Requires Before You Work",
    "body": "Before you conduct a single minute of paid investigative work in Georgia, the law requires three things to be in place simultaneously. First, you must hold a valid GBPDSA Private Detective License as an individual. Second, the agency you work for — or own — must hold a current Private Detective Agency License. Third, your training record must reflect completion of the Board-mandated 72 hours of instruction under Admin Code 509-3-.06. Working without any one of these three conditions is a criminal offense, not merely a regulatory infraction.",
    "keyPoints": [
      "Individual PI License: renewed annually, issued by GBPDSA",
      "Agency License: employer must also hold a current Board license",
      "72-hour training completion must be documented and available to Board on request",
      "First offense: misdemeanor | Subsequent offenses: felony under OCGA 43-38-18",
      "No grace period — license expired by even one day means you are unlicensed"
    ],
    "legalRef": "OCGA 43-38-4 | OCGA 43-38-18 | GA Admin Code 509-3-.06",
    "callout": { "type": "warning", "text": "A client paying you for investigative work creates a legally compensated PI engagement. Even informal 'favors' that generate payment can trigger licensing requirements under OCGA 43-38-1." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Scope of PI Authority vs. Law Enforcement Powers",
    "body": "Private investigators in Georgia are civilians. This is the single most important legal concept in this entire course. You have no arrest authority beyond what any Georgia citizen possesses under OCGA 17-4-60. You have no power to compel testimony, execute search warrants, or command compliance. You cannot flash credentials and expect the legal force that a peace officer badge carries. What you do have is the right to gather information through lawful observation, public records research, consensual interviews, and legal surveillance — and to present that information as evidence in legal proceedings.",
    "keyPoints": [
      "PIs are private citizens — no peace officer powers, no state authority",
      "Citizen arrest under OCGA 17-4-60 applies only to felonies committed in your presence",
      "Cannot compel interviews, execute warrants, or make traffic stops",
      "Can conduct lawful surveillance, public records research, and consensual interviews",
      "Your evidence is only as good as the legality of how you obtained it"
    ],
    "legalRef": "OCGA 17-4-60 | OCGA 43-38-1",
    "callout": { "type": "warning", "text": "Impersonating a law enforcement officer while conducting PI work is a felony under OCGA 16-10-23. Never imply official authority you do not have." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The GBPDSA Board: Structure, Jurisdiction, and Enforcement",
    "body": "The Georgia Board of Private Detectives and Security Agencies operates under the Secretary of State's Professional Licensing Boards Division. The Board has authority to issue, deny, suspend, and revoke licenses; investigate complaints; conduct audits of training records; and impose civil penalties. Complaints against licensees are investigated by the Professional Standards division. A substantiated complaint can result in a consent order, formal hearing, or license revocation. Board decisions can be appealed through the Office of State Administrative Hearings (OSAH) under the Georgia Administrative Procedure Act.",
    "keyPoints": [
      "GBPDSA operates under the Secretary of State's office",
      "Board powers: issue, deny, suspend, revoke, audit, and impose penalties",
      "Complaints → Professional Standards investigation → formal hearing if substantiated",
      "Appeal path: Office of State Administrative Hearings (OSAH)",
      "Board meetings are public record — agenda and minutes available online"
    ],
    "legalRef": "OCGA 43-38-5 | Georgia Administrative Procedure Act (OCGA 50-13)",
    "callout": { "type": "info", "text": "Your GBPDSA license number is public record. Clients, opposing counsel, and the Board itself can verify your license status online at any time." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. A client hires you to locate a former business partner who owes $40,000 and has disappeared. During your investigation, you locate the subject and the client asks you to confront the person, demand payment, and physically prevent them from leaving until they sign a repayment agreement. The client offers you a $500 bonus if you obtain the signature.",
    "reflection": "What is the legal problem with this request, and what are the specific offenses the client is asking you to commit? What should you say to the client, and can you continue the engagement? If you do locate the subject, what can you lawfully do with that information?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Pre-Engagement Compliance Checklist",
    "items": [
      { "label": "Individual License Current", "description": "Verify your GBPDSA PI license is active and not within 30 days of expiration before accepting any paid engagement." },
      { "label": "Agency License Current", "description": "Confirm the agency you are working under holds a current GBPDSA Agency License — your individual license does not protect you if the agency is unlicensed." },
      { "label": "72-Hour Training on File", "description": "Confirm your training record reflecting completion of the 509-3-.06 72-hour curriculum is documented and accessible to the Board on demand." },
      { "label": "Scope Review", "description": "Before accepting the engagement, confirm the requested work falls within lawful PI activities — observation, records research, interviews. Refuse any request that would require police powers." },
      { "label": "Client Identity Verified", "description": "Know who your client is. Accepting an engagement from an anonymous or unverified client exposes you to facilitation liability if the purpose is unlawful." }
    ],
    "narrationUrl": null
  }
]
$slides_pi01$
);

-- ── PI-02: Ethics for Private Investigators ───────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-02', 'Ethics for Private Investigators',
$slides_pi02$
[
  {
    "type": "slide",
    "heading": "Honesty: The Absolute Prohibition on Misrepresentation",
    "body": "Honesty is not a professional preference for private investigators — it is a legal obligation. The GBPDSA Code of Conduct prohibits misrepresentation in any form: lying to a client about your findings, falsifying a report, staging evidence, or misrepresenting your identity to obtain information through deception. While undercover work involves operating under a cover identity, there is a critical legal line between maintaining a cover and actively lying to induce someone to incriminate themselves or surrender protected rights. That line is explored in detail in Module PI-18. For now, internalize this principle: every written word in a report you produce may be read aloud in open court. Write as if you are already under oath.",
    "keyPoints": [
      "GBPDSA Code of Conduct prohibits misrepresentation in reports, billing, and conduct",
      "Falsifying investigative reports is a license revocation offense and potential criminal fraud",
      "Cover identity in undercover work ≠ fabricating evidence or inducing false confessions",
      "Every report can be subpoenaed — write it as if a judge will read every sentence",
      "Billing fraud (inflating hours, fabricating expenses) is grounds for both license loss and civil suit"
    ],
    "legalRef": "GBPDSA Code of Conduct | OCGA 43-38-11 (grounds for discipline)",
    "callout": { "type": "warning", "text": "A PI who falsifies one report has poisoned every case they ever worked. Opposing counsel will use that history to impeach every piece of evidence you have ever produced." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Responsibility: Duty to Client, Public, and the Law",
    "body": "Your responsibility as a licensed PI runs in three directions simultaneously. To your client, you owe competent, diligent work — but only within the law. To the public, you owe a duty not to weaponize your skills against innocent people or to facilitate harassment, stalking, or illegal surveillance. To the law itself, you owe compliance regardless of client pressure. When these three duties conflict — and they will — the hierarchy is fixed: law first, public safety second, client interests third. A client who asks you to break the law to serve their interests is not entitled to your services. They are entitled to a refusal.",
    "keyPoints": [
      "Client duty: competent, diligent work within legal boundaries only",
      "Public duty: do not facilitate harassment, stalking, or surveillance of innocents",
      "Legal duty: compliance is non-negotiable and supersedes client demands",
      "Hierarchy when duties conflict: law → public safety → client interests",
      "You can and must refuse unlawful instructions without breaching your contract"
    ],
    "legalRef": "GBPDSA Code of Conduct | OCGA 43-38-11",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Respect, Fairness & Compassion in PI Practice",
    "body": "Respect means treating every person you encounter in an investigation — subject, witness, opposing party — with basic human dignity, regardless of what they may have done. Fairness means following the evidence wherever it leads, even when the findings harm your client's position. A PI who shapes findings to please the client is not an investigator — they are a paid advocate, and a dishonest one. Compassion means recognizing that your work intersects with people at some of the worst moments of their lives. Domestic investigations, criminal matters, and insurance fraud cases involve real pain. Professionalism requires you to do your job without becoming callous to that reality.",
    "keyPoints": [
      "Respect: treat every person encountered with dignity regardless of their role",
      "Fairness: follow evidence to its honest conclusion, even when unfavorable to client",
      "Compassion: recognize the human cost of the situations you are investigating",
      "A PI who cherry-picks findings to please a client is committing a form of fraud",
      "These values protect you legally — a professional reputation is your most valuable asset"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "GBPDSA Code of Conduct: Violations That End Careers",
    "body": "The GBPDSA has the authority to revoke your license for conduct that violates the Board's professional standards, even if that conduct does not result in criminal charges. Grounds for discipline include: conviction of a crime involving moral turpitude; willful misrepresentation in obtaining a license; unauthorized use of a client's confidential information; engaging in conduct that is dishonest, fraudulent, or deceptive; and violating any provision of Title 43, Chapter 38. A single serious violation can result in permanent revocation with no right of reapplication for five years. There is no statute of limitations on Board discipline for licensing fraud.",
    "keyPoints": [
      "Moral turpitude conviction: automatic license review, likely suspension or revocation",
      "Licensing fraud: misrepresenting qualifications on your application = permanent bar",
      "Client confidentiality breach: civil liability plus Board discipline",
      "Deceptive conduct: broadly defined — covers billing, reports, and surveillance methods",
      "No statute of limitations for Board-initiated licensing fraud investigations"
    ],
    "legalRef": "OCGA 43-38-11 | GA Admin Code 509-1-.01 et seq.",
    "callout": { "type": "warning", "text": "Board disciplinary proceedings are public record. A suspension or revocation appears on your permanent professional history and can be found by any prospective client or employer." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You have completed a two-week surveillance of a subject in an insurance fraud case. Your footage clearly shows the subject performing physical activities that contradict their disability claim — but it also captures, on day 9, the subject weeping alone in their vehicle for twenty minutes after receiving what appears to be a phone call. The insurance carrier's attorney asks you to include only the exculpatory footage and to omit any footage that could generate sympathy for the claimant in front of a jury.",
    "reflection": "Are you obligated to comply with the attorney's selective disclosure request? What are the ethical and legal implications of omitting the weeping footage? Who is your client in this relationship — the attorney, the insurance carrier, or the truth? What do you include in your report and why?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Daily Ethics Self-Check",
    "items": [
      { "label": "Report Accuracy", "description": "Before submitting any report, confirm that every factual statement can be corroborated by your documentation. Nothing in the report should be an assumption presented as fact." },
      { "label": "Client Instruction Review", "description": "If a client instruction feels wrong, stop and analyze it against the GBPDSA Code of Conduct before executing it. 'The client asked me to' is not a defense before the Board." },
      { "label": "Evidence Integrity", "description": "Confirm that all evidence collected today was gathered through lawful means. Any evidence with a legal question mark must be flagged to your supervising attorney or agency principal before use." },
      { "label": "Billing Accuracy", "description": "Verify that hours billed reflect actual time worked on the case. Round up to the nearest quarter-hour only — do not pad entries." },
      { "label": "Confidentiality Maintained", "description": "Confirm you have not disclosed client identity, case details, or subject information to any unauthorized person today — including family members." }
    ],
    "narrationUrl": null
  }
]
$slides_pi02$
);

-- ── PI-03: Types of Investigations ───────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-03', 'Types of Investigations',
$slides_pi03$
[
  {
    "type": "slide",
    "heading": "Civil vs. Criminal Investigations: Fundamental Differences",
    "body": "The single most important distinction in PI work is understanding whether you are operating in a civil or criminal context — because the rules of evidence, your role, and your obligations differ dramatically between the two. Civil investigations gather evidence for use in lawsuits, divorces, insurance claims, and business disputes. The standard of proof in civil cases is a preponderance of the evidence — more likely than not. Criminal investigations, whether for the prosecution or the defense, gather evidence that may determine someone's liberty. The standard of proof is beyond a reasonable doubt. Private investigators can work both sides. Most working PIs handle far more civil work than criminal.",
    "keyPoints": [
      "Civil: lawsuits, insurance, divorce, corporate disputes — preponderance of evidence standard",
      "Criminal: prosecution support or defense investigation — beyond reasonable doubt standard",
      "PIs can legally work for either side in civil or criminal matters",
      "Evidence admissibility rules differ between civil and criminal proceedings",
      "Most PI workload is civil: insurance fraud, domestic, corporate, process serving"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Insurance, Domestic, Corporate, and Defense Investigations",
    "body": "Insurance investigations examine claims for fraud, misrepresentation, or exaggeration. The PI typically works for the carrier's Special Investigative Unit (SIU) or a retained defense firm. Domestic investigations cover infidelity, custody disputes, asset location, and child welfare matters — these are emotionally charged and carry elevated legal risk due to Georgia's stalking and harassment statutes. Corporate investigations address employee theft, trade secret misappropriation, workers' compensation fraud, and due diligence for mergers. Criminal defense investigations work to locate exculpatory evidence, identify unreliable witnesses, and reconstruct crime scenes from the defense perspective. Each type carries its own risk profile and documentation standards.",
    "keyPoints": [
      "Insurance fraud: most common PI engagement, requires ironclad video documentation",
      "Domestic: highest emotional risk, highest stalking-law exposure — document scope carefully",
      "Corporate: confidentiality is paramount; NDA with client required before engagement",
      "Criminal defense: Brady and Giglio obligations apply to evidence you discover",
      "Each engagement type has different documentation and reporting standards"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Working with Attorneys: The PI's Role in Civil Litigation",
    "body": "Private investigators frequently work under attorney direction in civil and criminal litigation. When you work for an attorney, your work product — notes, reports, photographs, and video — may be protected by the attorney work product doctrine under OCGA 9-11-26(b)(3), shielding it from opposing discovery unless exceptional circumstances are shown. This protection does not apply to underlying facts you observed; it applies to your analysis, impressions, and reports prepared in anticipation of litigation. Understanding this distinction is critical: the doctrine protects strategy, not facts. Always clarify with the retaining attorney which communications are privileged before speaking with anyone about the case.",
    "keyPoints": [
      "Attorney work product doctrine: OCGA 9-11-26(b)(3) protects PI reports prepared for litigation",
      "Protection covers analysis and impressions — not underlying observable facts",
      "PI working under attorney direction should treat all case communications as potentially privileged",
      "Do not discuss case details with anyone outside the attorney-client team without authorization",
      "Clarify with retaining attorney whether your report is 'for litigation' before writing it"
    ],
    "legalRef": "OCGA 9-11-26(b)(3) | Hickman v. Taylor (1947)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Client Intake: Scope Definition and Conflict Checks",
    "body": "A properly structured client intake prevents problems that cannot be fixed after the investigation begins. Before accepting any engagement, run a conflict check: have you previously worked for, or against, the opposing party? Do you have a personal relationship with either side? Does the requested scope raise legal red flags? Define the engagement scope in writing: what information is being sought, what methods are authorized, what geographic boundaries apply, what is the budget, and who has authority to expand scope. A written engagement agreement signed before work begins is not optional — it is the only document that proves what you were hired to do if the relationship sours.",
    "keyPoints": [
      "Conflict check before every engagement: prior relationships with either party",
      "Written engagement agreement is mandatory before any work begins",
      "Define scope precisely: subject, objective, authorized methods, geography, budget",
      "Identify who can authorize scope expansion and document any changes in writing",
      "Retainer paid before work begins — no advance payment means no guarantee of payment"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. A man calls your agency and says his wife has been acting 'suspicious' for three months and he wants her followed to confirm an affair. He is willing to pay $5,000 in cash upfront, he does not want a written contract, and he wants you to start tonight. He asks you to also check whether she has been communicating with a specific person by accessing her email account.",
    "reflection": "Identify every red flag in this intake. What are the legal problems with the cash-only arrangement, the lack of a written contract, and the email access request? What would a proper intake procedure look like for a legitimate version of this engagement? Is there a version of this engagement you can legally accept?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Case Intake Checklist",
    "items": [
      { "label": "Conflict Check Complete", "description": "Search your files for any prior engagement involving the client, the subject, or opposing parties. Decline or disclose any conflict before engagement begins." },
      { "label": "Client Identity Verified", "description": "Obtain and record government-issued ID for the client. For corporate clients, verify the business entity and the authority of the individual signing the engagement agreement." },
      { "label": "Engagement Agreement Signed", "description": "Written agreement executed before any work begins. Agreement specifies: scope, subject identification, authorized methods, geographic limits, fee structure, and termination conditions." },
      { "label": "Scope Legal Review", "description": "Confirm every requested investigative method is legal under Georgia law. Flag any request involving electronic access, recording, or physical surveillance for legal review before proceeding." },
      { "label": "Retainer Collected", "description": "Collect initial retainer in a form that creates a paper trail. Cash-only arrangements without receipts create billing disputes and can indicate a client trying to obscure the engagement." }
    ],
    "narrationUrl": null
  }
]
$slides_pi03$
);

-- ── PI-04: Principal GA Misdemeanors & Felonies ───────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-04', 'Principal GA Misdemeanors & Felonies',
$slides_pi04$
[
  {
    "type": "slide",
    "heading": "OCGA Structure: How Georgia Criminal Law Is Organized",
    "body": "The Official Code of Georgia Annotated (OCGA) is organized into Titles, Chapters, Articles, and Sections. Criminal law is primarily found in Title 16 (Crimes and Offenses). Each Title 16 chapter addresses a category of crime: Chapter 5 covers offenses against persons (assault, battery, stalking, murder), Chapter 6 covers sexual offenses, Chapter 8 covers offenses against property (theft, burglary), Chapter 9 covers forgery and fraud, Chapter 10 covers offenses against public administration, and Chapter 11 covers offenses against public order and privacy — which is where eavesdropping and surveillance law lives. As a PI, you need working familiarity with Chapters 5, 8, 9, 10, and 11 because those are the chapters where your work can generate criminal exposure if conducted improperly.",
    "keyPoints": [
      "OCGA Title 16 = all Georgia criminal offenses",
      "Chapter 5: offenses against persons — stalking, harassment, assault",
      "Chapter 8: property offenses — trespass, theft, burglary",
      "Chapter 9: fraud — identity fraud, impersonation, financial crimes",
      "Chapter 11: privacy offenses — eavesdropping, wiretapping, peeping (most PI-critical)"
    ],
    "legalRef": "OCGA Title 16",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Misdemeanors: Classification, Penalties, and PI Exposure",
    "body": "Georgia classifies misdemeanors into two tiers. A standard misdemeanor carries a maximum penalty of twelve months in jail and a fine up to $1,000. A high and aggravated misdemeanor carries a maximum of twelve months and a fine up to $5,000. For private investigators, misdemeanor exposure most commonly arises from: trespass under OCGA 16-7-21 (entering private property without consent), simple battery under OCGA 16-5-23 (any intentional physical contact without consent during an investigation), and operating without a GBPDSA license under OCGA 43-38-18. A misdemeanor conviction triggers a mandatory Board review and will likely result in license suspension.",
    "keyPoints": [
      "Standard misdemeanor: up to 12 months, up to $1,000 fine",
      "High & aggravated misdemeanor: up to 12 months, up to $5,000 fine",
      "Trespass (OCGA 16-7-21): entering private property without consent during surveillance",
      "Simple battery (OCGA 16-5-23): any unwanted physical contact during a PI encounter",
      "Unlicensed PI practice (OCGA 43-38-18): misdemeanor first offense, felony on repeat"
    ],
    "legalRef": "OCGA 16-7-21 | OCGA 16-5-23 | OCGA 17-10-3 | OCGA 43-38-18",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Felonies: High and Low, and the Lines PIs Must Not Cross",
    "body": "Georgia felonies are classified as felonies (unspecified), with sentences set by the specific statute. A felony conviction results in automatic GBPDSA license revocation and permanent bar from relicensure for a minimum of five years. For private investigators, felony exposure most commonly arises from: stalking under OCGA 16-5-90 (pattern of following or surveilling that causes emotional distress to the subject), aggravated stalking under OCGA 16-5-91 (same conduct in violation of a restraining order), impersonating a law enforcement officer under OCGA 16-10-23, computer trespass under OCGA 16-9-93 (accessing electronic accounts without authorization), and aggravated battery if physical force is used during a confrontation.",
    "keyPoints": [
      "Felony conviction = automatic license revocation + 5-year minimum bar from relicensure",
      "Stalking (OCGA 16-5-90): surveillance pattern that causes the subject emotional distress",
      "Aggravated stalking (OCGA 16-5-91): stalking while under restraining order — felony",
      "Impersonating law enforcement (OCGA 16-10-23): showing false badge or claiming police authority",
      "Computer trespass (OCGA 16-9-93): accessing any electronic account without authorization"
    ],
    "legalRef": "OCGA 16-5-90 | OCGA 16-5-91 | OCGA 16-10-23 | OCGA 16-9-93",
    "callout": { "type": "warning", "text": "A single felony charge — not even a conviction — triggers an automatic GBPDSA license suspension pending investigation. An arrest for a felony can end your career before trial." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Jurisdiction & Venue: Where Crimes Are Tried",
    "body": "Jurisdiction determines which court has the legal authority to hear a case. Venue determines which geographic location within that court system hears it. For criminal cases in Georgia, jurisdiction is generally in the county where the crime occurred. Superior Court handles felonies and serious misdemeanors. State Court handles misdemeanors. Magistrate Court handles probable cause determinations and some civil matters. For PI work, the venue question matters because a single investigation may span multiple counties — and conduct that crosses into a different county creates jurisdiction in that county as well. An eavesdropping offense committed in Fulton County while the target is in DeKalb can create jurisdiction in both counties simultaneously.",
    "keyPoints": [
      "Superior Court: felonies and serious misdemeanors",
      "State Court: misdemeanors",
      "Magistrate Court: arrest warrants, probable cause, small civil claims",
      "Venue = county where the criminal act occurred",
      "Multi-county investigations can create jurisdiction in each county where conduct occurred"
    ],
    "legalRef": "OCGA 17-2-2 (venue) | OCGA 15-6-8 (Superior Court jurisdiction)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Crimes a PI Can Inadvertently Commit: Stalking, Trespass, Impersonation",
    "body": "The most common PI criminal exposures are not the result of deliberate wrongdoing — they arise from misunderstanding where legal surveillance ends and criminal conduct begins. Trespass occurs the moment you step onto private property without consent, regardless of your investigative purpose. Following a subject in a vehicle becomes stalking when it generates a pattern of harassment that causes the subject fear — Georgia courts have found this with as few as three or four incidents. Misrepresenting your identity to obtain information can become impersonation of an officer if you imply law enforcement authority. Accessing a subject's email, social media, or phone records without authorization is computer trespass — regardless of what the client tells you the subject 'already agreed to.'",
    "keyPoints": [
      "Trespass: one step onto private property without consent is the offense — intent is irrelevant",
      "Stalking: pattern of surveillance that generates fear — can occur within a single investigation",
      "Impersonation: implying law enforcement authority in any form, including showing a badge-style ID",
      "Computer trespass: any unauthorized access to electronic accounts, even with client direction",
      "Each of these can occur during a legitimate investigation if boundaries are not maintained"
    ],
    "legalRef": "OCGA 16-7-21 | OCGA 16-5-90 | OCGA 16-10-23 | OCGA 16-9-93",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "OCGA 16-11-62: Georgia's Eavesdropping Statute",
    "body": "OCGA 16-11-62 is the most critical statute for practicing private investigators in Georgia. It prohibits observing, photographing, or recording a person in a private place without their consent when they have a reasonable expectation of privacy. It prohibits intercepting wire, oral, or electronic communications without consent. It prohibits installing any device to observe, record, amplify, or broadcast private communications without consent. Violation is a felony. The key concept is 'reasonable expectation of privacy' — a person on a public street has none; a person inside their home, hotel room, or medical office has maximum protection. Georgia is a one-party consent state for audio recording: at least one party to the conversation must consent. If you are not a party to the conversation, you cannot record it without consent from someone who is.",
    "keyPoints": [
      "OCGA 16-11-62: prohibits recording or observing persons with reasonable expectation of privacy",
      "Felony offense — no misdemeanor option for eavesdropping violations",
      "Georgia is one-party consent for audio: you must BE a party or have consent from a party",
      "Installing any recording device in a private place without consent: felony",
      "Reasonable expectation of privacy test: public street = none | private home = maximum"
    ],
    "legalRef": "OCGA 16-11-62 | OCGA 16-11-69 (penalties)",
    "callout": { "type": "warning", "text": "Placing any recording device — audio or video — inside a private residence, vehicle interior, or enclosed office without the consent of a person who will be recorded there is a Georgia felony. No client authorization makes this lawful." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are conducting mobile surveillance on a subject suspected of workers' compensation fraud. On day three, you follow the subject into a residential neighborhood and park across the street. The subject enters a house. Thirty minutes later, lights come on in the second-floor bedroom. You zoom your video camera into the lit window and capture footage of the subject through the glass. The client is excited about the footage and asks you to return the following night with a longer lens.",
    "reflection": "Analyze the bedroom footage. Does the subject have a reasonable expectation of privacy in their bedroom? Is your footage legally usable or is it evidence of a crime you committed? What should you have done when the subject entered the residence? Should you return the next night as the client requests?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Legal Boundary Checklist Before Each Investigation Day",
    "items": [
      { "label": "Surveillance Location Legal", "description": "Confirm your observation point is on public property or private property for which you have written authorization. Parking on a public street or in a public lot is lawful. Entering private property to get a better angle is not." },
      { "label": "Recording Consent Analyzed", "description": "Before recording any audio, confirm either (a) you are a party to the conversation, or (b) you have consent from a party to the conversation. If neither applies, audio recording is illegal." },
      { "label": "No Reasonable Expectation Zones Targeted", "description": "Confirm your recording is directed only at areas where the subject has no reasonable expectation of privacy: public streets, parking lots, commercial interiors visible from public areas, yards visible from public roadways." },
      { "label": "Identity Presentation Reviewed", "description": "Confirm your plan for any subject contact does not involve implying law enforcement authority. You may identify yourself as a licensed PI. You may not show anything that resembles a police badge or claim any law enforcement affiliation." },
      { "label": "Electronic Access Boundary", "description": "Confirm no planned activity today involves accessing any electronic device, account, or communication without express consent from an authorized party. Client authorization alone does not make this legal." }
    ],
    "narrationUrl": null
  }
]
$slides_pi04$
);
