-- ============================================================
-- 021_uas_lessons_19_24.sql
-- Slide content for UAS-19 through UAS-24
-- Unarmed Security Officer track — GBPDSA 24-hour standard
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN (
  'UAS-19','UAS-20','UAS-21','UAS-22','UAS-23','UAS-24'
);

-- ============================================================
-- UAS-19: Communications — Radios, Dispatch & Logs
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-19',
'Communications — Radios, Dispatch & Logs',
$slides_uas19$
[
  {
    "type": "slide",
    "heading": "Professional Radio Communication Standards",
    "body": "Your radio is your primary operational lifeline — the tool that connects you to dispatch, backup, and emergency services. Unprofessional radio use wastes transmission time, garbles critical information, and can cost lives. Security officers are expected to maintain radio discipline at all times.\n\nCORE RADIO PROTOCOL:\n• Transmit clearly: speak directly into the mic, 2–3 inches away, at normal volume\n• Pause before transmitting: listen to confirm the channel is clear before keying up\n• Identify yourself: always begin with your call sign or post ID — 'Post 3 to Dispatch'\n• Be brief: state your purpose in one or two sentences — radio is not a phone call\n• Confirm receipt: end transmissions with 'Over' (response expected) or 'Out' (transmission complete, no response needed)\n• Never say 'Over and Out' — these are contradictory terms\n\nNATO PHONETIC ALPHABET (use for all letters that could be confused):\nAlpha Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliet Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu\n\nExample: 'Dispatch, Post 3. I have a suspicious vehicle, License Papa-Alpha-Seven-Niner-Two-Kilo. Over.'",
    "keyPoints": [
      "Listen before transmitting — never key over another transmission",
      "Identify yourself every transmission: call sign or post ID first",
      "NATO phonetic alphabet for all letters that may be confused under noise",
      "Over = expecting response; Out = transmission complete, no response needed — never both"
    ],
    "legalRef": "FCC Part 90 (Private Land Mobile Radio Services — licensing and operating rules); ASIS International Security Management Standard (communications protocols)",
    "callout": "Radio discipline is a professional standard. Cluttered, unclear transmissions in an emergency can prevent backup from reaching you in time.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Plain Language vs. 10-Codes — Current Best Practice",
    "body": "For decades, security and law enforcement agencies used '10-codes' (10-4, 10-20, 10-33) as shorthand radio language. The problem: 10-codes are not standardized nationally. 10-70 means 'prowler' in one jurisdiction and 'fire' in another. During multi-agency responses — exactly the situations where communication is most critical — 10-code confusion has caused preventable deaths.\n\nFollowing the 9/11 Commission's findings and FEMA's National Incident Management System (NIMS) adoption, the federal standard is now PLAIN LANGUAGE on all emergency communications.\n\nMany security agencies still use 10-codes internally for routine dispatching. Know your employer's code set and its meaning in your context — and switch to plain language when law enforcement or EMS is on your channel.\n\nPROWORDS (Procedure Words) — Used in both plain language and 10-code environments:\n• STAND BY — wait for further instruction\n• SAY AGAIN — repeat your last transmission\n• COPY / ROGER — I received and understood\n• WILCO — I will comply\n• BREAK — I am interrupting an ongoing transmission (emergency only)\n• MAYDAY / EMERGENCY — life-safety emergency, all others clear the channel",
    "keyPoints": [
      "10-codes are not standardized nationally — use plain language in multi-agency situations",
      "NIMS/FEMA require plain language for all emergency radio communications",
      "Learn your employer's code set — switch to plain language when external agencies are on channel",
      "MAYDAY/EMERGENCY immediately clears the channel — all non-emergency traffic stops"
    ],
    "legalRef": "FEMA NIMS (National Incident Management System) Plain Language Policy; FCC Part 90; Homeland Security Presidential Directive 5 (NIMS adoption)",
    "callout": "If there is ANY doubt about whether the person on the other end uses your code set — use plain language. Clarity saves lives.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Dispatch Log Standards & Incident Documentation",
    "body": "The dispatch log is a legal and operational record. Every event called in, every response directed, every resource deployed — all are recorded. Security officers must understand both how to communicate with dispatch and what the log must contain.\n\nDISPATCH LOG ENTRY REQUIREMENTS (minimum):\n• Date and time of report/incident\n• Nature of incident (plain language description)\n• Location (specific: building, floor, room, parking level — not just 'outside')\n• Reporting party identity or post\n• Units/officers dispatched and time dispatched\n• Arrival time of responding officer\n• Disposition: resolved, law enforcement called, EMS called, report filed\n• Any follow-up required and assigned party\n\nOFFICER SELF-LOG (what you record in your own patrol log):\n• All communications to dispatch: time, content of your transmission, response received\n• All incidents observed, responses taken, and outcomes\n• Times of patrol waypoints and areas covered\n• Any equipment or post issues observed\n\nTIPS FOR ACCURACY:\n• Write log entries contemporaneously — not from memory at end of shift\n• Use clock time (0847, not 'around 9') — never estimate\n• Objective language only — what you observed, not what you inferred",
    "keyPoints": [
      "Dispatch logs are legal records — accurate, time-stamped, complete",
      "Minimum dispatch entry: time, nature, location, reporting party, units dispatched, disposition",
      "Self-log patrol waypoints and times — proves your patrol pattern in litigation",
      "Contemporaneous entries only — no memory reconstruction at end of shift"
    ],
    "legalRef": "OCGA § 24-8-803 (business records exception — contemporaneous logs are admissible; reconstructed are challenged); GBPDSA Code of Conduct",
    "callout": "A patrol log with specific times and locations is a legal shield. A reconstructed or vague log is a liability — for you and your employer.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Radio Discipline During Emergencies & Equipment Accountability",
    "body": "Emergencies are when radio discipline matters most and fails most often. Security officers must practice emergency radio procedures before they need them.\n\nEMERGENCY RADIO PROTOCOL:\n1. Key up and state EMERGENCY / MAYDAY to clear the channel\n2. Your identification: 'Post 5, EMERGENCY'\n3. Nature and location: 'Medical emergency, male down, Lobby B'\n4. What you need: 'EMS and security supervisor requested'\n5. Release key — let dispatch acknowledge and direct resources\n6. Do NOT engage in side conversations on the emergency channel\n7. Non-emergency traffic: monitor only until Dispatch clears the emergency\n\nRADIO NEAR IEDs: Never use radio or cell phone within the standoff distance of a suspected improvised explosive device.\n\nEQUIPMENT ACCOUNTABILITY:\n• Sign out your radio at start of shift — record unit number\n• Check battery level before your shift begins\n• Test radio at post before patrol begins\n• Report dead zones in your patrol area — dispatch must know where you lose coverage\n• Return radio at end of shift — report any damage immediately\n• Lost radio: report immediately — radio in wrong hands is a security breach",
    "keyPoints": [
      "Emergency: EMERGENCY/MAYDAY to clear channel, then ID + location + need + release",
      "Non-emergency traffic stops immediately when an emergency is on channel",
      "Sign out and sign in radio every shift — record unit number",
      "Report dead zones and lost radios immediately — both are security exposures"
    ],
    "legalRef": "FCC Part 90; OSHA 29 C.F.R. 1910.165 (emergency communication requirements); GBPDSA Code of Conduct",
    "callout": "A dead radio battery at 0200 is a preventable crisis. Battery check is a non-negotiable start-of-shift procedure.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Radio & Dispatch Communications Checklist",
    "body": "Apply these standards every shift to maintain professional radio discipline and accurate documentation.",
    "keyPoints": [
      "START OF SHIFT: Sign out radio, check battery, radio check with dispatch, confirm correct channel",
      "TRANSMISSIONS: ID yourself first, plain language, NATO phonetic for ambiguous letters, Over/Out correctly",
      "DISPATCH CONTACT: State nature, location, need — in that order, every transmission",
      "PATROL LOG: Contemporaneous entries only — clock time, specific locations, exact radio exchanges",
      "EMERGENCY: EMERGENCY/MAYDAY first, clear channel, ID + location + need, release key",
      "NO-RADIO ZONES: No RF devices inside standoff perimeter of suspected IEDs",
      "END OF SHIFT: Sign in radio, report any issues (damage, dead zones, lost coverage areas)",
      "DOCUMENTATION: All incidents in patrol log before next officer's shift begins"
    ],
    "legalRef": "FCC Part 90; FEMA NIMS Plain Language Policy; GBPDSA Code of Conduct; OCGA § 24-8-803",
    "callout": "Professional radio communication is a skill — practice it on routine calls so it is automatic on emergency calls.",
    "narrationUrl": null
  }
]
$slides_uas19$
);

-- ============================================================
-- UAS-20: Trespass & Banning Procedures
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-20',
'Trespass & Banning Procedures',
$slides_uas20$
[
  {
    "type": "slide",
    "heading": "Georgia Trespass Law — OCGA § 16-7-21",
    "body": "Criminal trespass in Georgia is codified at OCGA § 16-7-21. The statute covers two primary scenarios relevant to security officers:\n\nSUBSECTION (a) — DAMAGE: A person commits criminal trespass if they intentionally damage property of another without consent, where damage is $500 or less. (Above $500 becomes criminal damage to property.)\n\nSUBSECTION (b) — PRESENCE: A person commits criminal trespass if they knowingly and without authority:\n1. Enter the premises of another for an unlawful purpose; OR\n2. Enter the premises of another after being notified not to enter by the owner or authorized agent; OR\n3. Remain on the premises of another after being notified to depart by the owner or authorized agent\n\nKEY SECURITY APPLICATION: A security officer is an 'authorized agent' of the property owner. When you deliver a trespass notice — verbal or written — and the person remains, they have committed a criminal trespass under OCGA § 16-7-21(b)(3).\n\nPENALTY: Criminal trespass is a misdemeanor (OCGA § 16-7-21(c)). Law enforcement can arrest; you can document and hold for law enforcement.",
    "keyPoints": [
      "OCGA § 16-7-21(b) — remaining after notice is criminal trespass; you are the authorized agent",
      "Notice triggers the statute — verbal or written notice is legally sufficient",
      "Criminal trespass is a misdemeanor — law enforcement arrest, not citizen arrest by security officer",
      "Knowingly remaining after valid notice is the key element — document that notice was given"
    ],
    "legalRef": "OCGA § 16-7-21 (criminal trespass); OCGA § 17-4-60 (citizen arrest — felony only); OCGA § 51-7-20 et seq. (false imprisonment — do not detain without authority)",
    "callout": "You can issue notice and enforce the departure — you cannot arrest for a misdemeanor trespass. Call law enforcement for arrest authority.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Property Owner Authority & Security Officer's Role",
    "body": "Private property rights in Georgia are robust. Under common law and OCGA, a property owner — and by extension their authorized security representatives — may exclude any person from private property for any non-discriminatory reason.\n\nIMPORTANT LIMITS:\n• Public accommodation law: A business open to the public (retail, restaurant, hotel) generally cannot exclude customers based on race, color, religion, national origin, disability, or sex under federal law (42 U.S.C. § 2000a; ADA)\n• Any exclusion or banning decision should be reviewed with your supervisor and the property owner to confirm it is not discriminatory\n• The banning decision belongs to the property owner or authorized management — not unilaterally to the security officer\n\nSECURITY OFFICER'S ROLE IN BANNING:\n1. Receive the banning order from management or document the incident that justifies banning\n2. Communicate the ban to the individual — in person, calmly, and in writing when possible\n3. Document the communication: date, time, exact language used, person's response\n4. Maintain the ban log — a written record of all banned individuals and the dates of banning\n5. Enforce the ban when the individual returns — issue trespass notice, call law enforcement\n6. Testify if needed — your documentation supports criminal trespass prosecution",
    "keyPoints": [
      "Property owners can exclude any person for non-discriminatory reasons",
      "Security officer communicates and enforces the ban — but the decision belongs to management",
      "Banning cannot be based on protected characteristics — coordinate with management to confirm legality",
      "Maintain a written ban log: name, date, reason, and evidence of notification"
    ],
    "legalRef": "OCGA § 16-7-21; 42 U.S.C. § 2000a (Civil Rights Act — public accommodations); ADA Title III (disability access); common law property rights",
    "callout": "A discriminatory banning order is not a legal order. If a manager directs you to ban someone based on protected characteristics, report it to your supervisor immediately and do not execute the order.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Issuing a Trespass Notice — Verbal & Written",
    "body": "A trespass notice converts the subsequent presence of the banned individual into a criminal act. The notice must be clear, unambiguous, and documented.\n\nVERBAL NOTICE PROCEDURE:\n1. Identify yourself: 'I am a security officer for [Property Name].'\n2. State the decision: 'You are being notified that you are not permitted to be on this property.'\n3. State the authority: 'The property owner/management has directed that you are not authorized to be here.'\n4. State the consequence: 'If you return, you will be subject to arrest for criminal trespass under Georgia law.'\n5. Request departure: 'I need you to leave now. I will escort you to the nearest exit.'\n6. Document: Date, time, exact location, individual's description, response given\n\nWRITTEN TRESPASS NOTICE (preferred):\n• Identifies the property by address\n• Names the individual (or describes if name is not obtained)\n• States the effective date and that the notice is permanent unless revoked in writing\n• Bears the signature of the property owner or authorized management representative\n• Copy given to individual; copy retained in ban file\n\nNOTE ON OBTAINING NAME: You cannot compel a person to provide identification. If they refuse, document physical description thoroughly. Law enforcement can compel ID once called.",
    "keyPoints": [
      "Verbal notice is legally sufficient — but always supplement with written notice",
      "Five elements of verbal notice: identify yourself, state the decision, cite authority, state consequence, request departure",
      "Written notice: property address, individual ID, effective date, management signature, copy to both parties",
      "You cannot compel ID — document description thoroughly if refused"
    ],
    "legalRef": "OCGA § 16-7-21(b)(2)–(3) (notice requirement); OCGA § 17-4-20 (law enforcement ID compulsion authority)",
    "callout": "A trespass notice is only as good as its documentation. If you cannot prove the notice was given, the individual's presence cannot be prosecuted as criminal trespass.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Returning Shoplifter",
    "body": "Three weeks ago, you issued a verbal trespass notice to a subject after they were caught shoplifting merchandise from the retail anchor store in your property. The notice was documented in the ban log with the subject's physical description — no name was obtained at the time of the incident. Today at 2:15 PM, you recognize the same subject entering through the south entrance. They do not appear to recognize you and proceed toward the anchor store.",
    "keyPoints": [
      "CONFIRM: Verify your identification — be reasonably certain before acting; misidentification creates legal exposure",
      "APPROACH CALMLY: 'Excuse me, sir/ma'am. I need to speak with you.' — do not accuse publicly",
      "IDENTIFY: 'I am Security Officer [name] with [Company]. I need to verify something with you.'",
      "STATE THE NOTICE: 'On [date], you were issued a trespass notice for this property. That notice remains in effect.'",
      "REQUEST DEPARTURE: 'You need to leave the property now. I will escort you to the south exit.'",
      "CALL LAW ENFORCEMENT: If they refuse to leave, do NOT physically restrain — call law enforcement for criminal trespass enforcement",
      "DOCUMENT: Time, location, what was said, their response, and law enforcement response if called"
    ],
    "legalRef": "OCGA § 16-7-21(b)(3) (remaining after notice = criminal trespass); OCGA § 51-7-20 (false imprisonment — do not physically restrain for misdemeanor without arrest authority)",
    "callout": "Your authority ends at requesting departure. If they refuse, law enforcement makes the arrest — your role is to document and hold the line until they arrive.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Trespass & Banning Procedure Checklist",
    "body": "Follow this procedure for all trespass incidents and banning events.",
    "keyPoints": [
      "BANNING DECISION: Confirm with management — decision belongs to property owner, not officer unilaterally",
      "VERIFY LEGALITY: Confirm the basis for banning is not a protected characteristic under civil rights law",
      "VERBAL NOTICE: Identify yourself, state the ban, cite authority, state consequence, request departure",
      "WRITTEN NOTICE: Prepare written notice with property address, individual ID, effective date, management signature",
      "BAN LOG: Enter all bans with: name (if obtained), date, reason, evidence of notification, ban log number",
      "ENFORCEMENT: When banned individual returns — calm verbal reminder, request departure, call law enforcement if refused",
      "DO NOT: Physically restrain a person for misdemeanor trespass — you lack arrest authority",
      "DOCUMENT: Every encounter with a banned individual — time, location, what was said, outcome, law enforcement response"
    ],
    "legalRef": "OCGA § 16-7-21; 42 U.S.C. § 2000a; OCGA § 51-7-20; GBPDSA Code of Conduct",
    "callout": "A well-maintained ban log is a force multiplier. Every officer on shift can enforce a ban — but only if the log is accurate and accessible.",
    "narrationUrl": null
  }
]
$slides_uas20$
);

-- ============================================================
-- UAS-21: Traffic Control & Parking Enforcement
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-21',
'Traffic Control & Parking Enforcement',
$slides_uas21$
[
  {
    "type": "slide",
    "heading": "Authority & Limitations — Private Property Traffic Control",
    "body": "Security officers directing traffic have authority limited to private property. Your authority derives from the property owner's right to manage traffic on their premises — not from any governmental law enforcement authority.\n\nWHAT YOU CAN DO ON PRIVATE PROPERTY:\n• Direct vehicle and pedestrian flow in parking lots, access roads, and private drives\n• Enforce the property's parking rules (unauthorized parking, reserved spaces, fire lanes)\n• Coordinate with law enforcement for traffic that spills onto public roadways\n• Issue parking violation notices authorized by the property owner and local ordinance\n\nWHAT YOU CANNOT DO:\n• Direct traffic on public streets — this is exclusively a law enforcement function under OCGA § 40-6-2\n• Issue enforceable traffic citations on public roadways (only peace officers)\n• Physically stop a moving vehicle on a public roadway\n• Arrest a driver for a traffic violation (traffic violations are not felonies)\n\nWHEN INCIDENTS AFFECT PUBLIC ROADWAYS:\n• Notify law enforcement immediately — do not attempt to direct public roadway traffic\n• Manage traffic flow on private property side of the boundary\n• Guide incoming law enforcement to the incident location\n• Keep a clear path for emergency vehicles",
    "keyPoints": [
      "Authority is limited to private property — no power to direct public roadway traffic",
      "OCGA § 40-6-2: directing public road traffic is exclusively law enforcement authority",
      "Traffic violations are not felonies — no arrest authority for traffic incidents",
      "Incidents affecting public roads: call law enforcement, manage your private property side only"
    ],
    "legalRef": "OCGA § 40-6-2 (traffic control authority — peace officers only on public roads); OCGA § 40-6-16 (obedience to traffic control officers); common law private property rights",
    "callout": "Directing traffic on a public street without authority is both illegal and creates personal and employer liability for any accident that results.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Hand Signal Standards & High-Visibility Equipment",
    "body": "When directing vehicle traffic, standardized hand signals ensure drivers understand your directions consistently. Using non-standard signals creates confusion and accident risk.\n\nSTANDARD TRAFFIC CONTROL HAND SIGNALS:\n• STOP: Face traffic, extend arm horizontally at shoulder height, palm facing traffic — hold until confirmed\n• PROCEED: Face traffic, extend arm toward direction of travel, sweep inward to motion vehicles forward\n• SLOW DOWN: Face traffic, extend arm horizontally, palm facing down, move arm up and down slowly\n• TURN LEFT: Extend left arm straight out from body\n• TURN RIGHT: Extend right arm straight out from body\n• EMERGENCY STOP: Both arms raised, palms out — signals all traffic to stop immediately\n\nREQUIRED EQUIPMENT:\n• High-visibility (fluorescent yellow-green or orange) traffic vest — ANSI/ISEA 107 Class 2 minimum for roadway-adjacent work\n• Illuminated baton or flashlight during hours of darkness\n• Whistle for attention in high-noise environments\n\nPOSITIONING:\n• Stand in a position clearly visible to all traffic approaching the control point\n• Never stand in the path of vehicles you are stopping — stand to the side\n• Maintain eye contact with each driver before signaling them to proceed",
    "keyPoints": [
      "Standard signals: Stop (palm out), Proceed (sweep inward), Slow (palm down oscillating)",
      "ANSI/ISEA 107 Class 2 vest minimum for traffic adjacent to roadways",
      "Stand to the side of traffic — never in the path of vehicles you are stopping",
      "Eye contact before proceeding signal — never wave a driver forward you cannot see"
    ],
    "legalRef": "ANSI/ISEA 107 High-Visibility Safety Apparel Standard; MUTCD (Manual on Uniform Traffic Control Devices) — hand signal standards; OSHA 29 C.F.R. 1926.201 (flagger requirements)",
    "callout": "A driver who cannot clearly see your signal will make their own decision — and it may not be the one you intended. Visibility and clarity are non-negotiable.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Parking Enforcement & Citation Documentation",
    "body": "Parking enforcement on private property is authorized by the property owner and documented in the parking management agreement or post order.\n\nCOMMON PRIVATE PROPERTY VIOLATIONS:\n• Fire lane parking — most legally consequential; fire lane blockage can result in property owner liability and hinder emergency response\n• Unauthorized use of reserved/accessible spaces (including ADA spaces)\n• Vehicles parked beyond maximum time limits\n• Vehicles on private property without business purpose\n\nPARKING NOTICE PROCEDURE:\n1. Confirm the violation — verify no permit exists, verify the space designation is clearly marked\n2. Document: photograph the violation if camera is available (date/time stamp)\n3. Record: plate number, make, model, color, violation type, date, time, your identification\n4. Issue notice: affix parking violation notice to windshield per property protocol\n5. Log: enter in parking log — this supports towing authorization if applicable\n\nADA ACCESSIBLE SPACES:\n• Unauthorized use of accessible parking spaces is a state offense under OCGA § 40-6-226\n• Law enforcement can issue citations for ADA violations on private property accessible to the public\n• Call law enforcement for ADA violations — do not issue your own citation for a statutory offense\n\nTOWING AUTHORITY:\n• Towing from private property requires compliance with OCGA § 44-1-13 — specific signage and towing company registration",
    "keyPoints": [
      "Fire lane enforcement is a life-safety function — prioritize over other parking violations",
      "ADA violations: call law enforcement — OCGA § 40-6-226 citations require peace officer authority",
      "Document every violation: plate, make/model/color, time, photo if available",
      "Towing requires OCGA § 44-1-13 compliance: posted signage and registered towing company"
    ],
    "legalRef": "OCGA § 40-6-226 (ADA accessible parking enforcement); OCGA § 44-1-13 (private property towing); ADA Standards for Accessible Design",
    "callout": "Towing a vehicle improperly — without the required signage or from a non-designated area — exposes the property owner to civil liability and you to personal liability.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Traffic Control & Parking Enforcement Checklist",
    "body": "Apply these standards on every traffic control and parking enforcement assignment.",
    "keyPoints": [
      "EQUIPMENT: High-visibility vest (ANSI Class 2+), illuminated baton for night work, whistle for high-noise environments",
      "POSITIONING: Stand at the side of the traffic flow — never in the path of stopping vehicles",
      "SIGNALS: Use standardized hand signals only — eye contact before each proceed signal",
      "PRIVATE PROPERTY ONLY: Do not direct public roadway traffic — call law enforcement",
      "FIRE LANES: Clear fire lanes as first priority — photograph and log any violations",
      "ADA VIOLATIONS: Call law enforcement — do not self-issue statutory citations",
      "PARKING LOG: Record every violation: plate, vehicle, time, violation type, action taken",
      "TOWING: Confirm OCGA § 44-1-13 signage compliance before authorizing tow",
      "INCIDENTS: Any vehicle accident on property — preserve scene, call 911, complete incident report"
    ],
    "legalRef": "OCGA § 40-6-2; OCGA § 40-6-226; OCGA § 44-1-13; ANSI/ISEA 107; MUTCD",
    "callout": "Traffic control mistakes can cause accidents. When in doubt about your authority or the situation, stop and call your supervisor before acting.",
    "narrationUrl": null
  }
]
$slides_uas21$
);

-- ============================================================
-- UAS-22: Drug & Alcohol Awareness in the Workplace
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-22',
'Drug & Alcohol Awareness in the Workplace',
$slides_uas22$
[
  {
    "type": "slide",
    "heading": "Recognizing Signs of Impairment — Observation Standards",
    "body": "Security officers regularly encounter persons who may be impaired by alcohol or controlled substances. Your role is observation and reporting — not diagnosis. Recognizing behavioral and physical indicators of impairment allows you to report accurately and take appropriate protective action.\n\nALCOHOL IMPAIRMENT INDICATORS:\n• Odor of alcohol on breath or person\n• Slurred speech or difficulty forming sentences\n• Bloodshot, watery, or glassy eyes\n• Unsteady gait, loss of balance, leaning on objects for support\n• Drowsiness or difficulty maintaining attention\n• Inappropriate behavior for the context (aggressive, overly familiar, confused about location)\n\nDRUG IMPAIRMENT INDICATORS (stimulants — cocaine, methamphetamine):\n• Extreme agitation, rapid speech, hyperactivity\n• Dilated pupils, elevated heart rate visible at pulse points\n• Excessive sweating unrelated to ambient temperature\n• Paranoid behavior or grandiosity\n\nDRUG IMPAIRMENT INDICATORS (depressants — opioids, benzodiazepines):\n• Extreme drowsiness or 'nodding off' while standing or sitting\n• Pinpoint (constricted) pupils\n• Slow, labored, or shallow breathing\n• Pale or bluish skin coloration (a medical emergency — call EMS immediately)\n\nIMPORTANT: Pale/bluish skin with pinpoint pupils and unresponsiveness may indicate opioid overdose — a life-threatening emergency requiring immediate 911 call.",
    "keyPoints": [
      "Alcohol: odor, slurred speech, unsteady gait, bloodshot eyes, inappropriate behavior",
      "Stimulants: agitation, dilated pupils, rapid speech, paranoid behavior",
      "Depressants: extreme drowsiness, pinpoint pupils, slow breathing",
      "Bluish skin + pinpoint pupils + unresponsiveness = possible overdose — call 911 immediately"
    ],
    "legalRef": "OCGA § 40-6-391 (DUI — recognizing impairment for reporting purposes); GBPDSA Code of Conduct (professional observation standards)",
    "callout": "You are an observer, not a diagnostician. Document what you see and report it. Do not accuse persons of being impaired — describe what you observed.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Security Officer Obligations When Impairment Is Observed",
    "body": "When you observe signs of impairment in a person on your property, your obligations depend on their role and the context.\n\nCLIENT/VISITOR IMPAIRMENT:\n• If the person is driving or about to drive: notify supervisor immediately; do not allow a visibly impaired person to drive from your property — call law enforcement if they attempt to drive\n• If the person is disruptive: follow your de-escalation and removal procedures\n• If the person shows signs of medical emergency (overdose indicators): call 911 immediately\n\nEMPLOYEE IMPAIRMENT (a co-worker or facility employee who appears impaired):\n• This is a sensitive situation requiring discretion — report to your supervisor, not to the employee's coworkers\n• Do not make the report in front of the subject or other employees\n• Your supervisor or the client's HR will make fitness-for-duty determination — not you\n• Ensure the subject does not operate machinery or vehicles while the matter is being addressed\n\nYOUR OWN FITNESS FOR DUTY:\n• Georgia drug-free workplace policies under OCGA § 34-9-415 require employees in safety-sensitive roles to be drug-free\n• If you report unfit for duty, you must notify your supervisor before beginning your shift\n• Working while impaired exposes you to disciplinary action, termination, license revocation, and personal liability for any injury that occurs on your watch",
    "keyPoints": [
      "Impaired driver: notify supervisor + call law enforcement if they attempt to drive",
      "Overdose signs: call 911 immediately — this is a medical emergency above all other considerations",
      "Employee impairment: report privately to supervisor, not to coworkers — HR makes fitness determination",
      "Your own fitness: report before shift begins — working while impaired = personal and professional liability"
    ],
    "legalRef": "OCGA § 34-9-415 (drug-free workplace — safety-sensitive positions); OCGA § 40-6-391 (allowing intoxicated driver to drive — potential liability); GBPDSA licensing revocation grounds",
    "callout": "If you observe signs of impairment in yourself or a colleague, do not begin the shift. Address it before anything else.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Documentation Requirements for Impairment Observations",
    "body": "Impairment observations must be documented with the same precision you would apply to any other incident — because they often precede or accompany other incidents, and your documentation may be used in disciplinary, criminal, or civil proceedings.\n\nWHAT TO DOCUMENT:\n• Date, time, and location of observation\n• Physical description of the individual (not name unless obtained)\n• Specific behaviors and physical indicators observed — use objective language\n  CORRECT: 'Subject was unsteady on feet, required contact with wall to maintain balance. Odor consistent with alcohol was detected within 3 feet of subject.'\n  INCORRECT: 'Subject appeared drunk.'\n• Duration of observation and context (what was subject doing?)\n• Actions taken: supervisor notified, law enforcement called, subject transported by EMS\n• Names of witnesses to the subject's behavior\n• Any statements made by the subject\n\nCHAIN OF REPORTS:\n• Your incident report → your supervisor → client HR or management\n• Any law enforcement involvement: obtain officer name, badge number, agency, and incident number\n• If EMS was called: obtain unit number and transporting hospital if possible\n\nCONFIDENTIALITY:\n• Impairment reports involving employees are sensitive HR records\n• Do not discuss the incident with uninvolved personnel\n• Your documentation goes to your supervisor — not posted, not shared informally",
    "keyPoints": [
      "Objective language only: describe specific behaviors and physical indicators, not conclusions",
      "Document: time, location, description, specific observations, actions taken, witnesses",
      "Chain of reports: supervisor → client HR — maintain confidentiality throughout",
      "Law enforcement/EMS: obtain officer name/badge and unit number for complete documentation"
    ],
    "legalRef": "GBPDSA Code of Conduct (confidentiality); OCGA § 34-9-415; employer confidentiality obligations",
    "callout": "The words 'appeared drunk' in an incident report are subjective and challengeable. 'Unsteady gait, odor of alcohol, slurred speech' are objective and defensible.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Drug & Alcohol Impairment Observation Checklist",
    "body": "Follow this protocol when you observe signs of impairment in any person on your property.",
    "keyPoints": [
      "OVERDOSE EMERGENCY: Bluish skin, pinpoint pupils, unresponsive = 911 immediately — everything else follows",
      "OBSERVE: Document specific behavioral and physical indicators — never a conclusion alone",
      "REPORT: Notify supervisor immediately and privately — not in front of subject or uninvolved staff",
      "DRIVING RISK: Do not allow a visibly impaired person to drive from your property — call law enforcement if they attempt to leave in a vehicle",
      "EMPLOYEE IMPAIRMENT: Supervisor and HR make fitness-for-duty determination — your role is observation and report",
      "DOCUMENTATION: Objective language, specific observations, time/location, actions taken, witnesses",
      "CONFIDENTIALITY: Impairment reports are sensitive — discuss only with direct supervisor and required parties",
      "OWN FITNESS: If you are impaired, notify supervisor before shift — do not begin duty"
    ],
    "legalRef": "OCGA § 34-9-415; OCGA § 40-6-391; GBPDSA Code of Conduct; GBPDSA licensing standards",
    "callout": "A consistent, objective impairment report is a professional document. It protects the subject, the facility, and you — from the consequences of acting on incorrect assumptions.",
    "narrationUrl": null
  }
]
$slides_uas22$
);

-- ============================================================
-- UAS-23: Customer Service & Professional Image
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-23',
'Customer Service & Professional Image',
$slides_uas23$
[
  {
    "type": "slide",
    "heading": "The Security Officer as the Client's Frontline Representative",
    "body": "Every person who enters a facility sees the security officer first. Before they see a manager, a salesperson, or a receptionist — they see you. That interaction forms their first impression of the client organization. Research on service quality consistently shows that first impressions are anchored in seconds and persist through the remainder of the customer's experience.\n\nFor security companies, professional conduct is not just ethics — it is a business survival issue. Security contracts are awarded based on price, credentials, and professionalism. They are lost based on conduct.\n\nYour professional image communicates:\n• Competence: 'This organization takes security seriously'\n• Courtesy: 'This organization values the people who come here'\n• Authority: 'This organization has standards that will be enforced'\n\nWhen you present as professional, you accomplish the most powerful security objective without a single confrontation: you deter. Studies on deterrence consistently show that a visible, professional, alert security presence reduces opportunistic crime more effectively than reactive enforcement.",
    "keyPoints": [
      "Security officer = client's first impression; that impression anchors the entire visit",
      "Professionalism signals competence, courtesy, and authority simultaneously",
      "Deterrence is more effective than reactive enforcement — professional presence achieves it",
      "Contract retention for security companies depends on officer conduct more than any other variable"
    ],
    "legalRef": "GBPDSA Code of Professional Conduct; ASIS International Security Management Standard",
    "callout": "The best security incident is the one that never happens because a professional officer's presence made a would-be offender recalculate.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Professional Appearance Standards",
    "body": "A security officer's appearance is a uniform — and a uniform communicates authority, trustworthiness, and organizational standards. Off-standard appearance undermines all three.\n\nMINIMUM PROFESSIONAL APPEARANCE STANDARDS:\n• Uniform: Clean, pressed, complete — all patches, badges, and required identifiers in place\n• Footwear: Polished, appropriate to post assignment, slip-resistant\n• Grooming: Hair clean and controlled per employer policy; facial hair within policy limits\n• No personal items on uniform that are not part of the authorized kit\n• Badge: Visible at all times during duty; never obscured by outerwear\n• GBPDSA license: Current and carried on person during duty (OCGA § 43-38-10 requires licensees to display on request)\n• Equipment: Radio holstered or carried per post order\n\nCONDUCT APPEARANCE:\n• Standing or sitting posture — alert, not slouched\n• Eye contact and acknowledgment of persons entering your area\n• Hands out of pockets during active patrol\n• No personal phone use during active patrol or post coverage\n\nThe employer's appearance policy governs specifics — but the principle is constant: you look like what you are.",
    "keyPoints": [
      "Uniform clean and complete — all identifiers, badges, and patches in regulation position",
      "GBPDSA license carried and displayable on request at all times during duty",
      "No personal phone use during active patrol or post coverage",
      "Posture, eye contact, and alert bearing communicate authority without a word"
    ],
    "legalRef": "OCGA § 43-38-10 (GBPDSA license display requirement); GBPDSA Code of Professional Conduct; employer uniform policy",
    "callout": "A security officer on a phone call with their back to the entrance is not providing security — they are providing the appearance of security. These are very different things.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Effective Public Communication & Handling Difficult Persons",
    "body": "Most interactions between security officers and the public are routine — directions, inquiries, credential checks. Handling these with courtesy and clarity builds the professional reputation that makes difficult interactions easier when they occur.\n\nCOMMUNICATION PRINCIPLES:\n• Greet first: 'Good morning / Good afternoon' before any request for identification or assistance\n• Be direct and clear: avoid jargon, give one instruction at a time\n• Listen actively: let the person finish their sentence before responding\n• Match the situation: warm and helpful for inquiries; firm and clear for compliance requests\n\nHANDLING DIFFICULT PERSONS:\n1. Stay calm: your emotional tone sets the tone for the interaction\n2. Acknowledge their concern: 'I understand you're frustrated, and I want to help.' — validation before explanation\n3. State the rule once clearly: do not repeat the same phrase multiple times — it reads as escalation\n4. Offer alternatives if possible: 'I can't allow you into this area, but I can connect you with someone who can assist you from the lobby.'\n5. Know your limit: when a person will not comply and is not a physical threat, call your supervisor\n6. Document: every difficult interaction deserves a log entry\n\nFEEDBACK AND COMPLAINTS:\n• Accept complaints professionally: 'Thank you for letting me know. I will pass this to my supervisor.'\n• Never argue about the outcome of a past incident\n• Direct all complaints to your supervisor — you do not have authority to adjudicate complaints",
    "keyPoints": [
      "Greet before requesting compliance — courtesy reduces resistance before it forms",
      "Acknowledge frustration before explaining the rule — validation is not agreement",
      "State the rule once clearly — repetition reads as aggression and escalates",
      "Know your limit: supervisor call, not ongoing escalation, when verbal compliance fails"
    ],
    "legalRef": "GBPDSA Code of Professional Conduct; ASIS International Security Management Standard",
    "callout": "A security officer who de-escalates a difficult interaction without incident has accomplished more than one who escalated to force unnecessarily. The goal is resolution, not victory.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Professional Conduct & Contract Retention",
    "body": "Security companies operate on thin margins and high competition. Contract loss is the primary existential risk for most firms. And the number one cause of contract loss is not price — it is officer conduct.\n\nBehaviors that most commonly result in contract loss:\n• An officer sleeping on post — documented by client CCTV\n• An officer using a personal phone during active duty hours\n• A patron complaint about discourteous treatment that goes to the client's management\n• An officer mishandling a situation in a way that becomes a social media incident\n• An officer failing to document an incident that later becomes a lawsuit\n\nYour conduct is your employer's product. When you perform with professionalism, your employer retains the contract, you retain your job, and the client retains their confidence that their facility is secure.\n\nADDITIONAL PROFESSIONAL OBLIGATIONS:\n• Arrive on time — late relief costs the agency and causes legal exposure if the prior shift officer is injured during the gap\n• Brief the relieving officer completely — all incidents, active holds, and unusual conditions from your shift\n• Never abandon your post without relief — this is a terminable offense and a potential GBPDSA violation\n• Treat all colleagues, clients, and members of the public with the dignity your position demands",
    "keyPoints": [
      "Contract loss is the primary business risk — officer conduct is the primary cause",
      "Phone use, sleeping on post, and discourtesy are the top conduct-driven contract loss triggers",
      "Brief your relief completely — all incidents, holds, and unusual conditions",
      "Never abandon post without relief — terminable offense and potential GBPDSA violation"
    ],
    "legalRef": "OCGA § 43-38-10 et seq. (GBPDSA professional standards); GBPDSA Code of Conduct (abandonment of post grounds for revocation)",
    "callout": "Your professionalism is your employer's reputation. Your employer's reputation is what keeps the contract — and your job — alive.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Professional Conduct Daily Checklist",
    "body": "Apply these standards every shift as a baseline for professional security service.",
    "keyPoints": [
      "APPEARANCE: Uniform clean and complete, badge visible, GBPDSA license on person and displayable",
      "ARRIVAL: On time; brief from outgoing officer received — all incidents, active holds, unusual conditions noted",
      "COMMUNICATION: Greet persons entering your area; answer inquiries courteously and clearly",
      "PATROL: Alert posture, hands out of pockets, no personal phone use during active patrol",
      "DOCUMENTATION: Every incident and notable observation logged before end of shift",
      "DIFFICULT INTERACTIONS: Acknowledge, explain, offer alternative, call supervisor if non-compliant",
      "COMPLAINTS: Accept professionally, route to supervisor, do not argue about past incidents",
      "RELIEF: Brief outgoing officer completely; never abandon post without relief"
    ],
    "legalRef": "OCGA § 43-38-10; GBPDSA Code of Professional Conduct; ASIS International Security Management Standard",
    "callout": "Professional conduct is not a peak performance — it is the daily baseline. The most effective security officer makes it look effortless, every shift.",
    "narrationUrl": null
  }
]
$slides_uas23$
);

-- ============================================================
-- UAS-24: Final Accreditation Examination
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-24',
'Final Accreditation Examination',
$slides_uas24$
[
  {
    "type": "slide",
    "heading": "UAS Final Accreditation Examination — Overview",
    "body": "This examination is the capstone assessment for the MJM 2026 Unarmed Security Officer (UAS) accreditation under Georgia's 24-hour training standard (GA Admin Code 509-3-.01). Successful completion, combined with your GBPDSA license application, fulfills the training requirement for the unarmed security officer registration in the State of Georgia.\n\nEXAMINATION STRUCTURE:\n• 10 questions drawn from all 23 content modules (UAS-01 through UAS-23)\n• Questions cover Georgia law, use-of-force limits, emergency procedures, access control, report writing, and professional ethics\n• Minimum passing score: 85% (9 of 10 correct)\n• Three critical questions: any wrong answer on a critical question triggers a 24-hour mandatory review period before re-attempt\n• Unlimited re-attempts after the review period — each attempt is a fresh examination\n\nWHAT THIS EXAM ASSESSES:\nThis examination does not test your memory of module numbers or lecture headings. It tests your ability to apply Georgia law and professional standards to real operational scenarios — the same situations you will face on post, at 0200, when there is no supervisor to call.",
    "keyPoints": [
      "85% minimum passing score required for accreditation",
      "10 questions covering all 23 content modules",
      "Three critical questions — wrong answer triggers 24-hour review period",
      "Tests applied knowledge, not rote memorization"
    ],
    "legalRef": "GA Admin Code 509-3-.01 (24-hour unarmed security training requirement); OCGA § 43-38-10 (GBPDSA licensing — training prerequisite)",
    "callout": "This examination stands between your training and your license. Treat it accordingly.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "What Georgia Law Requires of You — A Final Review",
    "body": "Before you begin the examination, review the legal framework that governs every action you take as a licensed unarmed security officer in Georgia.\n\nAUTHORITY:\n• You are not a peace officer — you are an authorized agent of a private property owner\n• Your arrest authority: felony in your presence only (OCGA § 17-4-60)\n• Your detention authority: none — you may request a person remain; you may not compel it for misdemeanors\n\nUSE OF FORCE:\n• Only proportional to the threat you face\n• Only when necessary to protect yourself or others from imminent bodily harm\n• Documented immediately after any use\n\nSEARCH & SEIZURE:\n• Consensual searches only — refusal ends your authority\n• No warrantless searches of persons or property without consent\n\nREPORTING:\n• Every incident reported contemporaneously in objective language\n• No alteration of reports after the fact\n\nLICENSING:\n• GBPDSA license current and on your person during every shift\n• Renewal obligations met — lapsed license = working without authority\n\nETHICS:\n• Prohibited conduct: bribery, unauthorized disclosure, use of position for personal gain\n• Mandatory reporting: witnessed misconduct by fellow officers",
    "keyPoints": [
      "Arrest authority: felony in presence only — OCGA § 17-4-60",
      "Use of force: proportional, necessary, documented",
      "Searches: consensual only — refusal ends your authority",
      "GBPDSA license: on person every shift, current, renewal obligations met"
    ],
    "legalRef": "OCGA § 17-4-60; OCGA § 43-38-10; OCGA § 16-3-21; GBPDSA Code of Conduct; GA Admin Code 509-3-.01",
    "callout": "The law does not give you a pass because you were uncertain. Know your authority and stay within it — every shift, every incident.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Critical Questions — What They Test & Why",
    "body": "Three questions in this examination are designated as critical. A wrong answer on any critical question triggers a mandatory 24-hour review period before you may re-attempt the examination.\n\nCritical questions test three areas where mistakes cause irreversible harm:\n\n1. USE OF FORCE LIMITS: Misunderstanding your force authority can result in criminal charges, civil liability, and serious injury. The standard must be second nature.\n\n2. ARREST AUTHORITY: Performing an unlawful arrest or detention violates the subject's constitutional rights and exposes you and your employer to false imprisonment claims under OCGA § 51-7-20.\n\n3. EMERGENCY PRIORITY: Responding to a major emergency in the wrong priority order — evidence before life safety, for instance — can cost a life. The life-safety-first principle is non-negotiable.\n\nIf you are required to review before re-attempting: use the 24 hours. Return to the modules covering your missed areas. The examination is not punitive — it ensures that anyone who holds this certificate has genuinely mastered the material that keeps both the public and the officer safe.\n\nGood luck. The State of Georgia, your employer, and the public you protect are counting on you to know this material.",
    "keyPoints": [
      "Three critical questions: use of force, arrest authority, emergency priority order",
      "Wrong critical answer = 24-hour mandatory review period, not permanent disqualification",
      "Use the review period — re-read the relevant modules before re-attempting",
      "Mastery of these three areas protects you, the public, and your employer"
    ],
    "legalRef": "GA Admin Code 509-3-.01; OCGA § 51-7-20; OCGA § 16-3-21; OCGA § 17-4-60",
    "callout": "The examination begins when you click Begin Knowledge Assessment. Review these three areas one more time before you start.",
    "narrationUrl": null
  }
]
$slides_uas24$
);
