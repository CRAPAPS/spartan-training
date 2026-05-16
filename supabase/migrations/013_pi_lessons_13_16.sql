-- ============================================================
-- 013_pi_lessons_13_16.sql
-- Slide content for PI-13 through PI-16
-- MJM 2026 Private Detective curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('PI-13','PI-14','PI-15','PI-16');

-- ── PI-13: Proper Note Taking ─────────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-13', 'Proper Note Taking',
$slides_pi13$
[
  {
    "type": "slide",
    "heading": "The Legal Weight of Contemporaneous Notes",
    "body": "Contemporaneous notes — notes written at or near the time of the event they describe — carry significantly more evidentiary weight than notes reconstructed from memory later. Courts and opposing counsel know this. A field log written during a surveillance session, timestamped, and consistent with the photographic metadata is a strong evidentiary foundation. Notes reconstructed three days after the fact, typed neatly from memory, are vulnerable to impeachment on the grounds that they have been edited, supplemented, or fabricated. Write your notes in real time. Accept the messiness of field writing — crossed out words, time corrections, and handwriting pressure all authenticate the contemporaneous nature of the record. Do not recopy your field notes into a 'cleaner' version that replaces the original. If you type up notes for readability, retain the originals and note that the typed version is a transcription.",
    "keyPoints": [
      "Contemporaneous = written at or near the time of the event",
      "Field log written in real time carries far more evidentiary weight than reconstructed notes",
      "Messy handwriting, corrections, and timestamps authenticate contemporaneity",
      "Never discard original field notes — retain alongside any typed transcription",
      "If you type a transcription, note explicitly that it is a transcription with the original retained"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Log Format Standards: Time, Date, Location, Action, Verbatim",
    "body": "Every field log entry should contain five elements: Time (exact, to the minute — not 'around 3pm'), Date (full date — not 'Tuesday'), Location (specific address, GPS coordinate, or sufficiently detailed description), Action (precisely what was observed — not 'subject was acting suspicious' but 'subject exited south door, walked to blue Ford F-150 bearing GA plate XXX-1234, lifted a 40-lb moving box from truck bed, carried it up three exterior stairs to Unit 4'), and Verbatim (exact words spoken if any conversation was observed or participated in). Avoid characterizing observations: 'appeared to be in pain' is an opinion. 'Walked with a pronounced limp on the left side, unable to straighten the left knee fully while walking up three stairs' is an observation. Courts strike opinions from PI testimony. They admit specific, detailed factual observations.",
    "keyPoints": [
      "Five required elements: Time, Date, Location, Action, Verbatim",
      "Time: exact minute — never 'around' or approximate",
      "Action: specific factual description — avoid characterizations and opinions",
      "Opinion vs. observation: 'appeared in pain' (opinion) vs. 'walked with left-sided limp' (observation)",
      "Verbatim: exact words spoken — quotation marks in notes signal court-quality precision"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Digital vs. Handwritten Notes: Pros, Cons, and Admissibility",
    "body": "Handwritten field notes have two primary advantages over digital: they are less vulnerable to metadata manipulation challenges (there is no 'last edited' timestamp on a paper notebook), and they are instinctively recognized by juries as a contemporaneous record. Their disadvantages are physical — damage, loss, illegibility. Digital notes (tablet, voice-to-text, notes app) offer searchability and backup but introduce questions: was the file edited after creation? Does the metadata reflect the actual creation time? Voice-recorded memos are admissible when properly authenticated and transcribed, but the original recording must be retained. For high-stakes cases, the recommended standard is handwritten field notes with a contemporaneous voice memo as a corroborating backup — two independent records that cannot both be successfully challenged at the same time.",
    "keyPoints": [
      "Handwritten: less metadata vulnerability, recognized by juries as contemporaneous",
      "Digital: searchable and backed up but subject to 'last edited' metadata scrutiny",
      "Voice memo: admissible when authenticated — retain original recording, provide transcription",
      "Best practice for high-stakes cases: handwritten + voice memo corroboration",
      "Never delete voice memos — they are discovery-responsive original records"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Protecting Notes from Discovery: Work Product Doctrine",
    "body": "The attorney work product doctrine under OCGA 9-11-26(b)(3) protects documents prepared in anticipation of litigation from opposing discovery in most circumstances. This protection can extend to PI notes and reports when you are working under attorney direction for a matter in active litigation or reasonably anticipated litigation. However, the doctrine has two tiers: opinion work product (your mental impressions, conclusions, theories) receives nearly absolute protection; fact work product (underlying observations, logs, photographs) receives qualified protection that can be overcome by a showing that the information is not obtainable through other means. Know which of your materials fall into which category before a subpoena arrives. If you are not working under attorney direction, the work product doctrine does not protect your materials at all.",
    "keyPoints": [
      "Work product doctrine: OCGA 9-11-26(b)(3) — protects litigation-prepared documents from opposing discovery",
      "Requires: working under attorney direction for actual or anticipated litigation",
      "Opinion work product: mental impressions, theories — nearly absolute protection",
      "Fact work product: observations, logs — qualified protection, can be overcome",
      "Working directly for client (not attorney): no work product protection at all"
    ],
    "legalRef": "OCGA 9-11-26(b)(3) | Hickman v. Taylor (1947)",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Opposing counsel in a civil case sends you a subpoena requesting your complete case file, including all field notes, photographs, video, and 'any documents reflecting your analysis, conclusions, or opinions regarding the subject.' You are working under a retaining attorney's direction and the case is actively in litigation. Your file contains: timestamped field logs, surveillance video, your personal analysis of the subject's behavior patterns, and a draft summary memo you wrote for the retaining attorney identifying what you believed the most significant observations were.",
    "reflection": "Analyze each component: which materials must be produced, which may be withheld, and which are in a gray area? Who decides what is produced — you or the retaining attorney? What should you do before complying with the subpoena, and what is the professional risk of producing attorney-protected materials without authorization?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Field Notes Compliance Checklist",
    "items": [
      { "label": "Notes Started at Scene Arrival", "description": "First log entry records exact time of arrival at observation position, date, weather, and equipment deployed. Do not reconstruct the start time later." },
      { "label": "Five Elements Present in Each Entry", "description": "Review each entry before closing the log: Time, Date, Location, Action (specific, not characterized), Verbatim (if applicable). Missing elements weaken the entry." },
      { "label": "Original Notes Retained", "description": "Originals never destroyed. If transcribed to typed format, original is retained with a notation on the transcription that it is a copy and the original is in file." },
      { "label": "Voice Memos Archived", "description": "All voice memos from the field are transferred to case storage and logged in the evidence chain of custody. Original recording retained — never replaced by transcription alone." },
      { "label": "Subpoena Response Plan in Place", "description": "Before any case goes to litigation, confirm with retaining attorney which materials are work product protected and what the response protocol is if a subpoena arrives. This is agreed in advance, not improvised at service." }
    ],
    "narrationUrl": null
  }
]
$slides_pi13$
);

-- ── PI-14: Case Management & Report Writing ───────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-14', 'Case Management & Report Writing',
$slides_pi14$
[
  {
    "type": "slide",
    "heading": "Case File Architecture: Intake to Closure",
    "body": "A professionally managed case file has a consistent structure from the first client contact to the final billing close-out. The file should be organized in sections: Intake (engagement agreement, client ID verification, scope definition, retainer receipt), Investigation Materials (field logs, photographs, video evidence index, surveillance notes), Communications (all written communications with the client, attorney, and any witnesses, dated and retained), Reports (all interim and final reports issued, with version numbers and delivery dates), Billing (time entries, expense receipts, invoices, payment records), and Closure (final status, disposition of evidence, retention schedule notation). This architecture serves two purposes: it creates the paper trail that protects you in disputes, and it organizes the case so that any other licensed PI in your agency can pick it up and continue it without losing information.",
    "keyPoints": [
      "Sections: Intake, Investigation Materials, Communications, Reports, Billing, Closure",
      "Every section populated before case is considered closed",
      "Consistent architecture: any PI in your agency can continue the case from the file alone",
      "Case file = your legal protection in client disputes, Board investigations, and litigation",
      "Closure notation: final status, where evidence is stored, how long records will be retained"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The Investigative Report: Structure, Tone, and Legal Standards",
    "body": "An investigative report is a professional document that will be read by attorneys, insurance adjusters, judges, and juries. Its tone must be factual, objective, and precise — not persuasive, inflammatory, or emotionally colored. Structure: Executive Summary (one paragraph stating what was investigated, the period of investigation, and the key finding), Investigation Methodology (how the investigation was conducted, dates, methods, locations), Findings (specific factual observations, documented with reference to supporting evidence), Conclusions (limited to what the facts directly support — not speculation), and Supporting Evidence (index of all attached photographs, video clips, and documents). Write in the past tense. Use exact times, dates, and measurements. Every factual assertion in the report must be traceable to a specific piece of supporting evidence in your file.",
    "keyPoints": [
      "Tone: factual, objective, precise — never persuasive, emotional, or speculative",
      "Structure: Executive Summary → Methodology → Findings → Conclusions → Evidence Index",
      "Past tense throughout: 'Subject exited' not 'Subject exits'",
      "Conclusions limited to what facts directly support — no speculation",
      "Traceability: every assertion must link to specific supporting evidence in the file"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Chain of Custody Documentation: Every Handoff, Every Time",
    "body": "Chain of custody is the documented, unbroken record of who had access to a piece of evidence from the moment it was collected to the moment it is presented in court. A gap in the chain — an undocumented transfer, an unlocked storage period, an unacknowledged copy — creates a vulnerability that opposing counsel will exploit to challenge the evidence's authenticity. For physical evidence: collect, package, label, photograph, and log immediately. For digital evidence: hash at collection, log every access, provide access only to authorized persons on a recorded basis. For surveillance footage: original files remain with you in secure storage; copies delivered to retaining attorney are logged out with a receipt. Every person who touches evidence signs a chain of custody log entry noting the time and purpose of access.",
    "keyPoints": [
      "Chain of custody: documented record of every person who accessed evidence from collection to court",
      "Gap in chain = authentication vulnerability — opposing counsel will challenge",
      "Physical evidence: collect → package → label → photograph → log",
      "Digital evidence: hash at collection, log every access, deliver copies with receipt",
      "Every access logged: who, when, purpose — including your own access to your own files"
    ],
    "callout": { "type": "warning", "text": "The phrase 'the evidence was in my possession' is not a chain of custody. A chain of custody is a written record with names, dates, and times. Without documentation, you cannot prove the evidence has not been tampered with." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Invoicing and Billing Records: What Must Be Kept and Why",
    "body": "Billing disputes are among the most common source of conflict between PIs and clients. A properly maintained billing record eliminates nearly all of them. Time entries must be made contemporaneously — not reconstructed at billing time. Entries should specify the task performed, not just 'investigation.' Expense receipts must be retained for every reimbursable cost: fuel, tolls, hotel, equipment rental. Invoices should reference the engagement agreement and specify the billing period. Georgia law does not mandate a specific document retention period for PI business records, but the statute of limitations on contract disputes is six years under OCGA 9-3-24. Maintain billing records for a minimum of six years. For cases that result in litigation, retain indefinitely until the final disposition is confirmed in writing.",
    "keyPoints": [
      "Time entries: contemporaneous, specific task descriptions — not just 'investigation'",
      "Receipts: retain every reimbursable expense receipt",
      "Invoices: reference engagement agreement, specify billing period, include task breakdown",
      "Retention minimum: 6 years (GA contract SOL under OCGA 9-3-24)",
      "Litigation cases: retain indefinitely until final written disposition confirmed"
    ],
    "legalRef": "OCGA 9-3-24 (contract statute of limitations)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Client Communications: What to Document and What Not to Say",
    "body": "Every client communication — email, text, voicemail, in-person meeting notes — is a potential exhibit in a future dispute. Write every client communication as if it will be read in court. Do not put case strategy, legal opinions, or speculation about the opposing party in writing unless you are communicating with a retaining attorney under privilege. Do not make promises in writing that you cannot keep: 'We will have this wrapped up by Friday' creates a breach of contract claim if Friday passes. Do not summarize findings in preliminary emails that contradict your final report. And critically: never communicate client identifying information or case details to anyone not authorized by the engagement agreement. A text message identifying your client to a friend because 'it was an interesting case' is a confidentiality breach and a GBPDSA violation.",
    "keyPoints": [
      "Write every communication as if it will be read in court — because it may be",
      "No speculation, strategy, or legal opinions in client-facing written communications",
      "No written promises on timing or outcomes — only confirmations of agreed scope",
      "Preliminary findings communicated informally must be consistent with final report",
      "Client identity and case details: shared only with persons authorized in the engagement agreement"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You delivered a final surveillance report to your client's attorney three weeks ago. Today, you receive a call from the opposing party's attorney who says they have subpoenaed your 'complete file' and will be taking your deposition next week. The client's attorney calls you back and says to 'lose the billing records' because the hours look excessive and the client is about to dispute the invoice anyway. Your file contains the original field logs, the surveillance footage, billing records, and multiple email exchanges with the client.",
    "reflection": "Analyze the attorney's instruction to lose the billing records. Is this instruction lawful? What exposure does complying create for you? Who has authority over your case file — you, the client, or the retaining attorney? What do you do in response to the subpoena, and what do you do about the attorney's instruction?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Your agency completed a domestic investigation six months ago. The case settled and was closed. The client now calls and says they are reopening litigation and needs you to testify about your findings. When you pull the file, you discover that while your field logs are complete, your billing records from weeks 3 and 4 of the investigation are missing — you believe they were accidentally deleted during a computer migration. The opposing party's attorney has already subpoenaed your complete billing records.",
    "reflection": "What is your obligation regarding the missing billing records? Can you reconstruct them from memory? What must you disclose to the retaining attorney about the gap? How does this affect your credibility as a witness at trial? What procedural steps should you take immediately upon discovering the gap?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Report Quality Control Checklist",
    "items": [
      { "label": "Every Assertion Sourced", "description": "Before finalizing any report, trace every factual statement to a specific piece of supporting evidence — field log entry, photograph, video timestamp. If you cannot source it, do not include it." },
      { "label": "Conclusions Limited to Facts", "description": "Review conclusions section: confirm every conclusion is directly supported by documented findings. Remove any conclusion that requires inference, speculation, or information not in your evidence file." },
      { "label": "Tone Reviewed for Bias", "description": "Read the report as opposing counsel will read it. Remove characterizations, emotional language, and any phrasing that could be read as advocacy for the client's position rather than neutral reporting." },
      { "label": "Evidence Index Matches File", "description": "Confirm every exhibit referenced in the report exists in the case file with proper chain of custody documentation. A report that references missing exhibits fails authentication." },
      { "label": "Final Version Logged", "description": "The final report version is logged into the case file with date issued, recipient, and delivery method. If subsequent versions are issued, all versions are retained with version numbers." }
    ],
    "narrationUrl": null
  }
]
$slides_pi14$
);

-- ── PI-15: Courtroom Testimony ────────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-15', 'Courtroom Testimony',
$slides_pi15$
[
  {
    "type": "slide",
    "heading": "Expert vs. Fact Witness: What Role a PI Typically Plays",
    "body": "In legal proceedings, witnesses are classified as either fact witnesses or expert witnesses. A fact witness testifies about what they personally observed: 'I observed the subject exit the building at 10:14 AM and walk to the vehicle.' An expert witness is qualified by the court to offer opinions in a specialized field: 'Based on the surveillance footage and my fifteen years of investigative experience, the subject's gait pattern is inconsistent with the claimed disability.' Most private investigators testify as fact witnesses — you observed specific things and you report them precisely. Expert witness status requires formal qualification by the court under Daubert or Frye standards and is only appropriate for specific methodological testimony. Do not volunteer expert opinions when testifying as a fact witness. Stay in your lane.",
    "keyPoints": [
      "Fact witness: testifies to personal observations only — no opinions",
      "Expert witness: court-qualified to offer opinions in a specialized field",
      "Most PI testimony is fact witness testimony",
      "Expert qualification requires Daubert/Frye analysis by the court",
      "Do not volunteer expert opinions as a fact witness — opposing counsel will impeach"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Direct Examination: Presenting Your Investigation Clearly",
    "body": "Direct examination is questioning by the attorney who retained you. Its purpose is to present your findings clearly, credibly, and in a sequence that tells the story of the investigation. Prepare by reviewing your complete case file at least 24 hours before testimony — not 5 minutes before. Meet with the retaining attorney in advance to understand the order of questioning and which exhibits will be introduced through you. On the stand, answer the question asked — not the question you wish had been asked, and not a longer narrative than the question requires. Speak directly to the jury when explaining findings, not to the attorney. Use precise language: 'approximately 35 feet' rather than 'not far.' If you do not remember something exactly, say so. 'I would have to check my field notes' is an acceptable answer; guessing is not.",
    "keyPoints": [
      "Review complete case file 24 hours before — not minutes before",
      "Meet with retaining attorney in advance: exhibit order, questioning sequence",
      "Answer the question asked — not more, not less",
      "Speak to the jury when explaining findings, not to the attorney",
      "'I would need to check my notes' is acceptable — guessing is not"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Cross-Examination: Impeachment, Gaps, and How to Hold Your Ground",
    "body": "Cross-examination is the opposing attorney's opportunity to undermine your credibility and the weight of your evidence. The most common cross-examination attacks on PI testimony are: gaps in surveillance coverage ('So you did not observe the subject for the 2 hours between 11am and 1pm?'), inconsistencies between your report and your field notes, prior investigative errors or Board complaints, and methodology challenges ('You testified you were 200 feet away — how did you determine that distance?'). Hold your ground on facts you documented contemporaneously. Acknowledge gaps honestly — trying to paper over gaps makes you appear less credible. Never argue with opposing counsel. Answer the question. If the question is misleading, say 'The question does not accurately characterize my testimony' and explain why — once, calmly. Let the retaining attorney rehabilitate on redirect.",
    "keyPoints": [
      "Common attacks: coverage gaps, report/notes inconsistencies, prior complaints, methodology",
      "Hold your ground on contemporaneous documented facts — be certain, not defensive",
      "Acknowledge gaps honestly — denying obvious gaps destroys credibility",
      "Never argue with opposing counsel — answer and let retaining attorney redirect",
      "'That does not accurately characterize my testimony' — use once, explain, stop"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Perjury: The Absolute Line — Truth Over Client Loyalty",
    "body": "Perjury under OCGA 16-10-70 is the willful making of a false statement under oath in a judicial proceeding. It is a felony carrying one to ten years in prison. No client relationship, financial incentive, or attorney instruction can justify perjury. The client who hired you has an interest in winning their case. You have an interest in giving truthful testimony. These are not the same interest and they sometimes conflict. When they conflict, you must testify truthfully — regardless of consequence to the case. Shading your testimony, emphasizing certain facts and minimizing others at the client's direction, or testifying to a certainty you do not actually have are all forms of testimonial manipulation that border on perjury. If an attorney asks you to testify in a way that you know is false, refuse. Contact your own counsel if the pressure continues.",
    "keyPoints": [
      "Perjury: willful false statement under oath — felony, 1–10 years, automatic license revocation",
      "No client or attorney instruction can justify or compel perjury",
      "Testimonial shading: emphasizing/minimizing facts at client direction borders on perjury",
      "Testifying to certainty you do not have: false testimony even if not an outright lie",
      "If attorney asks for false testimony: refuse, document, consult your own counsel"
    ],
    "legalRef": "OCGA 16-10-70 (perjury) | OCGA 16-10-71 (subornation of perjury)",
    "callout": { "type": "warning", "text": "An attorney who instructs you to testify falsely is committing subornation of perjury under OCGA 16-10-71 — a separate felony. You are not obligated to protect them by complying. You are legally required to refuse." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Daubert/Frye Standards: When PI Methodology Faces Challenge",
    "body": "When a PI is offered as an expert witness — or when the methodology underlying PI fact testimony is challenged — courts apply reliability standards. Federal courts and Georgia courts (which adopted the Daubert standard in 2013) require that scientific, technical, or other specialized testimony be based on sufficient facts, reliable methodology, and proper application of that methodology to the case facts. For PI testimony, a Daubert challenge might question whether your surveillance methodology produces reliable identification of subjects, whether your distance estimates are verifiable, or whether your voice memo transcriptions accurately represent what was said. Defend your methodology by documenting it: camera specifications, calibrated distances, synchronized timestamps, and reproducible procedures. A methodology that is documented, consistent, and industry-standard survives Daubert challenge far more reliably than an improvised approach.",
    "keyPoints": [
      "Georgia adopted Daubert in 2013 for expert testimony reliability analysis",
      "PI Daubert challenges: subject identification methods, distance estimates, transcription accuracy",
      "Defense: documented, consistent, industry-standard methodology",
      "Camera specs, calibrated distances, synchronized timestamps all serve as Daubert evidence",
      "Improvised methodology that was not documented is nearly impossible to defend"
    ],
    "legalRef": "Daubert v. Merrell Dow Pharmaceuticals (1993) | OCGA 24-7-702 (Georgia Daubert)",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are testifying in a civil trial about surveillance you conducted. During cross-examination, opposing counsel presents a photograph taken at the location on the same day as your surveillance — from what appears to be a business security camera — that shows your surveillance vehicle parked in a position different from where you recorded it in your field log. The discrepancy is about 50 feet. Opposing counsel suggests you fabricated your field log position to make the surveillance appear to have been conducted from a location with a clearer view of the subject.",
    "reflection": "How do you explain the discrepancy? What evidence do you have in your case file that can corroborate your field log position entry? How do you respond under cross-examination without appearing defensive or dishonest? What should you have done during the surveillance that would have prevented this challenge?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. The retaining attorney calls you the evening before your scheduled testimony. She says that after reviewing the case, she believes the jury will respond better if you testify that you were certain the subject could see clearly without glasses rather than saying, as your notes reflect, that you observed the subject sometimes squinting. She says to 'just simplify it' and say you observed no vision difficulties. She says this is 'not a significant difference' and 'won't hurt anyone.'",
    "reflection": "Analyze the attorney's request. Is this perjury, testimonial shading, or a reasonable simplification? What is the specific harm in simplifying in the way she describes? What do you say to the attorney tonight, and what do you say on the stand tomorrow? What documentation should you create about this conversation?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Pre-Testimony Preparation Checklist",
    "items": [
      { "label": "Complete File Review", "description": "Review the complete case file including field logs, photographs, video, and all reports at least 24 hours before testimony. Know exactly what you documented and where each piece of evidence is." },
      { "label": "Attorney Pre-Testimony Meeting", "description": "Meet with retaining attorney to confirm exhibit sequence, anticipated direct examination questions, and anticipated cross-examination topics. Confirm you will testify truthfully to everything, including gaps." },
      { "label": "Inconsistencies Identified and Explained", "description": "If there are any inconsistencies between your field notes and your formal report, identify them in advance and be prepared to explain them on cross. Discovering them on the stand is far worse." },
      { "label": "Distance and Measurement Corroboration", "description": "For any distances, measurements, or technical estimates you will testify to, confirm you have corroborating documentation — GPS data, map measurements, equipment specifications." },
      { "label": "Perjury Refusal Plan", "description": "If you receive any pre-testimony instruction that you believe would require you to testify falsely, document the instruction in writing before testimony, and confirm with your own legal counsel if necessary." }
    ],
    "narrationUrl": null
  }
]
$slides_pi15$
);

-- ── PI-16: Court Records Research ─────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-16', 'Court Records Research',
$slides_pi16$
[
  {
    "type": "slide",
    "heading": "Superior Court, State Court, Magistrate Court: What Each Holds",
    "body": "Georgia's court system has a tiered structure that determines where different types of records are filed. Superior Court is the court of general jurisdiction: it handles felony criminal cases, civil matters over $15,000, domestic relations (divorce, custody, adoption), and equity matters. Its records contain the richest material for PI research: criminal indictments, trial transcripts, civil complaint filings, divorce decrees, and court orders. State Court handles misdemeanor criminal cases and civil matters. Magistrate Court handles search warrants, arrest warrants, civil claims under $15,000, and preliminary hearings. Probate Court handles wills, estates, guardianship, and involuntary commitment proceedings. Each court's clerk maintains its own records, and access procedures differ by county and court type.",
    "keyPoints": [
      "Superior Court: felonies, major civil cases, domestic relations — richest PI research source",
      "State Court: misdemeanors and smaller civil cases",
      "Magistrate Court: warrants, preliminary hearings, small claims — excellent for background research",
      "Probate Court: estates, wills, guardianship — essential for asset and beneficiary research",
      "Each court's clerk: separate access procedure — know the county's specific process"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "PACER and Federal Records: Access, Cost, and Use",
    "body": "PACER (Public Access to Court Electronic Records) is the federal judiciary's online system for accessing federal court documents. It provides access to case filings in U.S. District Courts, U.S. Bankruptcy Courts, and U.S. Courts of Appeals. PACER requires account registration and charges a fee per page accessed (currently $0.10 per page, capped at $3.00 per document). For PI research, PACER is valuable for: federal criminal case records including indictments and plea agreements, civil case filings involving federal questions, bankruptcy filings showing debt and asset information, and appellate opinions that may reveal case history. PACER provides electronic access to dockets and filed documents — for exhibits and sealed records, a courthouse visit may still be required.",
    "keyPoints": [
      "PACER: federal court electronic records system — requires registration, $0.10/page fee",
      "Covers: U.S. District, Bankruptcy, and Appellate Courts",
      "PI uses: federal criminal records, civil filings, bankruptcy records, appellate history",
      "Sealed records and physical exhibits: may require in-person courthouse access",
      "PACER docket searches: search by party name across jurisdictions"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Clerk of Courts: In-Person Research Procedures in Georgia",
    "body": "Despite the growth of electronic records, a significant portion of Georgia court records remain accessible only through in-person clerk office visits. When visiting a clerk's office: bring photo ID, know the case name or party name, and have the case number if available. Clerks are not obligated to do your research for you — they facilitate your access to records but do not interpret or analyze them. Request access to the case index first to identify relevant case numbers. Then request the specific files. Most clerk offices allow you to request copies at a per-page fee. For large files, a personal copier or document scanner may save significant cost. Note that records in active criminal cases may be temporarily sealed during proceedings. Always document what you accessed, what you copied, and the date — the clerk's records log is not your chain of custody.",
    "keyPoints": [
      "Bring photo ID to every clerk visit",
      "Request case index first — identify case numbers before requesting files",
      "Clerks facilitate access — they do not research for you",
      "Copy fees: per-page charges — bring a document scanner app to reduce cost on large files",
      "Sealed records: active criminal cases may have temporary sealing — note and report the limitation"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Vital Records and Probate Files: When They Are Public",
    "body": "Vital records — births, deaths, marriages, and divorces — have variable access rules in Georgia. Death certificates are public records accessible by any person. Birth certificates require a showing of personal interest: the registrant, parent, legal guardian, or someone with a direct and tangible interest. Marriage licenses are recorded at the county probate court and are public records. Divorce decrees are filed in Superior Court and are generally public; however, some divorce-related records (financial affidavits, sealed settlement terms) may be restricted. Probate records — wills, estate inventories, letters testamentary — are public records filed in the county probate court where the decedent lived. Probate records are among the richest sources for asset investigation: they reveal the decedent's property, beneficiaries, debts, and the executor's actions.",
    "keyPoints": [
      "Death certificates: public — accessible by any person",
      "Birth certificates: restricted — personal interest required",
      "Marriage records: public — filed at county probate court",
      "Divorce decrees: public — financial affidavits and settlement terms may be sealed",
      "Probate records: public — estate inventories are goldmines for asset investigation"
    ],
    "legalRef": "OCGA 31-10-12 (birth certificates) | OCGA 31-10-16 (death certificates)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "FOIA Requests: Federal vs. Georgia Open Records Act",
    "body": "The federal Freedom of Information Act (FOIA), 5 U.S.C. § 552, provides public access to records held by federal executive agencies. FOIA requests are submitted directly to the agency holding the records, which must respond within 20 business days. For PI investigations involving federal agencies — FBI files, DEA records, federal employment records — FOIA is the primary access mechanism. Georgia's Open Records Act (OCGA 50-18-70 et seq.) is the state equivalent, applying to all Georgia state and local government agencies. Georgia ORA requests are simpler: submit in writing to the agency's Records Custodian; the agency must respond within 3 business days. Both statutes have significant exemptions — law enforcement investigative records, personal privacy, ongoing investigations — that frequently apply to the records most useful to PIs. Know the exemptions and anticipate partial responses.",
    "keyPoints": [
      "Federal FOIA: applies to federal executive agencies — 20 business day response",
      "Georgia ORA (OCGA 50-18-70): applies to all Georgia state and local agencies — 3 business day response",
      "Both have significant exemptions: law enforcement records, ongoing investigations, personal privacy",
      "Partial responses are common — requester must appeal or sue to obtain withheld portions",
      "Document every ORA/FOIA request: date sent, agency, specific records requested, response received"
    ],
    "legalRef": "5 U.S.C. § 552 (FOIA) | OCGA 50-18-70 (Georgia ORA)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Interpreting Court Documents: Pleadings, Orders, Judgments",
    "body": "Court records are written by attorneys for attorneys — their language and structure are not designed for lay readers. As a PI, you need working fluency in the key document types. A complaint is the document that initiates a civil lawsuit and states the plaintiff's claims. An answer is the defendant's formal response. A motion is a request to the court for a ruling. An order is the court's ruling on a motion. A judgment is the court's final decision on the merits. A writ of execution is the document that authorizes enforcement of a money judgment. For criminal cases: an indictment is the grand jury's formal charge; an information is the prosecutor's direct charge without grand jury; a plea agreement shows the terms under which a defendant pleaded guilty. For background research, the plea agreement is often more informative than the indictment.",
    "keyPoints": [
      "Complaint: initiates lawsuit, states claims",
      "Answer: defendant's response to complaint",
      "Order: court ruling on a specific motion",
      "Judgment: final decision on the case merits",
      "Plea agreement: in criminal cases, reveals the actual facts admitted by the defendant — often the most informative document in the file"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Your client needs a complete litigation history on a business subject — all civil cases where the subject was either a plaintiff or defendant in Georgia over the past 10 years. The subject has operated businesses under three different entity names. The client wants every case found, every judgment, and any information about assets revealed in the proceedings.",
    "reflection": "Design your complete research plan: which courts will you search, how will you search by the three entity names, how will you access cases in counties where you are not physically located, and what types of documents within each case file are most likely to reveal asset information? What is your estimated timeline for this research?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Court Records Research Checklist",
    "items": [
      { "label": "Court Identification Complete", "description": "Identify which courts — Superior, State, Magistrate, Probate, federal — hold records relevant to your research objective. Prepare separate access plans for each court type." },
      { "label": "Name Variants Identified", "description": "Before searching, compile all known name variations for the subject: legal name, aliases, maiden name, business entity names. Search each variant — missed variations mean missed cases." },
      { "label": "Electronic vs. In-Person Access Planned", "description": "Determine which records are electronically accessible (PACER, county electronic filing systems) and which require in-person visits. Build travel time into your research timeline." },
      { "label": "Copies Obtained and Logged", "description": "Every document copied from a court file is logged with the case number, document title, date copied, and court location. The copy is placed in the case file immediately upon return to the office." },
      { "label": "Sealed Record Notation", "description": "If you encounter a sealed or restricted record, note the restriction explicitly in your report: 'This record exists but is sealed by court order. Access requires a court order.' Do not represent that the record does not exist." }
    ],
    "narrationUrl": null
  }
]
$slides_pi16$
);
