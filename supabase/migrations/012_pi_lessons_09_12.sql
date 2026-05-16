-- ============================================================
-- 012_pi_lessons_09_12.sql
-- Slide content for PI-09 through PI-12
-- MJM 2026 Private Detective curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('PI-09','PI-10','PI-11','PI-12');

-- ── PI-09: Process Serving ────────────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-09', 'Process Serving',
$slides_pi09$
[
  {
    "type": "slide",
    "heading": "Legal Foundation: OCGA 9-11-4 and Service of Process Rules",
    "body": "Service of process is the formal procedure by which a party to a legal action is notified of the proceedings against them. In Georgia, the rules governing service are primarily found in OCGA 9-11-4 (Civil Practice Act) and, for criminal matters, in OCGA 17-7-1 et seq. Proper service is jurisdictionally mandatory — a court cannot exercise personal jurisdiction over a defendant who was not properly served. Defective service results in dismissal of the action, exposure of the serving party to sanctions, and potential liability for your agency. Private investigators who perform process service must understand not just how to locate subjects, but the specific procedural rules that make service legally valid in each type of proceeding.",
    "keyPoints": [
      "Service of process: formal legal notification that proceedings have been initiated",
      "OCGA 9-11-4: primary Georgia statute governing civil service of process",
      "Defective service: court lacks jurisdiction — case dismissed, agency exposed to sanctions",
      "Each type of process (summons, subpoena, writ) has specific service requirements",
      "Proof of service document is as important as the service itself — it is what the court relies on"
    ],
    "legalRef": "OCGA 9-11-4 | OCGA 17-7-1",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Personal vs. Substituted Service: Requirements and Validity",
    "body": "Personal service — placing the documents directly in the hands of the named recipient — is the gold standard and is always legally valid if properly executed. When personal service is not possible despite diligent effort, Georgia law authorizes substituted service: leaving copies with a person of suitable age and discretion residing at the defendant's usual place of abode, or by publication in specified circumstances under OCGA 9-11-4(f). Substituted service at a business address is permitted for corporate defendants or individual defendants who are served at their principal place of business. For substituted service to be valid, you must have made genuine attempts at personal service and documented each attempt with date, time, and result before resorting to substitution.",
    "keyPoints": [
      "Personal service: direct hand delivery to the named recipient — always valid if properly executed",
      "Substituted service: leave with suitable-age resident at defendant's abode",
      "Substituted service requires documented prior attempts at personal service",
      "Business service: valid for corporations and individuals served at their principal business address",
      "Service by publication: court order required — only when defendant cannot otherwise be located"
    ],
    "legalRef": "OCGA 9-11-4(d) | OCGA 9-11-4(f)",
    "callout": { "type": "warning", "text": "Handing documents to a minor, a neighbor, or a business acquaintance without first attempting personal service does not constitute valid substituted service. The case can be dismissed for defective service years later." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Civil Suits, Subpoenas, and Summonses: Types of Process",
    "body": "A summons is the document that notifies a defendant that a lawsuit has been filed against them and commands their appearance or response within a specified time. A subpoena is a court command requiring a person to appear and testify (subpoena ad testificandum) or to produce documents or things (subpoena duces tecum). Both can be served by a private process server in Georgia. A notice of deposition is a related document commanding a party to appear for sworn questioning outside of court. Wage garnishments, writs of execution, and tax liens are legal process documents that require specific service procedures. Know the type of process before you serve it — service of a subpoena has different requirements than service of a summons, and each error carries different consequences.",
    "keyPoints": [
      "Summons: notifies defendant of lawsuit, commands response within statutory timeframe",
      "Subpoena ad testificandum: commands personal appearance to testify",
      "Subpoena duces tecum: commands production of documents or tangible items",
      "Notice of deposition: compels sworn testimony outside of formal court proceedings",
      "Each document type has specific service requirements under Georgia Civil Practice Act"
    ],
    "legalRef": "OCGA 9-11-45 (subpoenas) | OCGA 9-11-4 (summons)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Skip Tracing to Locate Subjects for Service: Legal Limits",
    "body": "Skip tracing is the investigative process of locating a person who has left their known address — 'skipped' — to avoid service, creditors, or legal obligations. Legal skip tracing uses: public records (voter registration, property records, court records, business filings), credit header data accessible under permissible FCRA purposes, utility and postal records through authorized channels, social media analysis for location indicators, and database searches through licensed information providers. Illegal skip tracing includes: accessing private financial records without FCRA authorization, using pretexting to impersonate a government official or bank to extract account information, accessing social media accounts without consent, or purchasing data obtained through illegal means. The legal line in skip tracing is the same as everywhere else in PI work: public and consented-to sources are lawful; deception and unauthorized access are not.",
    "keyPoints": [
      "Legal sources: public records, credit headers (FCRA-permitted purpose), social media analysis",
      "FCRA permissible purpose for skip trace: legal process service is an authorized purpose",
      "Illegal: pretexting as government official or bank to extract private information",
      "Illegal: accessing any private account without authorization — CFAA federal crime",
      "Document your skip trace methodology: opposing counsel will ask how you found the subject"
    ],
    "legalRef": "Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 | Computer Fraud and Abuse Act (CFAA), 18 U.S.C. § 1030",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You have been hired to serve a civil summons on a defendant who has moved from their last known address. After three unsuccessful attempts at the prior address, you locate a new address through a database search. You go to the new address and a woman answers the door and says the defendant 'isn't home right now' but she lives there. Your client's attorney calls and says to just leave the papers with the woman because they need service completed by end of the week or the case will be dismissed.",
    "reflection": "What is the legal status of leaving the papers with the woman at this point? What additional documentation do you need before substituted service is valid? Is attorney pressure to complete service by a deadline a justification for cutting procedural corners? What do you document, and what do you tell the attorney?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Proof of Service Documentation Checklist",
    "items": [
      { "label": "Attempt Log Complete", "description": "Every service attempt — successful or not — is documented with date, time, address, observations, and result. This log is submitted with the proof of service and may be reviewed by the court." },
      { "label": "Recipient Identification Documented", "description": "For personal service: record how you identified the recipient — asked their name, they confirmed, physical description matches photo if available. For substituted: record name, relationship to defendant, and apparent age of the recipient." },
      { "label": "Document Condition Verified", "description": "Confirm all pages of the process documents are present and legible before service. A missing page or illegible exhibit can invalidate service." },
      { "label": "Proof of Service Executed Same Day", "description": "Complete the proof of service form on the day of service, while details are fresh. Sign under penalty of perjury — late completion with reconstructed details creates credibility problems." },
      { "label": "Copy Retained", "description": "Retain a photocopy of every document served, stamped with your file number, before handing the originals to the recipient. If documents are later disputed, you have a record of what was served." }
    ],
    "narrationUrl": null
  }
]
$slides_pi09$
);

-- ── PI-10: Sources of Information ─────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-10', 'Sources of Information',
$slides_pi10$
[
  {
    "type": "slide",
    "heading": "Public Records: What Is Available and How to Access It",
    "body": "Georgia's Open Records Act (OCGA 50-18-70 et seq.) creates a presumption that all records maintained by state and local government are open to public inspection. The records most useful to private investigators include: real property records (deeds, mortgages, liens at the county clerk's office), court records (civil filings, criminal histories, divorce decrees), voter registration records (name, address, party affiliation), business entity records (Secretary of State filings showing owners, registered agents), and UCC filings (showing secured creditors and collateral). Vital records — birth, death, and marriage — have access restrictions: death certificates are public; birth certificates require personal interest; marriage and divorce records are public at the county level. Understanding what is public, where it lives, and how to request it efficiently is foundational PI tradecraft.",
    "keyPoints": [
      "Georgia Open Records Act: presumption of access to all government-held records",
      "Real property: county clerk — deeds, liens, mortgages, tax assessments",
      "Court records: clerk of courts — civil filings, criminal histories, divorce decrees",
      "Business records: Secretary of State — owners, registered agents, annual reports",
      "Vital records: death certificates public; birth certificates restricted to parties with personal interest"
    ],
    "legalRef": "OCGA 50-18-70 et seq. (Open Records Act)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Database Searches: Commercial Providers and Legal Compliance",
    "body": "Commercial data aggregators — LexisNexis, IRB Search, TLO, Accurint, and similar platforms — compile public and quasi-public data from thousands of sources into searchable profiles. These platforms are licensed tools and require the subscribing PI to agree to terms of service that restrict use to lawful purposes. The data they provide typically includes: name variants and aliases, address history, phone numbers, vehicle registrations, business associations, court records, and sometimes credit header data. Access to these platforms requires a licensed PI account — using a login belonging to another person or entity, or misrepresenting your purpose to obtain access, is a federal Computer Fraud and Abuse Act violation as well as a GBPDSA ethics violation. The information returned by these databases must still be verified against primary sources before being stated as fact in a report.",
    "keyPoints": [
      "Commercial aggregators: LexisNexis, TLO, Accurint, IRB Search — require licensed PI credentials",
      "Data provided: address history, phone, vehicles, business associations, court records",
      "Misrepresenting your purpose to a data provider = CFAA violation + GBPDSA ethics violation",
      "Database results are starting points — verify against primary sources before reporting as fact",
      "Retain your search queries and result screenshots as part of the case file"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "DPPA: Federal Restrictions on DMV Data",
    "body": "The Driver's Privacy Protection Act (DPPA), 18 U.S.C. § 2721, is a federal law that restricts access to personal information maintained in state motor vehicle records. Under the DPPA, state DMV records — including name, address, phone, SSN, photograph, and vehicle information — may only be accessed for specific permissible purposes enumerated in the statute. Private investigator use is a permissible purpose under 18 U.S.C. § 2721(b)(4): use in connection with any civil, criminal, administrative, or arbitral proceeding. However, accessing DMV records for a purpose outside the enumerated list — including to satisfy personal curiosity, to assist someone without a legitimate legal proceeding, or to sell the data to a third party — is a federal crime carrying fines up to $2,500 per violation and civil liability. Every DMV records request should be documented with the specific permissible purpose that justifies it.",
    "keyPoints": [
      "DPPA: federal law restricting access to state DMV records",
      "PI permissible purpose: civil, criminal, administrative, or arbitral proceedings (18 U.S.C. § 2721(b)(4))",
      "Accessing DMV records outside permitted purpose: federal crime, $2,500 per violation",
      "Document permissible purpose for every DMV search before running it",
      "Selling DMV data to unauthorized third parties: additional federal criminal exposure"
    ],
    "legalRef": "18 U.S.C. § 2721 (DPPA)",
    "callout": { "type": "warning", "text": "The DPPA is a federal statute with federal criminal penalties. A Georgia GBPDSA license does not authorize DPPA access — the purpose of the specific engagement does. Confirm your purpose before every DMV query." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "FCRA and Background Screening: Rules for Consumer Reports",
    "body": "The Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681, governs the collection, dissemination, and use of consumer information, including credit reports, criminal background reports, and employment history compiled by consumer reporting agencies (CRAs). A PI who compiles consumer reports — or who obtains them from a CRA — must have a permissible purpose. Permissible purposes include: written authorization from the consumer, connection with a credit transaction, employment purposes with disclosure and authorization, and connection with a legitimate business need for a business transaction involving the consumer. Using FCRA-regulated data for surveillance, personal information gathering outside these categories, or selling consumer report data is a civil and criminal FCRA violation. The FTC actively enforces FCRA against private investigators who misuse consumer data.",
    "keyPoints": [
      "FCRA: governs consumer reports — credit, criminal background, employment history",
      "PI permissible purposes: consumer authorization, credit/business transactions, employment with disclosure",
      "Surveillance use of consumer reports: not a permissible FCRA purpose",
      "FTC enforcement: PIs are specifically on their radar for FCRA misuse",
      "Consumer report data must be used only for the purpose for which it was obtained"
    ],
    "legalRef": "15 U.S.C. § 1681 (FCRA)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Information Brokers: Vetting, Use, and Liability",
    "body": "Information brokers are businesses or individuals who aggregate and sell data. Some are licensed and operate within legal frameworks (major data aggregators, credit bureaus). Others operate in legal gray areas, selling data obtained through unclear methods. As a PI, you are responsible for the legality of how you obtain information — even when you purchase it from a third party. 'I bought it from a broker' does not insulate you from liability if the broker obtained the data illegally and you knew or should have known. Vet every information source you use: confirm the provider operates within FCRA, DPPA, and state privacy law frameworks. Maintain records of the source, the query, and the permissible purpose for every data purchase. Your case file should be able to demonstrate a clean chain from question to legally obtained answer.",
    "keyPoints": [
      "Information broker liability passes to you if you use illegally obtained data",
      "'I bought it' is not a defense when you knew or should have known the source was illegal",
      "Vet every broker: confirm FCRA, DPPA, and state law compliance",
      "Maintain source documentation for every data purchase in your case file",
      "Preferred: licensed aggregators (LexisNexis, TLO) with clear legal frameworks"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. A client contacts your agency and says they are trying to reconnect with an old friend who has 'dropped off the radar.' They want a current address, phone number, and possibly a workplace. They are willing to pay $500 cash and have no written engagement agreement. During your database search, you find the subject's address easily in public records. You also notice the database has returned what appears to be a credit header including a Social Security Number fragment and credit account information.",
    "reflection": "Is this engagement as described a permissible FCRA purpose? What is your concern about the client's stated reason for wanting the information? What does 'reconnecting with an old friend' potentially mask? Can you use the credit header data returned by the database? What do you do with this engagement?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Your client's attorney instructs you to obtain the subject's driving record and vehicle registration to establish that the subject was operating a vehicle on a specific date. You run the DMV query and the records confirm the vehicle registration and show the subject was issued a citation on the date in question. Two weeks later, the attorney contacts you again and says a colleague wants to use the same DMV data in an unrelated personal injury case. The attorney asks you to provide the data pull to the colleague.",
    "reflection": "Analyze the original DMV query: was it within DPPA permissible purpose? Now analyze the attorney's second request: what is the problem with sharing the DMV data with an unrelated party for a different case? What would the correct procedure be if the colleague's case legitimately needs the same data?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Legal Sources Verification Checklist",
    "items": [
      { "label": "Permissible Purpose Documented Before Every Query", "description": "For every database search, DMV query, or consumer report pull, document the specific permissible purpose that authorizes the search before running it. This documentation is your defense if the query is later challenged." },
      { "label": "Information Source Vetted", "description": "Any new information provider used must be vetted for FCRA and DPPA compliance before use. If the provider cannot demonstrate how they obtain their data, do not use them." },
      { "label": "Client Engagement Verified as Lawful", "description": "Confirm the client's stated purpose for the information request is a lawful purpose under applicable federal and state law. 'Client wants to know' is not a purpose — it is a desire. Document the legitimate legal proceeding or business purpose behind the request." },
      { "label": "Credit/Financial Data Handling", "description": "Any credit or financial data returned incidentally during a search must be handled according to FCRA requirements: used only for the stated permissible purpose, not retained beyond the case need, and not disclosed to unauthorized parties." },
      { "label": "Results Verified Against Primary Sources", "description": "Database results are leads, not facts. Before any database-sourced information is stated as fact in a report, verify it against a primary source: public record, direct observation, or court document." }
    ],
    "narrationUrl": null
  }
]
$slides_pi10$
);

-- ── PI-11: Surveillance ───────────────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-11', 'Surveillance',
$slides_pi11$
[
  {
    "type": "slide",
    "heading": "Surveillance Law Foundations: OCGA 16-11-62 Deep Dive",
    "body": "OCGA 16-11-62 is the statutory framework governing all surveillance activity in Georgia. Its three primary prohibitions are: observing, photographing, or recording a person in a private place without consent when they have a reasonable expectation of privacy; intercepting wire, oral, or electronic communications without consent; and installing any device designed to observe, record, amplify, or broadcast the private communications or activities of another without consent. The statute defines 'private place' as a location where a person may reasonably expect to be safe from observation by others — including bedrooms, bathrooms, hotel rooms, medical facilities, and the interior of enclosed vehicles. Violation is a felony under OCGA 16-11-69, with no misdemeanor option. Federal law — the Electronic Communications Privacy Act (ECPA) — imposes parallel and often broader restrictions on electronic interception.",
    "keyPoints": [
      "OCGA 16-11-62: prohibits (1) observation/recording in private places, (2) intercepting communications, (3) installing recording devices — all without consent",
      "Private place: anywhere a reasonable expectation of privacy exists — home, hotel, vehicle interior",
      "Violation is a felony — no misdemeanor option",
      "Federal ECPA (18 U.S.C. § 2510 et seq.) provides parallel and broader protections",
      "Both state and federal charges can arise from a single surveillance incident"
    ],
    "legalRef": "OCGA 16-11-62 | OCGA 16-11-69 | 18 U.S.C. § 2510 (ECPA)",
    "callout": { "type": "warning", "text": "Every surveillance assignment should begin with a legal analysis of OCGA 16-11-62 before any equipment is deployed. When in doubt, call the retaining attorney before you act — not after." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Consent Recording: One-Party vs. Two-Party States",
    "body": "Georgia is a one-party consent state for audio recording: at least one party to the communication must consent to the recording, and that party can be the PI if they are participating in the conversation. This means you can lawfully record any conversation you are personally part of, without informing the other parties, under OCGA 16-11-66. However, you cannot record a conversation between two other people without consent from at least one participant. When operating across state lines — which happens frequently in surveillance — know the recording law of every state in which you are operating. Federal ECPA applies a one-party consent standard for interstate communications, but some states (Florida, California, Maryland, among others) require all-party consent. Using Georgia one-party law to justify recording in a two-party state is a federal crime.",
    "keyPoints": [
      "Georgia: one-party consent state — OCGA 16-11-66",
      "You can record any conversation you participate in, without informing others",
      "Cannot record third-party conversations without consent from at least one participant",
      "Multi-state operations: apply the stricter state's law when crossing state lines",
      "Federal ECPA: one-party consent standard for interstate communications"
    ],
    "legalRef": "OCGA 16-11-66 | 18 U.S.C. § 2511 (ECPA)",
    "callout": { "type": "warning", "text": "All-party consent states (Florida, California, Illinois, Maryland, etc.) require every party's consent for lawful audio recording. A Georgia PI conducting surveillance in Florida is subject to Florida law — Georgia's one-party rule does not travel with you." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Stationary Surveillance: Vehicle Selection, Positioning, and Duration",
    "body": "Stationary surveillance — parking in a fixed position to observe a location — is the most common surveillance method and carries the most predictable legal risk profile if conducted correctly. Vehicle selection matters: a car that blends with the neighborhood, is not memorable by color or model, has tinted windows, and is clean. Positioning: your observation point must be on public property or property for which you have authorization. The center of your field of view should be on the activity you are documenting, not on a private interior space. Duration: long stationary positions in residential neighborhoods attract attention. Rotate positions every 45 to 90 minutes if possible. Document your position, duration, and observations in a timestamped log. Never eat, use a phone visibly, or leave your vehicle for extended periods during active surveillance.",
    "keyPoints": [
      "Vehicle: unremarkable, tinted windows, not identifiable by color/model combination",
      "Position: public property or authorized private property only — document exact location",
      "Field of view: directed at public spaces or areas lacking reasonable expectation of privacy",
      "Duration: rotate position every 45–90 minutes in residential settings to avoid burn",
      "Timestamped log: position, duration, weather, lighting, all observed activity"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Mobile Surveillance: Foot and Vehicular Techniques",
    "body": "Mobile surveillance requires following a subject through changing environments while maintaining observation without detection. Vehicle follow: maintain 2-4 car lengths of separation in light traffic, more in heavy traffic. Do not run red lights to maintain contact — losing the subject is better than a moving violation or collision. Use alternate parallel routes when the subject makes predictable turns. Foot surveillance: vary your pace to match the crowd, avoid consistent eye contact with the subject, use natural stopping behaviors (checking a phone, examining a storefront) to avoid appearing to follow. Two-person surveillance teams dramatically reduce burn risk. Single-operator surveillance burns faster — plan for it. If the subject demonstrates awareness — looking back, doubling their route, slowing dramatically — abort. A burned surveillance is unrecoverable; there is no advantage in continuing once detected.",
    "keyPoints": [
      "Vehicle follow: 2–4 car lengths separation, never run lights, use parallel routes",
      "Foot follow: vary pace, use natural stops, avoid consistent eye contact",
      "Two-person team: dramatically reduces burn risk compared to solo surveillance",
      "Burn indicators: subject looking back, route doubling, dramatic speed change",
      "Abort when burned: no advantage in continuing — subject now knows they are being watched"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "GPS Tracking: When It Is Legal in Georgia",
    "body": "Georgia law under OCGA 16-11-60.1 prohibits placing a tracking device on a vehicle without the owner's consent. The vehicle owner — not the titled owner — is the legally relevant party. In a marital dispute, both spouses typically have co-ownership rights to marital property vehicles, which creates a limited consent argument for one spouse placing a tracker on a jointly owned vehicle — but this is a legal gray area that Georgia courts have not uniformly resolved. The safest rule: if you do not own the vehicle and you do not have written consent from the owner, do not place a tracker on it. GPS trackers on leased vehicles require the lessee's consent, not the lessor's. GPS trackers on company vehicles require the employer's consent, not the employee's. Federal courts have held that attaching a GPS tracker to a vehicle parked in a public location may not require a warrant — but Georgia's statute imposes an independent state-law consent requirement.",
    "keyPoints": [
      "OCGA 16-11-60.1: attaching a tracking device to a vehicle without owner consent is prohibited",
      "Vehicle owner: the person with legal right to the vehicle — not always the title holder",
      "Marital property gray area: legal dispute unsettled in Georgia — do not assume consent exists",
      "Company vehicle: employer consent is sufficient — employee consent not required",
      "Leased vehicle: lessee has consent authority, not the leasing company"
    ],
    "legalRef": "OCGA 16-11-60.1",
    "callout": { "type": "warning", "text": "Placing a GPS tracker on a vehicle without verified owner consent is a Georgia misdemeanor on first offense. Client authorization does not create owner consent. Always verify who legally owns or has rightful possession of the vehicle before placing any device." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Counter-Surveillance Detection: Recognizing Burn Awareness",
    "body": "Burn awareness — when a subject realizes they are being surveilled — can come from visible investigator behavior, tip-offs from third parties, or experienced subjects who conduct counter-surveillance routinely. Behavioral indicators that a subject has detected surveillance: making U-turns or abrupt route changes with no apparent destination purpose; pulling over and waiting to see what vehicles follow; circling blocks; making eye contact with your vehicle repeatedly; walking toward your surveillance position; and contacting law enforcement. If you believe you have been made, document the behavior in your log and contact the retaining attorney before continuing. Continuing surveillance of a subject who has identified you and is experiencing fear of being followed crosses from lawful surveillance into stalking under OCGA 16-5-90.",
    "keyPoints": [
      "Burn indicators: U-turns, route doubling, waiting in place, circling blocks, repeated eye contact",
      "Subject contacting police: strong burn indicator — log it and withdraw",
      "Continuing surveillance of a burned subject who is afraid: stalking under OCGA 16-5-90",
      "Document burn behavior in timestamped log before withdrawing",
      "Contact retaining attorney before deciding whether to resume after a burn"
    ],
    "legalRef": "OCGA 16-5-90 (stalking)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Electronic Surveillance: Scope, Limits, and the Federal Wiretap Act",
    "body": "Electronic surveillance extends beyond audio recording to include: accessing email and electronic message content, monitoring network traffic, installing software to capture keystrokes or screen activity, and using IMSI catchers or other devices to intercept cellular communications. The Federal Wiretap Act (18 U.S.C. § 2511) prohibits intentional interception of wire, oral, or electronic communications. The Stored Communications Act (18 U.S.C. § 2701) prohibits unauthorized access to stored electronic communications. Both carry criminal penalties and civil liability. Private investigators are not exempt from either statute. The only lawful PI access to electronic communications is through legal process (subpoena to the service provider) or written consent from the account owner. Any other method is a federal crime.",
    "keyPoints": [
      "Federal Wiretap Act: prohibits interception of wire, oral, or electronic communications",
      "Stored Communications Act: prohibits unauthorized access to stored messages and accounts",
      "PI exceptions: none — must use legal process or written consent from account owner",
      "Keyloggers, screen capture software, and IMSI catchers: all require legal authority",
      "Violating federal electronic surveillance law: up to 5 years imprisonment per count"
    ],
    "legalRef": "18 U.S.C. § 2511 (Wiretap Act) | 18 U.S.C. § 2701 (SCA)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Night Operations: Equipment, Safety, and Legal Exposure",
    "body": "Nighttime surveillance carries heightened legal and safety risk. Legally, the key question is whether the subject is in a location where they have a reasonable expectation of privacy — and at night, in a residential area, that expectation is typically at its highest. Illuminating a private interior with a flashlight, laser rangefinder, or infrared equipment to observe inside a home is a search under both OCGA 16-11-62 and Fourth Amendment doctrine when law enforcement is involved. Practically: extended darkness observation in a residential setting increases the probability of a 'suspicious person' call. If police approach your surveillance position at night, be prepared to identify yourself professionally, explain your licensed purpose without revealing client identity, and provide your GBPDSA license if requested. Night vision equipment is legal to own and use from lawful vantage points — it does not grant authority to observe into private spaces.",
    "keyPoints": [
      "Night surveillance: heightened reasonable expectation of privacy in residential settings",
      "Illuminating private interiors from outside: potentially OCGA 16-11-62 violation",
      "Police approach: identify as licensed PI, show GBPDSA license, do not reveal client identity",
      "Night vision: legal to use from lawful public vantage points — does not extend your observation authority",
      "Log police interactions during surveillance in your case file immediately"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are on day 2 of a 5-day vehicular surveillance assignment. During the morning follow, the subject makes three consecutive U-turns on a two-lane road with no apparent destination reason, then pulls into a parking lot and parks facing the exit watching traffic pass. When you drive past, the subject appears to make eye contact with your vehicle. The subject then parks in front of your observation position from yesterday and sits for 45 minutes.",
    "reflection": "Is this subject conducting counter-surveillance? What specific behaviors indicate burn awareness? What should you do at this point? Should you approach the subject, withdraw, or continue from a different position? What do you document, and who do you contact?",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. Your client asks you to place a GPS tracker on a vehicle. The client says the vehicle is registered in their name and their estranged spouse's name as a jointly owned marital vehicle. The client wants to track the spouse's movements during a divorce proceeding. The vehicle is currently parked in the spouse's mother's driveway — not at the marital home.",
    "reflection": "Analyze the consent question: does joint ownership create sufficient consent under OCGA 16-11-60.1? What is the significance of the vehicle being located at a third party's property? Does the divorce proceeding context change the legal analysis? What questions do you ask the client's divorce attorney before touching this assignment?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Pre-Surveillance Legal Clearance Checklist",
    "items": [
      { "label": "OCGA 16-11-62 Analysis Complete", "description": "Before deploying any surveillance, confirm your observation position and methods comply with 16-11-62: observing only spaces where the subject has no reasonable expectation of privacy, no audio interception of third-party conversations, no recording devices placed in private spaces." },
      { "label": "GPS Authorization Verified", "description": "If GPS tracking is planned: confirm the client is the vehicle owner or has verified written consent from the owner. Document this authorization in your file before placing any device." },
      { "label": "Multi-State Law Checked", "description": "If the subject may travel across state lines during the assignment, identify the recording consent laws of each state in the anticipated geographic range. Apply the most restrictive standard." },
      { "label": "Abort Protocol Agreed with Client", "description": "Discuss with the client in advance what happens if surveillance is burned. Confirm authorization to abort rather than continue into legally or safety-compromised situations." },
      { "label": "Emergency Contact Plan", "description": "Identify who to call (retaining attorney, agency principal) if a legal or safety issue arises during surveillance — before the issue occurs, not after." }
    ],
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Daily Surveillance Log Checklist",
    "items": [
      { "label": "Start-of-Day Entry", "description": "Log: date, start time, weather conditions, lighting conditions, vehicle/equipment deployed, observation position (address or GPS), client matter reference number." },
      { "label": "Activity Log — Every Observation", "description": "Time-stamp every observed activity. Log: time, description of observed action, location of subject, your observation position, camera/video reference number if footage was captured." },
      { "label": "Subject Contact or Police Contact", "description": "Any interaction with the subject or law enforcement during surveillance is documented in full: exact words exchanged, your identification provided, outcome. This is discovery-responsive material." },
      { "label": "End-of-Day Closeout", "description": "Log: time surveillance concluded, subject's last known location and status, equipment secured, media transferred to secure storage, any anomalies or concerns noted." },
      { "label": "Evidence Chain of Custody Updated", "description": "All video, photographs, and notes from today's surveillance are logged into the case evidence chain: date captured, media format, stored location, who has had access." }
    ],
    "narrationUrl": null
  }
]
$slides_pi11$
);

-- ── PI-12: Basic Videography & Photography ────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-12', 'Basic Videography & Photography',
$slides_pi12$
[
  {
    "type": "slide",
    "heading": "Equipment Selection: Resolution, Storage, and Legal Admissibility",
    "body": "The camera you choose determines the quality and admissibility of your evidence. For video surveillance, minimum useful resolution is 1080p at 30 frames per second — lower resolution footage struggles to clearly identify individuals in court. For photography, a camera with RAW file capture provides an uncompressed original that is harder for opposing counsel to challenge as edited. Storage media matters: record directly to a write-once medium (burned DVD or dedicated SD card used only for this case) or to encrypted cloud backup immediately after capture. A file that has been edited — even to remove irrelevant footage — raises an authentication challenge if the editing is not documented. Maintain the original, unedited file and work from copies for any analytical purpose. Your agency should standardize on equipment platforms to ensure interoperability and consistent evidence quality.",
    "keyPoints": [
      "Video: minimum 1080p at 30fps for clear individual identification in court",
      "Photography: RAW capture preferred — uncompressed originals resist editing challenges",
      "Storage: write-once media or encrypted backup immediately after capture",
      "Original files: never edit; all analysis from authenticated copies",
      "Standardize agency equipment: consistent platforms ensure evidence interoperability"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Shot Composition: Establishing, Medium, and Close-Up in Evidence",
    "body": "Every surveillance sequence should follow a three-level compositional structure. The establishing shot shows the overall environment: the building, parking lot, or street where the activity occurs. This provides the court with context — where this happened and what the surrounding area looked like. The medium shot shows the subject within the environment: the subject at mid-body distance, clearly identifiable, performing the activity being documented. The close-up shows specific detail: the subject's face for identification, the specific action (lifting, running, carrying), or the specific object being handled. In a workers' compensation fraud case, these three levels together create a narrative: this is where it happened, this is the subject, and this is exactly what they were doing. Missing any level weakens the evidentiary value of the sequence.",
    "keyPoints": [
      "Establishing shot: environment context — location, setting, time of day",
      "Medium shot: subject within environment — clearly identifiable, full activity visible",
      "Close-up: specific detail — face identification, precise action, specific object",
      "Three-level sequence creates an evidence narrative that stands alone without narration",
      "Missing any level weakens the sequence — courts want context, not isolated close-ups"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Metadata Integrity: Date/Time Stamps and Chain of Custody",
    "body": "Every digital photograph and video file embeds metadata — data about the data — including the timestamp, GPS coordinates (if enabled), camera model, and settings. This metadata is what opposing counsel will examine when challenging the authenticity of your evidence. Before every assignment, synchronize your camera clock to an authoritative time source (your smartphone GPS time, NIST time signal) and document the sync in your case log. If your camera clock has drifted and the metadata timestamp differs from your field log time, document the discrepancy and explain it in your report. GPS geotagging should be enabled when conducting surveillance — a photograph with embedded GPS coordinates corroborating your field log position is dramatically stronger evidence than a photograph without location data. Hash the original files with SHA-256 upon collection to prove the files have not been altered since capture.",
    "keyPoints": [
      "Metadata: timestamp, GPS, camera model, settings — all subject to opposing examination",
      "Sync camera clock to authoritative source before every assignment — document the sync",
      "GPS geotagging: enable it — embedded coordinates corroborate field log positions",
      "Clock drift: document discrepancy and explain it — unexplained gaps invite impeachment",
      "SHA-256 hash at collection: proves original file integrity through chain of custody"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Archiving and Delivery: Format Standards for Legal Proceedings",
    "body": "When your footage and photographs are delivered to a retaining attorney or used in legal proceedings, format matters. Video delivered in proprietary formats (some body cam systems, older surveillance DVR formats) may be unplayable without specific software — provide commonly accepted formats (MP4, MOV) and retain the original alongside any transcoded copy. For court presentation, video is typically presented through counsel's laptop or a court-provided display system. Ensure your footage is compatible with standard presentation software. For authentication at trial, you must be able to testify: when it was recorded, by whom, the equipment used, that it accurately depicts what you observed, and that the file has not been altered since capture. Your hash verification record and chain of custody log are the foundation of that testimony.",
    "keyPoints": [
      "Deliver video in widely compatible formats: MP4, MOV — retain original alongside any conversion",
      "Proprietary formats: include the playback software or convert before delivery",
      "Court authentication: when recorded, by whom, equipment used, unaltered since capture",
      "Hash record + chain of custody log = foundation of authentication testimony",
      "Label all media: case number, date captured, file hash, who created the copy"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You captured six hours of surveillance video over three days in an insurance fraud case. The footage clearly shows the subject performing activities inconsistent with their disability claim on days 1 and 3, but day 2 footage is entirely irrelevant — the subject stayed home all day. The defense attorney subpoenas your complete unedited footage for all three days. Your client's attorney asks you to provide only the edited highlights showing the exculpatory activities, not the full six hours.",
    "reflection": "Can you comply with the client attorney's request to provide only the edited highlights in response to a subpoena for complete footage? What are the consequences of withholding the day 2 footage? Who controls the response to the subpoena — you, the client, or the client's attorney? What is your obligation when a client attorney asks you to do something that appears to conflict with a court order?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Evidence Media Checklist",
    "items": [
      { "label": "Camera Clock Synchronized", "description": "Confirm camera clock synchronized to authoritative time source before deployment. Record the sync time and source in case log." },
      { "label": "GPS Geotagging Enabled", "description": "Confirm GPS geotagging is active and functional — take a test photograph and verify coordinates in metadata before surveillance begins." },
      { "label": "Storage Media Prepared", "description": "Format storage media fresh for each assignment. Label with case number and date. Confirm sufficient capacity for anticipated surveillance duration." },
      { "label": "Original File Hash Computed", "description": "Immediately upon completing each day's surveillance, compute SHA-256 hash of all original files and record in case log. This is the integrity baseline." },
      { "label": "Chain of Custody Log Updated", "description": "Every transfer, copy, or delivery of evidence media is logged: who, when, what format, what purpose. A gap in this log is an authentication vulnerability." }
    ],
    "narrationUrl": null
  }
]
$slides_pi12$
);
