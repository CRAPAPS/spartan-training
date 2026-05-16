-- ============================================================
-- 014_pi_lessons_17_24.sql
-- Slide content for PI-17 through PI-24
-- MJM 2026 Private Detective curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('PI-17','PI-18','PI-19','PI-20','PI-21','PI-22','PI-23','PI-24');

-- ── PI-17: Criminal Defense Investigation ────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-17', 'Criminal Defense Investigation',
$slides_pi17$
[
  {
    "type": "slide",
    "heading": "The PI's Role in the Defense: Working Under Defense Counsel",
    "body": "Criminal defense investigation is among the most legally sensitive work a private investigator can undertake. When you work for a defense attorney, you are an extension of the defense team — your work is protected by attorney-client privilege and the work product doctrine to the extent authorized by your retaining attorney. Your mission is not to prove innocence; it is to find every piece of information that could support the defense position, challenge the prosecution's case, or impeach the state's witnesses. You may uncover information that does not help your client — report it to the retaining attorney. You are not a judge; you gather information and the attorney makes legal decisions. Never discuss defense strategy, findings, or your engagement with anyone outside the defense team, including the client's family, without attorney authorization.",
    "keyPoints": [
      "Defense PI = extension of defense team — work is privilege-protected under attorney direction",
      "Mission: find information supporting defense, challenging prosecution, impeaching witnesses",
      "Report everything to attorney — including unfavorable findings",
      "Never discuss defense findings with family, press, or unauthorized persons",
      "You gather information; the attorney makes legal decisions about how to use it"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Locating Exculpatory Evidence: Brady and Giglio Obligations",
    "body": "Brady v. Maryland (1963) established that the prosecution must disclose to the defense all material exculpatory evidence — evidence that would tend to prove innocence or reduce punishment. Giglio v. United States (1972) extended this to impeachment evidence about government witnesses. As a defense PI, you are looking for Brady material the prosecution may not have disclosed: witness statements that differ from police reports, physical evidence that was not collected or was mishandled, surveillance footage that contradicts the prosecution's timeline, and witnesses who were not interviewed by police. When you find Brady or Giglio material, immediately notify the retaining attorney. The attorney then has disclosure obligations. You do not make Brady disclosures directly — the attorney controls that process.",
    "keyPoints": [
      "Brady material: evidence tending to exculpate the defendant or reduce punishment",
      "Giglio material: evidence impeaching government witnesses' credibility or reliability",
      "Defense PI mission: find what police did not collect, overlooked, or failed to disclose",
      "Contradictory witness statements, uncollected physical evidence, uninterviewed witnesses: all Brady-relevant",
      "Report Brady material to attorney immediately — do not make disclosures directly"
    ],
    "legalRef": "Brady v. Maryland, 373 U.S. 83 (1963) | Giglio v. United States, 405 U.S. 150 (1972)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Witness Re-Interviews: Legal Constraints and Ethical Duties",
    "body": "Re-interviewing witnesses who have already spoken with law enforcement is lawful and is a core defense PI function. Witnesses who previously gave statements to police are not obligated to speak with you — but they are not prohibited from doing so either. Your approach matters: introduce yourself clearly as a licensed PI working for the defense, and make plain that the interview is voluntary. Do not misrepresent your purpose or imply that the witness has a legal obligation to speak with you. Do not interfere with witnesses who are under court protection orders. Never contact a represented party directly — contact goes through their attorney. For witnesses who are also prosecution witnesses in an active criminal case, be especially careful: any conduct that can be characterized as intimidation or tampering is a felony under OCGA 16-10-93.",
    "keyPoints": [
      "Re-interviewing police-interviewed witnesses: lawful and essential defense PI function",
      "Witnesses may decline — do not imply a legal obligation to cooperate",
      "Identify yourself and your role clearly — no misrepresentation of purpose",
      "Never contact a represented party directly — go through their attorney",
      "Witness tampering (OCGA 16-10-93): felony — avoid any conduct that could be characterized as intimidation"
    ],
    "legalRef": "OCGA 16-10-93 (witness tampering)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Working with Incarcerated Clients: Facility Rules and Privilege",
    "body": "If your investigation requires communicating with a client who is in pretrial detention or serving a sentence, you are working in a heavily regulated environment. Jail and prison visits require advance approval from facility administration, typically through the retaining attorney's visiting authority. Conversations between inmates and their legal team (attorney and PI under attorney direction) are constitutionally protected and should not be monitored — but facilities do monitor non-legal visits. Never visit as a personal visitor when you are there on a professional basis: your visit must be logged and authorized as a legal visit. Do not bring documents into a facility without clearance. Do not remove documents from a facility without clearance. Communications you conduct within the facility may be discoverable if not properly designated as legal-team communications.",
    "keyPoints": [
      "Facility visits: require advance authorization through retaining attorney",
      "Legal team visits: constitutionally protected from monitoring under attorney-client privilege",
      "Log every visit as a legal/professional visit — not as a personal visitor",
      "Documents in/out of facility: require facility clearance — violations can be criminal",
      "Communications must be designated as legal-team communications to receive privilege protection"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. The defense attorney asks you to re-interview the prosecution's key eyewitness, who claims to have seen your client commit the crime. You visit the witness at home. The witness says they do not want to talk to you. You tell the witness that if they do not talk to you, the defense attorney may subpoena them to testify again, and that things could 'get more complicated' for them if they do not cooperate now.",
    "reflection": "Analyze your statements to the witness. Have you committed witness tampering? Has the witness been coerced? What should you have said when the witness declined? What do you do now — continue attempting contact, report to the attorney, or document and move on?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Defense Investigation Checklist",
    "items": [
      { "label": "Attorney Scope Confirmed in Writing", "description": "Before any defense investigation activity, confirm in writing with the retaining attorney: what you are authorized to investigate, who you may contact, and how findings should be reported." },
      { "label": "Witness Contact Protocol Agreed", "description": "Confirm with attorney which witnesses you may contact directly and whether any witnesses are represented or under protective orders that require attorney-to-attorney contact." },
      { "label": "Brady Material Reporting Channel Confirmed", "description": "Confirm the process for reporting potentially exculpatory findings: direct to attorney, in writing, immediately upon discovery. Do not sit on Brady material." },
      { "label": "Facility Visit Authorization Obtained", "description": "If visiting an incarcerated client, confirm facility authorization has been obtained through the retaining attorney before arriving at the facility." },
      { "label": "No Independent Disclosure", "description": "Confirm you will make no disclosure of defense findings, strategy, or client identity to any party outside the defense team — including the client's family and media — without explicit attorney authorization." }
    ],
    "narrationUrl": null
  }
]
$slides_pi17$
);

-- ── PI-18: Undercover Investigation ──────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-18', 'Undercover Investigation',
$slides_pi18$
[
  {
    "type": "slide",
    "heading": "Legal Framework: When Deception Is and Is Not Permitted",
    "body": "Undercover investigation involves operating under a false identity or pretext to gather information from subjects who would not provide it if they knew your true identity or purpose. Georgia law does not categorically prohibit undercover investigation by private investigators — but it prohibits specific forms of deception. You may: create a business or personal cover identity to gain access to a setting; use a fictitious name in non-legal contexts; and decline to reveal your client's identity when asked. You may not: impersonate a law enforcement officer or government official; claim authority you do not have; use deception to induce a subject to waive a constitutional right; or use deception to extract information through entrapment. The line is between passively allowing a subject to make their own choices in your presence versus actively manipulating them into conduct they would not otherwise engage in.",
    "keyPoints": [
      "Undercover work: operating under cover identity to gather information — lawful within limits",
      "Permitted: cover identity, fictitious name in non-legal contexts, declining to reveal client",
      "Prohibited: impersonating law enforcement, claiming false authority, entrapment",
      "Key line: passive observation under cover vs. active manipulation of subject's choices",
      "Deception that induces waiver of a constitutional right: immediately unlawful"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Entrapment Doctrine: The Absolute Prohibition",
    "body": "Entrapment occurs when a person is induced by a government official — or in some formulations, a private actor — to commit an offense they would not have otherwise committed. The classic elements are: origination of the criminal design in the mind of the inducer, inducement directed at the defendant, and the defendant's lack of predisposition to commit the crime independently. For private investigators, the entrapment prohibition is both a legal and ethical absolute. Inducing a subject to commit a crime so that you can document it and report it to your client — even if the subject ultimately does commit the crime — is inducement. It may destroy the evidentiary value of what you captured, and in some contexts it creates criminal liability for you as a facilitator. Document what happens; do not engineer what happens.",
    "keyPoints": [
      "Entrapment: inducing a person to commit a crime they would not have committed independently",
      "PI entrapment: creating a situation to generate incriminating conduct — absolutely prohibited",
      "Effect: destroys evidentiary value of captured conduct AND creates PI criminal exposure",
      "Your role: document voluntary conduct; never engineer conduct",
      "If subject begins independently criminal conduct, document — do not encourage or facilitate"
    ],
    "legalRef": "OCGA 16-3-25 (entrapment defense) | Sherman v. United States (1958)",
    "callout": { "type": "warning", "text": "A PI who induces a subject to commit theft so the insurance carrier has grounds to deny a claim has committed a crime alongside the subject. The client who instructed the entrapment is also criminally exposed. There is no legitimate purpose for inducing crime." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Cover Stories: Building, Maintaining, and Exiting Safely",
    "body": "A cover identity — or legend — is a constructed personal or professional background that explains your presence in a setting without revealing your investigative purpose. Effective covers are simple, internally consistent, and not easily disproved by a quick internet search. The simpler the cover, the less you have to maintain. Do not create a cover that requires you to claim professional licenses you do not hold (doctor, attorney, CPA) — false claims of professional licensing can constitute fraud. Build a cover that is defensible: a freelance consultant, a vendor representative, a new neighborhood resident. Practice it enough that you do not pause when asked basic questions. Have an exit plan: know how you will gracefully withdraw from the cover setting if the situation becomes compromised or uncomfortable. Never leave evidence of your true identity in a setting where your cover is active.",
    "keyPoints": [
      "Legend: simple, internally consistent, not disproved by a basic internet search",
      "Simpler is better: fewer details to maintain, fewer opportunities for exposure",
      "Do not claim professional licenses you do not hold — this is fraud",
      "Exit plan: know how to withdraw before you enter the setting",
      "Never leave identifying materials (real business card, vehicle with agency branding) in a cover setting"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Documentation While Undercover: Recording Without Consent Issues",
    "body": "Undercover documentation presents audio recording consent challenges. If you are a participant in conversations during your undercover operation, you may lawfully record those conversations under Georgia's one-party consent rule — you are the consenting party. However, if you leave a recording device in a space where conversations will occur between other parties — and you will not be present — that is a two-party consent scenario where no party to the conversation has consented. An unmanned recorder placed in a room where the subject will have conversations with others is a OCGA 16-11-62 felony. Video documentation of the subject performing activities visible to you in your presence is lawful. Video documentation through windows or into private spaces remains subject to OCGA 16-11-62 even during undercover operations.",
    "keyPoints": [
      "Undercover audio: lawful if you are a participant (one-party consent) — OCGA 16-11-66",
      "Unmanned recorder capturing third-party conversations: OCGA 16-11-62 felony",
      "Video of subject in your presence: lawful within public/semi-public settings",
      "Video into private spaces remains prohibited even during undercover operations",
      "Document which recording scenario applies for every piece of undercover audio/video"
    ],
    "legalRef": "OCGA 16-11-62 | OCGA 16-11-66",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are conducting an undercover investigation into alleged employee theft at a retail business. You have taken a part-time position at the business under a false name to observe and document thefts. After two weeks, you have documented three incidents of a co-worker pocketing cash from the register. The employer client then asks you to offer the co-worker an opportunity to take more cash when you are working alone together on a quiet shift — essentially to set up a documented theft to make the evidence 'undeniable.'",
    "reflection": "Analyze the employer's request. Is this entrapment? Does it matter that the subject has already committed theft independently? What happens to the earlier three documented thefts if you comply with this request and the defense raises entrapment? What do you tell the employer?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Undercover Operation Safety Checklist",
    "items": [
      { "label": "Cover Identity Reviewed for Legal Issues", "description": "Confirm cover does not claim any professional license, government affiliation, or law enforcement authority. Confirm cover cannot be immediately disproved by a public record search." },
      { "label": "Entrapment Line Defined in Advance", "description": "Before entering the undercover setting, identify specifically what conduct you will and will not facilitate or encourage. Document this boundary in the case file before operations begin." },
      { "label": "Recording Authorization Mapped", "description": "Identify all anticipated recording scenarios: (a) conversations you participate in (lawful under one-party consent), (b) conversations you witness but do not join (analyze consent requirements before recording)." },
      { "label": "Exit Protocol Established", "description": "Define in advance: what events trigger cover withdrawal, how you communicate 'burn' to your supervisor, and how you physically exit the setting safely when withdrawal is needed." },
      { "label": "No Identifying Materials in Cover Setting", "description": "Confirm your vehicle, personal items, and digital devices are free of materials that would reveal your true identity or investigative role if discovered by the subject or others in the cover setting." }
    ],
    "narrationUrl": null
  }
]
$slides_pi18$
);

-- ── PI-19: Domestic Investigation ─────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-19', 'Domestic Investigation',
$slides_pi19$
[
  {
    "type": "slide",
    "heading": "Scope of Domestic PI Work: Infidelity, Custody, Asset Searches",
    "body": "Domestic investigations encompass some of the most emotionally volatile and legally complex work in private investigation. The three primary categories are: infidelity investigations (documenting a spouse's activities to support or defend divorce proceedings), custody investigations (documenting parental fitness, living conditions, and child welfare), and asset investigations (locating concealed assets in anticipation of divorce settlements). Each category carries elevated legal risk. In infidelity and custody matters, you are documenting people who are already in emotional crisis — and the subjects are often people the client knows personally, making burn recognition faster. Asset investigations involving financial records require strict FCRA and state law compliance. In all domestic cases, the safety of children observed during the investigation is an overriding obligation — if you observe a child in danger, report it to DFCS regardless of client instruction.",
    "keyPoints": [
      "Three categories: infidelity (divorce evidence), custody (parental fitness), asset (concealment)",
      "Elevated emotional volatility: subjects in crisis, burn recognition faster",
      "Infidelity: document activities per GA law; admissibility in divorce depends on jurisdiction",
      "Asset investigation: strict FCRA compliance for any financial record access",
      "Child safety: overrides all client instructions — report danger to DFCS immediately"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "GA Stalking Law OCGA 16-5-90: Where Surveillance Becomes Criminal",
    "body": "Georgia's stalking statute, OCGA 16-5-90, defines stalking as following, placing under surveillance, or contacting another person at or about a place, without the consent of that person, for the purpose of harassing and intimidating that person. The key phrase is 'harassing and intimidating' — stalking requires this purpose, not merely the act of following. However, courts have held that surveillance that generates fear in the subject, even if the PI's subjective purpose was investigation rather than harassment, can satisfy the statute. The standard is objective: would a reasonable person in the subject's position feel harassed and intimidated? Extended surveillance that the subject becomes aware of, surveillance that follows the subject to their workplace and home repeatedly, and surveillance combined with contact attempts creates exposure under this statute even in legitimate domestic cases.",
    "keyPoints": [
      "Stalking (OCGA 16-5-90): following or surveilling without consent for purpose of harassing and intimidating",
      "Subjective purpose of investigation does not immunize conduct that causes objective fear",
      "Standard: would a reasonable person in the subject's position feel harassed?",
      "Risk factors: extended surveillance subject becomes aware of + contact attempts",
      "Following subject to workplace AND home repeatedly in same day = elevated stalking exposure"
    ],
    "legalRef": "OCGA 16-5-90 | OCGA 16-5-91 (aggravated stalking — violation of protective order)",
    "callout": { "type": "warning", "text": "In domestic cases where there is an existing protective order between the client and the subject, conducting surveillance that effectively circumvents the protective order creates aggravated stalking exposure under OCGA 16-5-91, a felony." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Working with Family Law Attorneys: Admissibility of Evidence",
    "body": "Domestic investigation evidence is more frequently challenged on admissibility grounds than evidence in other PI practice areas. In Georgia divorce proceedings, evidence of adultery is relevant to alimony determinations under OCGA 19-6-1 and fault-based divorce grounds, but the evidentiary standards for what constitutes proof of adultery have been developed through decades of case law. Photographs and video documenting a spouse entering and remaining in a location with a person are typically sufficient — but recordings made in violation of OCGA 16-11-62 will be excluded. In custody matters, evidence of parental unfitness must be documented carefully: courts are skeptical of PI testimony that appears motivated by the client's litigation position. Work closely with the retaining family law attorney to ensure your methodology produces evidence that will survive a motion to suppress.",
    "keyPoints": [
      "Adultery evidence: relevant to alimony (OCGA 19-6-1) — photographs of opportunity and inclination",
      "Recording violations: OCGA 16-11-62 violations exclude evidence in domestic proceedings",
      "Custody evidence: skeptically received by courts — methodology must be beyond reproach",
      "Work closely with family law attorney: admissibility analysis before evidence is collected",
      "Partiality challenge: courts notice when PI methodology appears designed to favor client's position"
    ],
    "legalRef": "OCGA 19-6-1 (alimony and adultery) | OCGA 19-9-3 (custody factors)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Emotional Safety: Managing High-Conflict Client Relationships",
    "body": "Domestic investigation clients are frequently in acute emotional distress. They may become obsessive about the investigation, calling for updates multiple times daily, demanding you escalate methods beyond what is legal, and expressing rage, grief, or desperation that clouds their judgment about what they are actually asking you to do. Your professional obligation is to maintain objectivity and legal compliance regardless of the client's emotional state. Set communication expectations at intake: scheduled updates on defined days, no real-time play-by-play during surveillance. Decline requests to escalate beyond legal methods, and document those refusals. Recognize when a client's instructions suggest they are planning to harm themselves or the subject — in those circumstances, your obligation to report overrides client confidentiality.",
    "keyPoints": [
      "Domestic clients in acute distress: manage communication frequency at intake",
      "Scheduled updates only — no real-time surveillance commentary",
      "Document every declined instruction clearly: date, what was requested, your response",
      "Escalation pressure: maintain legal compliance regardless of client emotional state",
      "Harm indicators: if client appears to be planning harm to self or subject, report to appropriate authority"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. A client hires you to document their estranged spouse's activities during a pending divorce. The client provides an address and a daily schedule. After four days of surveillance, you notice the subject appears to have become aware of your vehicle — they are varying their routes and parking in different locations each day. The client calls and says they do not care if the subject knows they are being watched, and they want you to follow the subject all day every day including to their workplace and their children's school.",
    "reflection": "Analyze the stalking law exposure created by the client's expanded instruction. Does it matter that the subject appears aware of the surveillance? What is the significance of following to the children's school? At what point does this instruction, if followed, cross from lawful surveillance into criminal conduct? What do you tell the client?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Domestic Investigation Legal Compliance Checklist",
    "items": [
      { "label": "Protective Order Check", "description": "Before any surveillance begins, confirm whether any protective order exists between the client and the subject. If a protective order is in place, confirm your surveillance plan does not effectively circumvent it." },
      { "label": "Stalking Exposure Analysis", "description": "For every day of planned surveillance, assess: will the subject become aware of surveillance? Are you following to both home and workplace? Is the scope being escalated at client pressure? These are stalking risk factors." },
      { "label": "Recording Compliance Confirmed", "description": "Confirm all audio and video collection complies with OCGA 16-11-62. In domestic cases, the temptation to exceed legal recording limits is highest — check every proposed method against the statute." },
      { "label": "Child Welfare Obligation Noted", "description": "If children are observed during this investigation, confirm your protocol for reporting to DFCS if you observe conditions that indicate danger to a child. Client instructions cannot override this obligation." },
      { "label": "Communication Schedule Established", "description": "Confirm with client: update frequency, format, and that real-time surveillance commentary is not provided. Document this agreement in the engagement file." }
    ],
    "narrationUrl": null
  }
]
$slides_pi19$
);

-- ── PI-20: Insurance Fraud Investigations ─────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-20', 'Insurance Fraud Investigations',
$slides_pi20$
[
  {
    "type": "slide",
    "heading": "Types of Insurance Fraud: Workers' Comp, Auto, Property, Life",
    "body": "Insurance fraud is the most common engagement type for private investigators working in the civil sector. Workers' compensation fraud involves claimants who exaggerate injury severity or perform physical activities inconsistent with their claimed limitations. Auto insurance fraud includes staged accidents, exaggerated injury claims, and phantom passenger schemes. Property fraud involves inflated or fabricated claims for damaged or stolen property. Life insurance fraud includes fabricated deaths, concealed health history, and beneficiary fraud. For each type, the PI's objective is the same: gather objective, documented evidence of the claimant's actual physical capabilities and activities — typically through video surveillance — that can be compared to medical records and the claimant's own statements to the insurer.",
    "keyPoints": [
      "Workers' comp fraud: exaggerated injury, activities inconsistent with claimed limitations",
      "Auto fraud: staged accidents, inflated injury claims, phantom passengers",
      "Property fraud: inflated or fabricated claims for stolen or damaged property",
      "Life fraud: fabricated death, concealed health conditions, beneficiary manipulation",
      "PI objective in all fraud types: objective documented evidence of actual vs. claimed condition"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Working with SIUs: Special Investigative Unit Protocols",
    "body": "Most major insurance carriers operate Special Investigative Units (SIUs) that manage fraud referrals and coordinate outside PI engagements. SIUs have specific protocols for how investigations are initiated, how evidence is submitted, and what documentation standards they require. When working with an SIU, you will typically receive a referral package that includes the claimant's statement, medical records summary, claim details, and the SIU's specific documentation requirements. Follow the SIU's protocol precisely — deviation from their required format or procedures can cause your evidence to be rejected or create liability for the carrier. SIU engagements are typically billed on a flat rate or time-and-materials basis under a standing vendor agreement. Confirm billing terms before beginning any SIU-referred assignment.",
    "keyPoints": [
      "SIU: Special Investigative Unit — internal fraud investigation division of the carrier",
      "SIU referral package: claimant statement, medical summary, claim details, documentation requirements",
      "Follow SIU protocol exactly — deviation creates evidence rejection risk",
      "Billing: flat rate or time-and-materials under standing vendor agreement — confirm before starting",
      "SIU evidence submission: follow their specific format, file naming, and delivery requirements"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Documentation Standards for Insurance Carriers",
    "body": "Insurance fraud documentation must meet a higher evidentiary standard than most civil PI work because it will be used to deny claims, and claim denials can be litigated by claimants with attorneys. Your video must clearly identify the subject — not just someone who looks like them. Your surveillance logs must establish the date, time, location, and duration of every observation. Your photographs must include establishing shots that place the subject's activities in geographic and temporal context. Your report must be objective, precise, and free of characterizations that can be attacked on cross-examination. Any gap between your surveillance and your report creates an argument that what you did not observe is evidence for the claimant. Document what you saw and what you did not see with equal precision.",
    "keyPoints": [
      "Subject identification: video must unambiguously identify the specific claimant — not just someone similar",
      "Log precision: date, time, location, duration for every observation period",
      "Photo coverage: establishing shot + medium + close-up for every key activity",
      "Report objectivity: no characterizations — specific factual descriptions only",
      "Document gaps: explicitly note surveillance periods where no relevant activity was observed"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Providing Testimony in Civil Fraud Proceedings",
    "body": "When an insurance fraud case results in litigation — either the carrier suing the claimant or the claimant suing the carrier after claim denial — your surveillance evidence and your testimony are central exhibits. Expect deposition before trial: opposing counsel will probe your methodology, your equipment, your surveillance positions, and any gaps in your documentation. The most common attacks in insurance fraud testimony: that your footage does not conclusively identify the subject, that the surveillance was conducted only on days when the claimant happened to be active, or that your conclusion that the activities were 'inconsistent with the claimed injury' amounts to a medical opinion you are not qualified to give. Confine your testimony to factual observations. Do not testify to medical conclusions — testify to what you saw and let physicians and attorneys draw the medical conclusions.",
    "keyPoints": [
      "Deposition before trial: prepare for methodology and gap challenges",
      "Identity challenge: confirm your methodology for identifying the specific claimant",
      "Selection bias challenge: explain your complete surveillance schedule, not just productive days",
      "Medical opinion line: testify only to what you observed — let physicians draw medical conclusions",
      "Confine testimony to facts: 'Subject carried a box' not 'Subject was not in pain'"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are documenting a workers' compensation claimant who claims a back injury preventing any lifting over five pounds. On day 4 of surveillance, you capture clear footage of the subject unloading a pickup truck at a storage unit — removing boxes, a television, and what appears to be furniture — over a 45-minute period. The footage is clear and the subject's face is identifiable throughout. Your client calls and asks you to include in your report a statement that the subject 'is clearly not injured and has been defrauding the carrier.' They want this language in the executive summary.",
    "reflection": "Analyze the client's request. Is the statement they want in your executive summary factual or opinion? What is the appropriate way to describe what your footage shows without crossing into a medical conclusion? What specific language would you use in the executive summary instead, and why does the distinction matter?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Insurance Investigation Documentation Checklist",
    "items": [
      { "label": "Subject Identification Protocol Documented", "description": "Before surveillance begins, document how you will identify the subject: description from SIU referral, prior photograph provided, vehicle registration to confirm identity at scene. Record how each identification was made at the start of each surveillance session." },
      { "label": "Complete Surveillance Schedule Logged", "description": "Log every surveillance period, including those with no relevant activity. The complete schedule demonstrates you did not cherry-pick productive days — this defeats the selection bias argument." },
      { "label": "Three-Level Photo/Video Sequence", "description": "For every documented activity: establishing shot (location context), medium shot (subject within environment), close-up (specific activity and face identification). Confirm all three levels are captured." },
      { "label": "Report Language Review", "description": "Before submitting report, review all conclusions for medical opinions. Replace any medical characterization with a specific factual observation. 'Subject carried a box estimated at 30–40 lbs up a flight of 12 stairs' is factual. 'Subject was clearly not injured' is a medical opinion." },
      { "label": "SIU Submission Format Verified", "description": "Confirm report format, video file format, naming convention, and delivery method match the SIU's specific requirements before submission." }
    ],
    "narrationUrl": null
  }
]
$slides_pi20$
);

-- ── PI-21: White Collar Crime & Cyber Forensics ───────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-21', 'White Collar Crime & Cyber Forensics',
$slides_pi21$
[
  {
    "type": "slide",
    "heading": "White Collar Crime Overview: Fraud, Embezzlement, Cyber Crime",
    "body": "White collar crime refers to financially motivated, non-violent crime committed by individuals, businesses, or government officials. For private investigators, the most common white collar engagement types are: corporate embezzlement investigations (employee theft of funds or assets), business fraud (financial statement manipulation, vendor kickbacks, false invoicing), identity theft and impersonation, and computer crime. White collar cases differ from physical crime investigations in that the evidence is primarily documentary and digital — financial records, email communications, access logs, and electronic transactions. Your role is to gather and preserve this evidence in a form that forensic accountants and attorneys can use, not to analyze it yourself. Understand the scope and hand off the analysis to the appropriate specialists.",
    "keyPoints": [
      "White collar: financially motivated non-violent crime — primarily documentary/digital evidence",
      "Common engagements: embezzlement, business fraud, identity theft, computer crime",
      "Evidence type: financial records, email, access logs, transaction records",
      "PI role: gather and preserve evidence — hand analysis to forensic accountants and attorneys",
      "Do not overreach: gathering evidence is your domain; financial analysis is the CPA's domain"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Digital Evidence: Preservation, Hash Verification, Chain of Custody",
    "body": "Digital evidence is uniquely fragile: it can be altered, deleted, or inadvertently overwritten without leaving obvious physical signs. Proper digital evidence preservation begins with forensic imaging — creating a bit-for-bit copy of the storage media without altering the original. This is not a standard file copy; it requires forensic software that captures deleted files, slack space, and metadata. Compute a cryptographic hash (SHA-256 or MD5) of both the original and the image immediately after imaging — if the hashes match, the image is forensically identical to the original. Never work directly on original digital evidence; work from authenticated copies only. If you are not forensic-imaging certified, do not attempt to preserve digital evidence yourself — bring in a qualified digital forensics examiner and document your chain of custody up to the handoff.",
    "keyPoints": [
      "Forensic imaging: bit-for-bit copy using forensic software — not a standard file copy",
      "Hash verification: SHA-256 of original and image must match — proves forensic identity",
      "Never work from original digital evidence — always from authenticated copies",
      "Forensic imaging certification required for admissible digital evidence preservation",
      "If not certified: bring in a qualified examiner and document your chain of custody to the handoff"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Open Source Intelligence (OSINT): Tools, Scope, and Legal Use",
    "body": "Open Source Intelligence (OSINT) is the collection and analysis of information from publicly available sources. For private investigators, OSINT is a legal and powerful research tool: social media profiles, public posts, location check-ins, forum activity, publicly available court filings, corporate records, domain registration data (WHOIS), and news archives. OSINT is entirely lawful when confined to genuinely public information — content posted publicly, records filed publicly. It becomes legally problematic when used as a pretext to access private accounts, when it involves creating fake social media profiles to gain access to a private account (social engineering), or when the gathered information is used to facilitate harassment. Document your OSINT methodology: specify the platforms accessed, the queries run, and the dates of access — OSINT evidence can be challenged on authentication grounds if you cannot reconstruct how you found it.",
    "keyPoints": [
      "OSINT: gathering intelligence from publicly available sources — entirely lawful",
      "Legal sources: public social media posts, public records, domain registrations, news archives",
      "Illegal OSINT: fake profiles to access private accounts, social engineering for account access",
      "Document methodology: platform, query, access date — for authentication purposes",
      "Public vs. private: content visible to the public without login = public; behind any login = private"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Limits of PI Cyber Work: When to Hand Off to a Forensic Expert",
    "body": "Private investigators who are not trained and certified in digital forensics should recognize the clear boundaries of their competence in cyber cases. You can lawfully conduct OSINT, gather publicly available digital evidence, and preserve physical evidence (a computer, a phone) for handoff to a forensic examiner. You should not conduct forensic imaging without certification. You should not analyze network traffic without technical expertise and legal authorization. You should not access any system, account, or database without authorization — regardless of who the target is. When a case requires forensic analysis of a computer, mobile device, or network, retain a qualified digital forensics examiner and coordinate with the retaining attorney to obtain any required legal process (consent or court order) before any device is examined.",
    "keyPoints": [
      "PI cyber competence boundary: OSINT, public digital evidence, physical evidence preservation",
      "Do not forensic image without certification — inadmissible and potentially destructive",
      "Do not analyze network traffic without technical training and legal authorization",
      "Unauthorized system access: CFAA federal crime regardless of target or client instruction",
      "Escalation path: retain certified digital forensics examiner + legal process from attorney"
    ],
    "legalRef": "18 U.S.C. § 1030 (Computer Fraud and Abuse Act)",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Your client suspects a former employee of stealing trade secrets and storing them in a personal Dropbox account. The client says they know the employee's Dropbox login and password — the employee used company devices and the password was visible in the company's IT logs. The client asks you to log into the Dropbox account and download a copy of the files stored there so you have evidence of the theft before the employee can delete them.",
    "reflection": "Analyze the client's request under the Computer Fraud and Abuse Act. Does it matter that the client obtained the credentials through company IT systems? Does the urgency of potential evidence deletion change the legal analysis? What is the correct procedure to preserve these files legally, and who is responsible for obtaining the necessary legal authorization?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Digital Evidence Handling Checklist",
    "items": [
      { "label": "Authorization Confirmed Before Any Access", "description": "Before accessing any digital system, account, or device, confirm authorization: written consent of the owner OR a court order. Client direction alone is not authorization." },
      { "label": "Forensic Examiner Engaged for Device Analysis", "description": "If a case requires examination of the contents of a computer, phone, or storage device, engage a certified digital forensics examiner. Do not attempt forensic imaging without certification." },
      { "label": "OSINT Documentation Complete", "description": "For every OSINT activity, document: platform, search query, date of access, and description of what was found. Screenshot public posts with date/time visible — platforms delete or modify public content." },
      { "label": "Hash Computed on All Digital Evidence", "description": "For any digital evidence you receive, photograph, or capture, compute a SHA-256 hash immediately and record it in the chain of custody log." },
      { "label": "CFAA Exposure Review", "description": "Before any client-directed digital investigation activity, assess whether the activity could constitute unauthorized access under the CFAA. If any doubt exists, obtain written legal analysis from the retaining attorney before proceeding." }
    ],
    "narrationUrl": null
  }
]
$slides_pi21$
);

-- ── PI-22: Executive Protection Services ─────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-22', 'Executive Protection Services',
$slides_pi22$
[
  {
    "type": "slide",
    "heading": "EP vs. PI Work: How the Roles Intersect for Licensed Investigators",
    "body": "Executive protection (EP) — the professional discipline of protecting individuals from physical harm — overlaps with private investigation in the threat assessment and intelligence-gathering phases of a protective operation. A licensed Georgia PI who also holds or supports an EP operation brings specific skills: background investigation of persons who will have access to the principal, surveillance detection during protective assignments, OSINT and threat intelligence analysis, and advance work including venue research and route analysis. The EP specialist's core function — physical protection and security operations — requires additional specialized training, fitness standards, and for armed EP work in Georgia, specific GBPDSA licensing. Know where your PI skills add value and where you need dedicated EP specialists alongside you.",
    "keyPoints": [
      "PI-EP intersection: threat assessment, background investigation, advance work, OSINT",
      "Physical protection role: requires dedicated EP training beyond PI curriculum",
      "Armed EP in Georgia: requires GBPDSA armed security licensure",
      "PI contribution to EP team: intelligence, research, and advance work phase",
      "Scope clarity: define PI role vs. EP role in every protective engagement"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Threat Assessment: Intelligence Gathering for Protective Operations",
    "body": "Threat assessment in an EP context uses PI intelligence-gathering skills to identify, analyze, and prioritize potential threats to a principal. The process involves: identifying persons of concern (those who have made direct threats, those with grievances, those with access and opportunity), assessing the credibility and imminence of threats (specific vs. vague, with means and opportunity vs. aspirational), and recommending countermeasures proportionate to the threat level. Public records, court records (restraining orders, prior assault charges), social media analysis, and interview intelligence all contribute to threat assessment. A threat that appears vague and aspirational in isolation may appear specific and credible when combined with other data points. Document your assessment methodology — threat assessment recommendations must be defensible if a principal is harmed despite them.",
    "keyPoints": [
      "Threat assessment: identify persons of concern → assess credibility → recommend countermeasures",
      "Specific vs. aspirational: 'I will hurt you at your office Tuesday' vs. 'Someone should teach him a lesson'",
      "Data aggregation: individual data points that seem minor become significant in combination",
      "Sources: court records (restraining orders, assault history), social media, background research",
      "Document methodology: threat assessment recommendations must be defensible if acted upon"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Advance Work: Route Surveys, Venue Checks, Vulnerability Reports",
    "body": "Advance work is the reconnaissance and planning conducted before a principal moves through a location. The PI's advance role includes: route survey (identifying primary and alternate routes between locations, noting traffic patterns, choke points, and emergency access), venue check (assessing the security of a destination including entry controls, crowd density, emergency exits, and sightlines), and vulnerability report (identifying specific risks and recommending mitigations). Advance work is documented and delivered to the protective team lead before the principal's movement. For high-value principals, advance work begins days or weeks before the visit. For lower-risk engagements, same-day advance is common. Photograph every venue you assess — the photographs become part of the advance package that the team uses during the actual protective movement.",
    "keyPoints": [
      "Route survey: primary + alternate routes, traffic patterns, choke points, emergency access",
      "Venue check: entry controls, crowd density, emergency exits, sightlines, ingress/egress",
      "Vulnerability report: specific risks identified + recommended mitigations",
      "Timing: high-value advance begins days/weeks prior; lower-risk same day is acceptable",
      "Photograph everything assessed — photos become part of the advance package"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "GBPDSA Requirements for Armed EP Work in Georgia",
    "body": "Executive protection work that involves armed personnel in Georgia requires compliance with GBPDSA licensing requirements. The armed security officer license (individual) and agency license (employer) requirements apply in the same way they apply to armed security work: both must be current before any armed protective work begins. The GBPDSA does not issue a separate 'bodyguard' or 'executive protection' license — armed EP practitioners hold armed security officer credentials. For unarmed EP work, no GBPDSA license is legally required, but professional standards strongly recommend it. All PI licensing requirements that apply to investigative work apply simultaneously when a PI also provides protective services — your PI license does not substitute for your armed security license and vice versa.",
    "keyPoints": [
      "Armed EP in Georgia: requires individual armed security license + agency license (GBPDSA)",
      "No separate EP license: armed EP practitioners hold armed security officer credentials",
      "Unarmed EP: no GBPDSA license legally required, but professional standards recommend it",
      "PI license ≠ security license: both must be current simultaneously if doing both roles",
      "Firearms must be listed on the GBPDSA license — unlisted weapons cannot be carried on duty"
    ],
    "legalRef": "OCGA 43-38-4 | GA Admin Code 509-3-.01",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are providing advance work for a corporate executive who will attend a fundraising gala at a downtown hotel. The event organizer tells you that the hotel's event security team will handle all access control and that you 'don't need to worry about the venue.' You arrive at the hotel two hours before the event and observe that: the main entrance has no visible security personnel, the hotel has four unmonitored side entrances, the event room has one emergency exit that is propped open with a doorstop, and a person of concern identified in your threat assessment has RSVP'd to the event under a different name.",
    "reflection": "What do you do with each of these findings? How do you communicate the person-of-concern identification to the event organizers without causing a scene? What recommendations do you make to your client regarding attending the event? Who has authority to cancel or modify attendance plans based on your advance findings?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Principal Protection Pre-Deployment Checklist",
    "items": [
      { "label": "Licensing Confirmed", "description": "Confirm all personnel performing armed protective functions hold current individual armed security licenses and are employed by a licensed agency. Confirm all relevant licenses are not within 30 days of expiration." },
      { "label": "Threat Assessment Completed and Briefed", "description": "Confirm threat assessment has been delivered to all protective team members. Persons of concern, threat levels, and specific indicators to monitor have been briefed to all personnel." },
      { "label": "Advance Package Delivered", "description": "Route survey, venue assessment, and vulnerability report delivered to team lead at least 2 hours before principal movement (24+ hours for high-risk engagements)." },
      { "label": "Communication Protocol Established", "description": "All team members have working communications equipment on the same channel. Challenge words and emergency protocols confirmed. Emergency services contacts confirmed for each venue." },
      { "label": "Abort and Escalation Criteria Defined", "description": "Define in advance: what threat indicators trigger route change, what indicators trigger extraction, what indicators trigger law enforcement notification. Everyone on the team knows the criteria." }
    ],
    "narrationUrl": null
  }
]
$slides_pi22$
);

-- ── PI-23: Proper Business Practices ─────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-23', 'Proper Business Practices',
$slides_pi23$
[
  {
    "type": "slide",
    "heading": "Georgia PI Agency Licensing: What You Must Have Before Taking Cases",
    "body": "Before accepting a single paid investigative engagement in Georgia, two licenses must be in place. You as an individual must hold a current GBPDSA Private Detective License. The agency through which you accept the engagement must hold a current GBPDSA Private Detective Agency License. If you operate as a sole proprietor, you hold both — but both licenses are required separately. You cannot use your individual PI license to operate a business under a trade name without also obtaining the agency license for that business entity. Attempting to operate through a corporate entity without the entity's own agency license — even if you personally hold your individual license — is an unlicensed practice violation under OCGA 43-38-18. Before forming a partnership or corporation to operate your PI agency, confirm the licensing requirements with the GBPDSA directly.",
    "keyPoints": [
      "Two licenses required: individual PI license + agency license for the business entity",
      "Sole proprietor: holds both — but must obtain both separately",
      "Trade name operation: agency license required for the business entity, not just the individual",
      "Partnership/corporation: confirm business entity licensing requirements with GBPDSA",
      "Unlicensed practice (OCGA 43-38-18): misdemeanor first offense, felony on repeat"
    ],
    "legalRef": "OCGA 43-38-4 | OCGA 43-38-18",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Engagement Agreements: Contract Essentials to Protect Both Parties",
    "body": "The engagement agreement is the single most important document in your client relationship. A professionally drafted engagement agreement protects you from billing disputes, scope creep, and claims of unlawful conduct. Essential elements: identification of the parties, scope of the investigation (specifically what is and is not authorized), fee structure (hourly rate, estimated hours, retainer amount, expense authorization limit), invoicing and payment schedule, termination rights (either party may terminate with written notice), confidentiality obligations (both parties' confidentiality duties), limitation of liability (cap your agency's exposure for consequential damages), and dispute resolution (arbitration or litigation forum, governing law as Georgia). Have a licensed attorney draft your template. Review and customize the scope and fee provisions for every engagement — the template is a starting point, not a boilerplate.",
    "keyPoints": [
      "Scope: what is authorized AND what is not — both explicitly defined",
      "Fee structure: hourly rate, retainer, expense limit — no ambiguity",
      "Termination: either party, written notice — define notice period",
      "Limitation of liability: cap your consequential damage exposure",
      "Attorney-drafted template: essential for enforceability in Georgia courts"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Billing and Retainers: Industry Standards and Trust Accounts",
    "body": "The standard billing model for PI engagements is a retainer against which hourly fees and expenses are applied, with replenishment required when the retainer is exhausted. Industry standard retainer amounts vary by engagement type and market: domestic matters typically start at $1,500–$3,000; corporate matters at $3,000–$5,000 or more. Retainer funds belong to the client until earned — they should be held in a trust or client funds account separate from your agency's operating funds. Commingling client funds with operating funds is an ethics violation and a potential conversion claim. Issue an itemized billing statement at regular intervals — weekly for active engagements, monthly for ongoing matters — showing time spent, tasks performed, expenses incurred, and retainer balance. A client who cannot track what they have paid for is a client who will dispute your final invoice.",
    "keyPoints": [
      "Retainer model: advance against which earned fees are applied — standard industry practice",
      "Client funds: held in separate trust account — not commingled with operating funds",
      "Commingling: ethics violation + potential conversion claim",
      "Billing statements: itemized, at regular intervals — weekly for active engagements",
      "Itemization: time, task, expenses, retainer balance — no ambiguity"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Insurance Requirements: E&O, General Liability, and Workers' Comp",
    "body": "A professionally operated PI agency carries three categories of insurance. Errors and Omissions (E&O) insurance — also called professional liability insurance — covers claims that your professional services caused harm through negligence, errors, or omissions. This is the coverage that protects you if a client claims your investigation was conducted incompetently or produced incorrect results. General liability insurance covers bodily injury and property damage claims arising from your business operations — a subject who claims injury during a surveillance encounter, or property damage to a vehicle during mobile surveillance, would be covered here. Workers' compensation insurance is legally required in Georgia for businesses with three or more employees. Confirm your coverage limits with a licensed insurance broker experienced in professional services. Underinsurance in this profession is a career-ending risk.",
    "keyPoints": [
      "E&O (professional liability): covers negligence, errors, omissions in your professional services",
      "General liability: bodily injury and property damage arising from operations",
      "Workers' compensation: legally required with 3+ employees in Georgia",
      "Coverage limits: confirm with professional services insurance broker",
      "Underinsurance: a single uninsured civil judgment can end your agency"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. A client contacts you after receiving your invoice for 47 hours of investigation at $75/hour plus $340 in expenses. The client says they agreed to 'about 20 hours' in the initial conversation and disputes the remaining 27 hours. They also dispute $200 of the expense claims, saying they never authorized meals. Your engagement agreement specifies your hourly rate but does not include an estimated hours cap. Your billing records show detailed time entries. Your expense claims include receipts for fuel and two meals during surveillance days.",
    "reflection": "What does your engagement agreement resolve and what does it leave open? What is the legal status of the hour count if no cap was specified in writing? Were the meals a reimbursable expense if meal reimbursement was not explicitly addressed in the agreement? What lesson does this dispute teach about engagement agreement drafting, and how do you resolve this dispute with the client?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Agency Compliance and Business Readiness Checklist",
    "items": [
      { "label": "Both Licenses Current", "description": "Verify individual PI license and agency license are current, matching the business entity under which you are accepting engagements. Renew both before expiration — no grace period." },
      { "label": "Engagement Agreement Template Attorney-Reviewed", "description": "Confirm your standard engagement agreement template has been reviewed by a Georgia-licensed attorney within the past 2 years. Confirm it includes scope, fees, termination, limitation of liability, and dispute resolution." },
      { "label": "Client Trust Account Maintained Separately", "description": "Confirm retainer funds are held in a dedicated client trust account, not in operating funds. Reconcile the trust account against all open engagements monthly." },
      { "label": "Insurance Coverage Current and Adequate", "description": "Confirm E&O, general liability, and (if applicable) workers' compensation policies are current. Review coverage limits with your broker annually." },
      { "label": "Billing Records Contemporaneous", "description": "Confirm all time entries are being recorded contemporaneously — at the time of the work, not reconstructed at billing time. A billing dispute is won or lost on the detail and timing of your records." }
    ],
    "narrationUrl": null
  }
]
$slides_pi23$
);

-- ── PI-24: Final Accreditation Examination ────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-24', 'Final Accreditation Examination',
$slides_pi24$
[
  {
    "type": "slide",
    "heading": "Capstone Review: Legal Authority, Ethics, and Evidentiary Standards",
    "body": "This module is your final preparation for the MJM 2026 Private Detective Accreditation Examination. The examination tests mastery across all 23 content modules with emphasis on the four pillars that underpin every professional PI engagement in Georgia. First: Legal Authority — you must know precisely what a licensed PI can and cannot do under Georgia law, including OCGA Title 43, Chapter 38, the criminal exposure statutes in Title 16, and the federal laws (DPPA, FCRA, ECPA, CFAA) that constrain your information-gathering methods. Second: Ethics — you must demonstrate that the GBPDSA Code of Conduct governs your professional choices, including in situations where a client is directing you to do otherwise. Third: Evidentiary Standards — you must produce evidence that will survive authentication challenges, chain of custody scrutiny, and Daubert methodology review. Fourth: Business Compliance — your agency must be properly licensed and insured before any work begins.",
    "keyPoints": [
      "Pillar 1 — Legal Authority: PI scope under OCGA Title 43 + criminal exposure under Title 16 + federal law",
      "Pillar 2 — Ethics: GBPDSA Code of Conduct governs even under client pressure",
      "Pillar 3 — Evidentiary Standards: authentication, chain of custody, Daubert methodology",
      "Pillar 4 — Business Compliance: agency licensing, insurance, engagement agreements",
      "Examination: 10 questions, 3 critical, 85% passing threshold"
    ],
    "legalRef": "OCGA Title 43, Chapter 38 | GA Admin Code 509-3-.06",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Surveillance Law Summary: The Rules That Govern Every Assignment",
    "body": "Surveillance is the most legally exposed PI activity. Every surveillance assignment must pass three legal tests before it begins. Test 1 — Reasonable Expectation of Privacy: confirm your observation is directed only at spaces where the subject has no reasonable expectation of privacy. Public streets, publicly visible areas, and commercial spaces open to the public pass this test. Bedrooms, enclosed vehicles, hotel rooms, and private offices do not. Test 2 — Recording Consent: if audio recording is involved, confirm either you are a party to the conversation (one-party consent) or you have consent from a party. If neither applies, do not record audio. Test 3 — GPS and Tracking: confirm the vehicle owner has consented or you have a court order. These three tests apply simultaneously on every assignment. Passing two of three is not sufficient. A single failure creates felony exposure.",
    "keyPoints": [
      "Test 1: Reasonable expectation of privacy — public space? lawful; private space? prohibited",
      "Test 2: Recording consent — participant (lawful) or consented party (lawful) or neither (felony)",
      "Test 3: GPS tracking — vehicle owner consent OR court order required",
      "All three tests simultaneously — two of three is not sufficient",
      "Single failure = OCGA 16-11-62 or OCGA 16-11-60.1 felony"
    ],
    "legalRef": "OCGA 16-11-62 | OCGA 16-11-60.1 | OCGA 16-11-66",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Documentation and Testimony: What the Court Will Scrutinize",
    "body": "A PI's effectiveness in legal proceedings is determined not by what they found but by how well they documented and preserved what they found. Courts and opposing counsel scrutinize five elements of PI evidence: Authentication (can you prove the evidence has not been altered since collection?), Chain of Custody (can you document every person who has had access to the evidence?), Contemporaneity (were your notes written at the time of observation, or reconstructed?), Consistency (do your field notes, photographs, and report all tell the same story?), and Methodology (was your investigation conducted in a way that produces reliable results?). These five elements form the framework for opposing counsel's challenge. They also form your preparation framework: if your documentation satisfies all five, your testimony will be credible and your evidence will be admitted.",
    "keyPoints": [
      "Authentication: hash verification, metadata integrity, signed chain of custody",
      "Chain of custody: documented, unbroken, every access logged",
      "Contemporaneity: field notes written in real time, voice memos retained",
      "Consistency: field log, photos, and report all tell the same factual story",
      "Methodology: documented, standardized, defensible under Daubert challenge"
    ],
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Pre-Exam Readiness Checklist",
    "items": [
      { "label": "Legal Authority Modules Reviewed", "description": "Review PI-01 (GBPDSA licensing), PI-04 (felonies and misdemeanors), PI-05 (laws of arrest), PI-06 (search and seizure), and PI-11 (surveillance law). These are the highest-weighted legal authority topics on the examination." },
      { "label": "Ethics Scenarios Reviewed", "description": "Review PI-02 (ethics code), PI-08 (coercion prohibition), PI-15 (perjury prohibition), and PI-18 (entrapment prohibition). The examination includes scenario-based questions on these topics." },
      { "label": "Evidentiary Standards Reviewed", "description": "Review PI-12 (videography and metadata), PI-13 (note taking), PI-14 (chain of custody), and PI-15 (courtroom testimony). The examination tests documentation protocol and chain of custody requirements." },
      { "label": "Federal Law Reviewed", "description": "Review PI-09 (DPPA), PI-10 (FCRA), PI-11 (ECPA/Wiretap Act), and PI-21 (CFAA). The examination includes questions on federal statutes that limit PI information-gathering methods." },
      { "label": "Business Practices Reviewed", "description": "Review PI-23 (licensing, engagement agreements, insurance). The examination tests licensing requirements and agency compliance obligations." }
    ],
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "GA GBPDSA 509-3-.06 Compliance Verification Checklist",
    "items": [
      { "label": "72-Hour Curriculum Completed", "description": "Confirm completion of all 24 modules (PI-01 through PI-24) totaling 72 curriculum hours. Your completion record on this platform constitutes your official MJM 2026 training log." },
      { "label": "Individual PI License Current", "description": "Confirm your GBPDSA Private Detective Individual License is current and not within 30 days of expiration at the time of examination completion." },
      { "label": "Agency License Current (If Applicable)", "description": "Confirm the agency license for any business entity under which you accept PI engagements is current and held by the correct entity." },
      { "label": "85% Passing Score on Final Examination", "description": "The Final Accreditation Examination requires a minimum score of 85%. Three questions are designated Critical Fail — a wrong answer on any critical question triggers a 24-hour cooling period before retake." },
      { "label": "Certification Request Submitted", "description": "Upon passing the Final Examination, your completion record will be reviewed and certified by the MJM 2026 Program Director. Certificate issuance requires Program Director sign-off. The certification date recorded is the date of examination passage — this date is permanent and does not change upon subsequent certificate printing." }
    ],
    "narrationUrl": null
  }
]
$slides_pi24$
);
