-- ============================================================
-- 011_pi_lessons_05_08.sql
-- Slide content for PI-05 through PI-08
-- MJM 2026 Private Detective curriculum
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN ('PI-05','PI-06','PI-07','PI-08');

-- ── PI-05: Laws of Arrest ─────────────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-05', 'Laws of Arrest',
$slides_pi05$
[
  {
    "type": "slide",
    "heading": "Citizen's Arrest Under OCGA 17-4-60: What It Is and Is Not",
    "body": "OCGA 17-4-60 grants Georgia citizens the authority to arrest another person in two specific circumstances: when the person has committed a felony and you personally observed it, or when you are authorized by a law enforcement officer to assist in an arrest. That is the full extent of private citizen arrest authority in Georgia. There is no 'PI arrest authority' beyond this statute. You cannot arrest someone for a misdemeanor unless you are a peace officer. You cannot arrest someone based on what a client tells you they did. You cannot arrest someone based on video footage you reviewed after the fact — the statute requires the offense to have been committed in your presence. The 2021 Ahmaud Arbery case fundamentally changed how Georgia courts and prosecutors view citizen arrests — prosecutors now approach these cases with maximum scrutiny.",
    "keyPoints": [
      "Citizen arrest applies only to felonies committed in your personal presence",
      "Cannot arrest for misdemeanors — only sworn peace officers have that authority",
      "Cannot arrest based on client information, tips, or after-the-fact video evidence",
      "Post-Arbery (2021): Georgia legislature tightened citizen arrest law — heightened scrutiny",
      "Wrong citizen arrest = felony false imprisonment exposure for you"
    ],
    "legalRef": "OCGA 17-4-60 | OCGA 16-5-41 (false imprisonment)",
    "callout": { "type": "warning", "text": "The Ahmaud Arbery killing in 2020 occurred under a claim of citizen's arrest. Georgia's legislature responded. If you are considering a citizen's arrest during an investigation, you are almost certainly in the wrong — call law enforcement instead." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Private vs. Peace Officer Authority: The Critical Gap",
    "body": "Peace officers in Georgia — police, sheriffs, GBI agents — derive their authority from the state and carry powers that no private citizen can possess: the power to stop, detain, search, and arrest for any criminal offense, to command compliance, and to use reasonable force to effectuate a lawful arrest. A private investigator has none of these powers. The critical gap is this: a peace officer can detain someone based on reasonable articulable suspicion. A private citizen who detains someone based on suspicion alone is committing false imprisonment under OCGA 16-5-41, which carries one to ten years in prison. The moment you physically prevent someone from leaving a location without legal justification, you have crossed from PI work into criminal conduct.",
    "keyPoints": [
      "Peace officers: broad stop, detain, search, and arrest authority — PIs have none of this",
      "Detaining someone based on suspicion = false imprisonment (OCGA 16-5-41, 1–10 years)",
      "PIs cannot compel anyone to stop, answer questions, or remain at a location",
      "Physical blocking of a subject's exit path is false imprisonment regardless of intent",
      "When in doubt: observe and report, do not detain — call law enforcement"
    ],
    "legalRef": "OCGA 16-5-41 | OCGA 17-4-20 (peace officer arrest authority)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Constitutional Guarantees: 4th, 5th, and 6th Amendment Basics",
    "body": "The Bill of Rights protects citizens from government action — not from private action. The Fourth Amendment prohibits unreasonable searches and seizures by government actors; a private investigator conducting surveillance is not bound by the Fourth Amendment because you are not the government. However, evidence you gather illegally can still be excluded if law enforcement directed you to obtain it, making you effectively a government agent under the exclusionary rule. The Fifth Amendment right against self-incrimination applies in custodial police interrogations — a subject who talks to you during a voluntary PI interview has no Fifth Amendment protection because you are not the government. The Sixth Amendment right to counsel applies to criminal proceedings — but does not prevent you from speaking with a represented party if the conversation is consensual and you disclose your role.",
    "keyPoints": [
      "4th Amendment: limits government searches only — PIs not directly bound",
      "Government agent doctrine: if police direct your surveillance, 4th Amendment may apply",
      "5th Amendment: applies to government custodial interrogation — not PI interviews",
      "6th Amendment right to counsel: speaking with represented parties requires careful handling",
      "Unlawfully obtained evidence can still be excluded if you acted as a government proxy"
    ],
    "legalRef": "U.S. Constitution, Amendments IV, V, VI | Burdeau v. McDowell (1921)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Due Process: What It Means When a PI Makes Contact",
    "body": "Due process means the government must follow fair procedures before depriving a person of life, liberty, or property. Because private investigators are not government actors, due process constraints do not apply directly to your investigative methods. However, they matter to you in two ways. First, if your evidence collection is so intertwined with law enforcement that a court deems you a government agent, due process violations by you can taint the evidence. Second, you have an ethical obligation that parallels due process: treat people fairly, do not manipulate, do not entrap, do not coerce. The ethical standard and the constitutional standard point in the same direction — fair dealing produces better evidence and keeps you out of legal jeopardy.",
    "keyPoints": [
      "Due process constrains government actors — PIs operate outside this constitutional boundary",
      "Government agent doctrine: coordination with law enforcement can change this analysis",
      "Entrapment is an ethical and legal prohibition even where due process does not formally apply",
      "Fair treatment of subjects produces more reliable evidence that survives court challenge",
      "Document every contact with subjects — create a record that demonstrates professionalism"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Use of Force by PIs: Strict Self-Defense Standard Only",
    "body": "Private investigators may use force only in genuine self-defense under Georgia's self-defense statute OCGA 16-3-21. Georgia allows the use of force to defend oneself from an imminent unlawful use of force by another person. Deadly force requires the reasonable belief that it is necessary to prevent death or great bodily harm. There is no PI-specific use of force standard. You have no authority to use force to detain a subject, prevent flight, secure evidence, or protect a client's property. Every use of force during a PI engagement must be justified entirely under civilian self-defense law — and justified to a prosecutor who will examine whether you could have avoided the confrontation entirely.",
    "keyPoints": [
      "PI use of force: limited to personal self-defense only under OCGA 16-3-21",
      "No authority to use force to detain, prevent flight, or secure evidence",
      "Deadly force: requires reasonable belief of imminent death or great bodily injury",
      "Georgia has a Stand Your Ground provision (OCGA 16-3-23.1) — but duty to retreat analysis still occurs",
      "Prosecutors will scrutinize whether you provoked the confrontation by your investigative conduct"
    ],
    "legalRef": "OCGA 16-3-21 | OCGA 16-3-23.1",
    "callout": { "type": "warning", "text": "If you are armed as a PI, you are operating as a private citizen carrying a weapon — not as a law enforcement officer. Any use of your weapon will be analyzed under civilian self-defense standards with no benefit of the doubt." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "False Imprisonment Exposure: When PIs Detain Too Long",
    "body": "False imprisonment under OCGA 16-5-41 occurs when you intentionally restrict the freedom of movement of another person without lawful authority. There is no minimum time — even a brief, forceful restraint constitutes the offense. In the PI context, false imprisonment most commonly occurs when an investigator physically blocks a subject's exit, uses a vehicle to prevent the subject from driving away, or represents to the subject that they are legally required to stay. The civil tort of false imprisonment runs parallel to the criminal offense — a civil suit can proceed even if no criminal charges are filed. Merchant immunity under OCGA 51-7-60 provides limited protection to retail establishments detaining suspected shoplifters, but this statute does not extend to private investigators.",
    "keyPoints": [
      "False imprisonment: intentional restriction of movement without lawful authority — any duration",
      "Vehicle blocking, physical positioning, or verbal commands to stay all constitute restraint",
      "Merchant immunity (OCGA 51-7-60) does NOT extend to PIs — only to shopkeeper situations",
      "Civil and criminal false imprisonment can both proceed from the same incident",
      "PI working for a retailer: you are not protected by shopkeeper immunity unless you are the retailer's direct employee"
    ],
    "legalRef": "OCGA 16-5-41 | OCGA 51-7-60",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are surveilling a subject in a corporate theft investigation. You observe the subject loading company equipment into a personal vehicle in the parking lot. Your client calls you and instructs you to approach the subject, prevent them from leaving, retrieve the equipment, and hold the subject until police arrive. The client says you have full authority to act as their agent in this situation.",
    "reflection": "What authority does 'acting as the client's agent' actually grant you? Can you lawfully prevent the subject from leaving? What happens if the subject attempts to drive away and you block the vehicle? What is the legally correct course of action in this situation, and what should you tell the client?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Lawful Contact Protocol",
    "items": [
      { "label": "No Physical Restraint", "description": "Confirm your engagement plan does not involve physically preventing any person from moving. If the subject needs to be detained, call law enforcement — do not do it yourself." },
      { "label": "Consensual Interview Only", "description": "Any subject interview is voluntary. The subject may refuse to speak with you, refuse to answer specific questions, and terminate the conversation at any time. Document that you made the voluntary nature of the conversation clear." },
      { "label": "Identity Disclosed on Request", "description": "If a subject directly asks who you are, you must not claim to be law enforcement. You may decline to reveal your client, but you must be honest about your role as a licensed PI if asked directly." },
      { "label": "Force Authorization Review", "description": "Before any subject contact, confirm your only force authorization is personal self-defense. No client instruction can expand this. If you anticipate a confrontation, do not approach — call law enforcement." },
      { "label": "Observation Documented Before Contact", "description": "If you make contact with a subject, document in your log exactly what you observed before the contact, the reason for contact, and the outcome. This creates a record that demonstrates your professional judgment." }
    ],
    "narrationUrl": null
  }
]
$slides_pi05$
);

-- ── PI-06: Search & Seizure ───────────────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-06', 'Search & Seizure',
$slides_pi06$
[
  {
    "type": "slide",
    "heading": "The 4th Amendment: Why It Matters Even to Private Actors",
    "body": "The Fourth Amendment prohibits unreasonable searches and seizures by the government. As a private investigator, you are not the government — which means you are not directly bound by Fourth Amendment constraints. However, this protection matters to you for two reasons. First, the government agent doctrine: if law enforcement directs or significantly participates in your investigation, your conduct may be imputed to the government, and Fourth Amendment violations by you could exclude the evidence from criminal proceedings. Second, even where the Fourth Amendment does not apply, Georgia has state law protections — particularly OCGA 16-11-62 — that independently prohibit certain types of observation and recording in private spaces. The constitutional boundary and the state statutory boundary are not the same line.",
    "keyPoints": [
      "4th Amendment = limits on government action; PIs are not directly bound",
      "Government agent doctrine: law enforcement direction makes your conduct quasi-governmental",
      "Georgia OCGA 16-11-62 independently prohibits private surveillance in protected spaces",
      "Evidence obtained in violation of state statute is excludable even without 4th Amendment application",
      "Operating near the line: consult retaining attorney before any surveillance in private spaces"
    ],
    "legalRef": "U.S. Const. Amend. IV | OCGA 16-11-62 | Burdeau v. McDowell (1921)",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Plain View Doctrine & Hot Pursuit: PI Applications",
    "body": "The plain view doctrine allows law enforcement to seize evidence without a warrant when it is immediately apparent as contraband or evidence of a crime and is in a place the officer has a lawful right to be. For private investigators, the concept of 'plain view' is relevant not as a legal doctrine but as a practical rule: what you can observe from a location where you have a lawful right to be is fair game for documentation. Standing on a public sidewalk and photographing a subject's activities visible from the street is lawful. The hot pursuit doctrine allows law enforcement to enter premises without a warrant when pursuing a fleeing felon. This doctrine does not extend to private investigators — following a subject into a private building without permission is trespass, not hot pursuit.",
    "keyPoints": [
      "Plain view for PIs: what is visible from a lawful vantage point may be documented",
      "Lawful vantage point: public property, property where you have consent to be",
      "Hot pursuit: law enforcement doctrine — does NOT apply to private investigators",
      "Following a subject into a private building is trespass, regardless of circumstances",
      "Document your vantage point for every photograph: location, GPS coordinate if possible"
    ],
    "legalRef": "Horton v. California (1990) | OCGA 16-7-21 (trespass)",
    "callout": { "type": "warning", "text": "The plain view doctrine is a law enforcement tool. When PIs cite it to justify questionable observation tactics, courts do not accept the analogy. Your standard is Georgia trespass and privacy law, not Fourth Amendment doctrine." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Stop & Frisk: Terry v. Ohio and the PI Context",
    "body": "In Terry v. Ohio (1968), the Supreme Court held that law enforcement officers may briefly detain a person for investigation based on reasonable articulable suspicion of criminal activity. This is the 'stop and frisk' or 'Terry stop' doctrine. It does not apply to private investigators. You cannot stop anyone, detain anyone, or pat anyone down based on suspicion. The significance of Terry for PI practice is understanding what law enforcement can lawfully do during an investigation so you can interface with those actions properly. If police conduct a Terry stop of your subject during your surveillance, your documentation of that stop may become evidence. Your job is to observe and document — not to conduct the stop yourself.",
    "keyPoints": [
      "Terry stop: law enforcement can briefly detain based on reasonable articulable suspicion",
      "This doctrine does NOT extend to private investigators in any form",
      "A PI who 'stops' a subject for investigation has committed false imprisonment",
      "If police conduct a Terry stop of your subject, document it — it may become relevant evidence",
      "Your role when law enforcement is present: observe, document, and do not interfere"
    ],
    "legalRef": "Terry v. Ohio, 392 U.S. 1 (1968) | OCGA 16-5-41",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "OCGA 16-11-62 Redux: Consent, Recording, and Evidence Admissibility",
    "body": "You have encountered OCGA 16-11-62 in Module PI-04 as a criminal exposure risk. Here, understand its positive application: how to conduct audio and video surveillance that produces legally admissible evidence. For video surveillance of spaces where the subject has no reasonable expectation of privacy — public streets, publicly visible yards, commercial interiors open to the public — no consent is required and the footage is admissible. For audio recording of a conversation you are participating in, you need only your own consent — Georgia is a one-party consent state. For audio recording of a conversation between other parties, you need consent from at least one party to that conversation. If you cannot satisfy these requirements, the recording is a felony and the evidence is inadmissible.",
    "keyPoints": [
      "Video in public or semi-public spaces: no consent required, evidence is admissible",
      "Audio of your own conversations: one-party consent — you are the consenting party",
      "Audio of others' conversations: must have consent from at least one party, or it is illegal",
      "Evidence from unlawful recording: excluded from court AND creates criminal liability for you",
      "Always document which recording scenario applies before deploying any audio equipment"
    ],
    "legalRef": "OCGA 16-11-62 | OCGA 16-11-66 (one-party consent exception)",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are investigating a workers' compensation fraud case. Your client's attorney authorizes you to conduct surveillance and provides you with the claimant's home address. While surveilling the front of the residence from a public street, you observe the subject doing yard work that clearly contradicts their disability claim. You capture clear video from your position. The attorney then asks you to also place a small audio recorder inside the subject's vehicle to capture conversations with potential witnesses who are driving the subject to physical therapy appointments.",
    "reflection": "Analyze each element of this scenario: Is the video from the public street legally obtained? What is the legal status of placing an audio recorder inside the subject's vehicle? Does the attorney's authorization make the audio recorder lawful? What should you tell the attorney, and what are your options for capturing the conversations legally?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Evidence Discovery Protocol",
    "items": [
      { "label": "Vantage Point Documented", "description": "Before any surveillance session, log your exact observation position. Include street address or GPS coordinates, whether the location is public or private, and if private, documentation of your authorization to be there." },
      { "label": "Privacy Expectation Assessed", "description": "For every target area you plan to document, assess whether the subject has a reasonable expectation of privacy there. Public street = no. Backyard not visible from street = yes. Enclosed vehicle interior = yes. Document your analysis." },
      { "label": "Audio Recording Consent Mapped", "description": "If audio recording is planned, identify which consent scenario applies: (a) you are a party to the conversation, or (b) a party to the conversation has given consent. Document this in your case file before recording begins." },
      { "label": "No Physical Evidence Seizure", "description": "If you observe physical evidence of a crime, do not touch it, move it, or take it. Document its location and contact the retaining attorney or law enforcement. Seizing evidence without authority is theft or tampering." },
      { "label": "Chain of Custody Started at Collection", "description": "From the moment any evidence is captured — video, photograph, documents — begin your chain of custody log. Record the date, time, location, collection method, and who has had access to the evidence from that moment forward." }
    ],
    "narrationUrl": null
  }
]
$slides_pi06$
);

-- ── PI-07: Crime Scene Investigation ─────────────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-07', 'Crime Scene Investigation',
$slides_pi07$
[
  {
    "type": "slide",
    "heading": "Preservation Before Processing: The PI's First Obligation",
    "body": "If you arrive at or near a crime scene — whether before, during, or after law enforcement — your first obligation is to preserve, not process. This means: do not touch anything that has not been documented in its original position. Do not move, handle, or collect any physical item without authorization. Do not walk through areas where trace evidence may be present. Do not allow others to access the scene without documenting who they are and when they arrived. Scene contamination by untrained individuals has caused wrongful convictions and exonerations alike. Your value as a PI at a crime scene is as an observer and documenter — not as an investigator competing with forensic specialists.",
    "keyPoints": [
      "Arrive at scene: observe and photograph before any movement or access",
      "Do not touch, move, or collect anything without express authorization from law enforcement",
      "Document all persons who enter the scene and when — you may need to testify about this",
      "Your role: document what exists, not process what exists",
      "Scene contamination is a criminal evidence issue and a civil liability issue"
    ],
    "callout": { "type": "warning", "text": "Touching a crime scene without authorization is evidence tampering under OCGA 16-10-94. The fact that you were hired to investigate does not create authorization to handle physical evidence." },
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Forensic Fundamentals: Fingerprinting, Trace Evidence, Impressions",
    "body": "Private investigators are not forensic scientists, but understanding forensic fundamentals allows you to document scenes in ways that support expert analysis. Latent fingerprints — invisible to the naked eye — are destroyed by touching. Trace evidence (fibers, hair, gunshot residue, glass fragments) can be transferred by walking through a scene. Impression evidence — footprints, tire tracks, tool marks — is obliterated by step-on contact. Your documentation task is to photograph all of these categories before anyone accesses the area: wide establishing shots, medium shots showing spatial relationships, and close-up detail shots. Photograph impression evidence with a scale (a ruler or coin) in the frame for size reference. For criminal defense investigations, your photographs of what existed at the scene before law enforcement fully processed it can become critical exculpatory evidence.",
    "keyPoints": [
      "Latent prints: invisible, destroyed by touch — never touch surfaces in an unprocessed scene",
      "Trace evidence: disturbed by foot traffic — limit access, document path of entry",
      "Impression evidence: photograph with scale before any contact",
      "Shoot in sequence: wide → medium → close-up for every area of interest",
      "Defense investigation photos of pre-processing scene can create Brady material"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Polygraph Basics: Use, Limitations, and Inadmissibility",
    "body": "The polygraph — or lie detector — measures physiological responses (blood pressure, respiration, skin conductance) correlated with deceptive responses. In Georgia criminal proceedings, polygraph results are inadmissible as evidence under the Daubert/Frye standard unless both parties stipulate to admissibility. Private investigators may administer or arrange polygraph examinations in civil and pre-employment screening contexts, but the results cannot be used in Georgia criminal court. The primary PI use of polygraph is as an investigative tool — to guide the direction of an investigation, not as evidence to present. Never represent to a client or subject that polygraph results are legally conclusive. Never use the threat of a polygraph to coerce a subject's cooperation.",
    "keyPoints": [
      "Polygraph measures physiological stress — not deception directly",
      "Georgia criminal courts: inadmissible without stipulation from both parties",
      "Civil and pre-employment: permissible as investigative tool",
      "PI use: guides investigative direction, not a source of admissible evidence",
      "Coercing participation in a polygraph = grounds for Board discipline and potential civil liability"
    ],
    "legalRef": "OCGA 35-3-160 (polygraph licensing) | Daubert standard",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Photographing the Scene: Coverage, Metadata, Chain of Custody",
    "body": "A photograph is evidence. Treat it like evidence from the moment the shutter clicks. Enable your camera's GPS geotagging if available — this embeds location data in the image metadata, corroborating your log entries. Ensure your camera clock is synchronized to actual time — timestamp metadata is compared against your field notes during cross-examination. Shoot more than you think you need: you cannot re-photograph what no longer exists. Use a consistent sequence for every scene: overall view showing context, middle-distance view showing the area of interest, close-up of the specific evidence. Maintain a photo log documenting each photo number, the subject, direction of camera, and time taken. Transfer all images to secure storage the same day and compute a hash value if the case involves criminal proceedings.",
    "keyPoints": [
      "Enable GPS geotagging — location metadata corroborates field notes",
      "Synchronize camera clock before every assignment — metadata timestamps must match your log",
      "Sequence: overall → medium → close-up for every area of interest",
      "Maintain a photo log: image number, subject, camera direction, time",
      "Same-day backup to secure storage; hash verification for criminal case photos"
    ],
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are conducting a criminal defense investigation for an attorney whose client is charged with assault at a bar. The alleged assault occurred in the bar's parking lot three weeks ago. The attorney asks you to visit the parking lot, photograph its layout, document lighting conditions, and locate any surveillance cameras that may have captured the incident. When you arrive, you find a napkin on the ground with what appears to be blood on it near the area where the incident occurred.",
    "reflection": "What do you do with the napkin? Do you collect it, photograph it, leave it, or contact someone? What does your photography coverage of the parking lot need to capture? Who should you notify about the napkin, and what documentation should accompany that notification? How does this change the scope of your engagement?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Crime Scene Documentation Checklist",
    "items": [
      { "label": "No Touch Protocol Active", "description": "Confirm all personnel have been briefed: nothing is touched, moved, or collected before it has been photographed in place. Document who received this briefing and when." },
      { "label": "Camera Equipment Verified", "description": "Confirm camera clock is set to correct time, GPS geotagging is enabled, and storage media has sufficient capacity. A dead battery mid-scene creates inadmissible gaps in coverage." },
      { "label": "Photo Sequence Completed", "description": "Confirm you have completed the three-level sequence — overall, medium, close-up — for every area of interest. Any area with a question mark gets additional coverage, not less." },
      { "label": "Photo Log Maintained", "description": "For every photograph taken, a log entry exists: sequential photo number, timestamp, subject, camera direction, and distance from subject. This log is discovery-responsive." },
      { "label": "Physical Evidence Reported", "description": "Any physical evidence observed but not authorized to collect has been documented by photograph, location, and description, and reported to the retaining attorney before leaving the scene." }
    ],
    "narrationUrl": null
  }
]
$slides_pi07$
);

-- ── PI-08: Interviewing Suspects & Witnesses ──────────────────────────────────
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'PI-08', 'Interviewing Suspects & Witnesses',
$slides_pi08$
[
  {
    "type": "slide",
    "heading": "Kinesics: Reading Body Language and Stress Indicators",
    "body": "Kinesics is the study of body language and nonverbal communication. In investigative interviewing, kinesic analysis helps you identify stress indicators that may signal deception, discomfort, or evasion — not as proof of guilt, but as guides for follow-up questioning. Common stress indicators include: self-grooming behaviors (touching the face, neck, or hair) that increase when specific topics arise; postural shifts away from the interviewer; reduced eye contact during key questions; and speech pattern changes including increased hesitation, higher pitch, or faster rate. Critically, kinesics identifies which topics generate stress — not what the truth is. A person can display stress indicators because they are nervous about being interviewed, not because they are lying. Use kinesics to direct your questioning, not to conclude guilt.",
    "keyPoints": [
      "Kinesics: nonverbal behavior analysis — guides questioning, does not prove deception",
      "Stress indicators: self-grooming, postural shifts, speech changes, reduced eye contact",
      "Baseline first: observe normal behavior before drawing conclusions from deviations",
      "Topic-specific reactions: stress when specific subject arises is more significant than general nervousness",
      "Kinesics is a tool to identify productive follow-up questions, not a lie detector"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Cognitive Interview Technique: Memory Enhancement Protocol",
    "body": "The Cognitive Interview (CI) is a memory-retrieval technique developed for law enforcement that has been validated in peer-reviewed research to increase the accuracy and completeness of witness recall. The four core components are: mental reinstatement of context (asking the witness to mentally return to the setting before the event); reporting everything (encouraging the witness to report everything remembered, even fragments); recounting in different temporal orders (telling the story backwards, from the middle, etc.); and changing perspectives (asking what they believe others at the scene observed). PIs who use CI techniques obtain more accurate and detailed accounts than those who use direct interrogative questioning. Document the CI structure you used in your case notes — it demonstrates methodological rigor in court.",
    "keyPoints": [
      "Cognitive Interview: validated technique that enhances accuracy and completeness of recall",
      "Component 1: mental reinstatement — return witness mentally to the setting",
      "Component 2: report everything — no detail is too small",
      "Component 3: temporal variation — reverse chronology or jumping between time points",
      "Component 4: perspective change — what would others at the scene have seen?",
      "Document CI structure used: demonstrates professional methodology in court"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Rapport Building: The Science of Getting People Talking",
    "body": "Rapport is the foundation of every productive investigative interview. People share information with people they trust and feel comfortable with. Rapport is built through active listening — genuine attention to what the person is saying, not planning your next question while they speak. Mirroring — subtly adopting the person's communication pace, vocabulary level, and physical posture — creates unconscious comfort. Labeling — identifying and naming the emotion you perceive in the person ('It sounds like this has been really difficult for you') — creates the experience of being understood. Open-ended questions ('Tell me what you saw that evening') generate more information than closed questions ('Were you there at 9pm?'). Close your notebook before the person seems finished — some of the most important information emerges after the interviewee thinks the formal session is over.",
    "keyPoints": [
      "Rapport precedes information — invest time before asking substantive questions",
      "Active listening: full attention, no interrupting, no planning next question while they speak",
      "Mirroring: match pace, vocabulary, and posture subtly — builds unconscious trust",
      "Labeling: name the emotion you observe — creates the feeling of being understood",
      "Close notebook early: significant information often emerges in the 'winding down' phase"
    ],
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Coercion and Duress: The Absolute Line",
    "body": "Coercion in an investigative interview is any conduct that overcomes the free will of the person being interviewed. It can be physical (using force or the threat of force), psychological (threatening negative consequences, making false promises, exploiting a person's fear), or situational (interviewing someone in a location or circumstance that prevents them from leaving freely). Evidence obtained through coercive interviewing is inadmissible, not because of the Fourth Amendment — you are not the government — but because coerced statements are inherently unreliable. More critically for your license: obtaining information through coercion is a GBPDSA Code of Conduct violation that constitutes grounds for license revocation. There are no exceptions. A witness who says 'I felt like I had no choice but to answer' has described your conduct as coercive.",
    "keyPoints": [
      "Coercion: any conduct that overcomes the person's free will to refuse participation",
      "Forms: physical threats, false promises, exploitation of fear, preventing departure",
      "Coerced statements: unreliable AND inadmissible AND a GBPDSA violation",
      "Coercion test: would a reasonable person feel free to end the interview and leave at any time?",
      "No exceptions: client pressure, urgency of the case, or certainty of guilt do not justify coercion"
    ],
    "legalRef": "GBPDSA Code of Conduct | OCGA 16-5-70 (coercion of witnesses)",
    "callout": { "type": "warning", "text": "A coerced statement does not just destroy one interview — it can destroy the entire case. Opposing counsel will move to exclude any evidence derived from it, and will use the coercion to impeach your credibility on everything else." },
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "scenario": "Scenario. You are interviewing a witness to a workplace injury. The witness is a co-worker of the claimant and initially says they saw 'nothing unusual' about the accident. You sense they are holding back. You tell them that failing to cooperate with the investigation 'could create problems' for their continued employment and that you have already spoken with management about the case. The witness then changes their account and provides details unfavorable to the claimant.",
    "reflection": "Analyze your statements to the witness. Did you engage in coercion? What was the effect of implying employment consequences? What is the legal and professional status of the statement you obtained? If this case goes to trial, how will opposing counsel use this interview against you? What should you have said instead?",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "title": "Interview Preparation Checklist",
    "items": [
      { "label": "Voluntary Participation Confirmed", "description": "At the start of every interview, clearly state that participation is voluntary, the interviewee may decline to answer any question, and they may end the interview at any time. Document that this was stated." },
      { "label": "Location is Non-Coercive", "description": "Interview location must be one from which the interviewee can freely leave at any time. Do not conduct interviews in locked rooms, in interview rooms that suggest police authority, or at the interviewee's workplace when they have no ability to leave." },
      { "label": "No False Promises or Threats", "description": "Before the interview, confirm your questioning plan does not involve promises of immunity, threats of legal consequence, or statements about what will happen if they do not cooperate. Any of these is coercion." },
      { "label": "Recording Consent Obtained", "description": "If you are recording the interview, inform the interviewee and obtain their consent. Document the consent in your case notes. In Georgia, recording your own conversation requires only your consent — but transparency protects your credibility." },
      { "label": "Post-Interview Log Completed", "description": "Immediately after the interview, write a verbatim summary of key statements while memory is fresh. Include the time, location, persons present, and any unusual circumstances. This becomes a contemporaneous record." }
    ],
    "narrationUrl": null
  }
]
$slides_pi08$
);
