-- ============================================================
-- 020_uas_lessons_13_18.sql
-- Slide content for UAS-13 through UAS-18
-- Unarmed Security Officer track — GBPDSA 24-hour standard
-- ============================================================

DELETE FROM public.module_lessons WHERE module_id IN (
  'UAS-13','UAS-14','UAS-15','UAS-16','UAS-17','UAS-18'
);

-- ============================================================
-- UAS-13: Terrorism Awareness & Suspicious Activity Reporting
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-13',
'Terrorism Awareness & Suspicious Activity Reporting',
$slides_uas13$
[
  {
    "type": "slide",
    "heading": "Your Role in the Nation's First Line of Defense",
    "body": "Security officers are among the most visible public-safety professionals in the country. You observe behavior across thousands of facilities daily — warehouses, hospitals, government buildings, transit hubs, and shopping centers. That visibility makes you a critical node in the national suspicious activity reporting (SAR) network.\n\nThe Department of Homeland Security's \"If You See Something, Say Something\" initiative is built on exactly this premise: trained observers who know their environment are more likely than anyone else to detect pre-attack surveillance or logistical activity before an attack occurs.",
    "keyPoints": [
      "Security officers have front-row access to anomalous behavior at critical facilities",
      "SAR is a formal federal initiative — your reports flow into law enforcement fusion centers",
      "Early detection saves lives; the goal is reporting, not apprehension"
    ],
    "legalRef": "6 U.S.C. § 1401 et seq. (Nationwide SAR Initiative); DHS \"If You See Something, Say Something\" Program",
    "callout": "Your job is to OBSERVE and REPORT — not to investigate, confront, or detain terrorism suspects.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Indicators of Terrorist Pre-Attack Activity",
    "body": "Terrorists don't appear from nowhere on attack day. They conduct surveillance, test responses, acquire materials, and rehearse — often over weeks or months. Recognizing these indicators is your core task.\n\nThe AVIAN framework (Acquisition, Vigilance, Intrusion, Actions, Nefarious) is used by DHS and fusion centers to categorize SAR indicators. Security officers most commonly encounter Vigilance (surveillance) and Acquisition indicators.\n\nKey behavioral indicators:\n• Unusual photography or video of security systems, entry/exit points, or mechanical infrastructure\n• Repeated presence of the same person at irregular hours without legitimate purpose\n• Requests for information about schedules, staffing, security procedures, or emergency response times\n• Individuals testing security responses — probing checkpoints or triggering alarms to observe reaction\n• Unusual interest in acquiring uniforms, credentials, or access passes\n• Abandoned bags, vehicles, or items in sensitive locations",
    "keyPoints": [
      "Surveillance: repeated presence, photography of security systems, route-mapping behavior",
      "Acquisition: requests for restricted information, interest in credentials or uniforms",
      "Testing: deliberately triggering alarms or probing access points to observe response times",
      "Document time, location, description, and direction of travel — not conclusions"
    ],
    "legalRef": "DHS SAR Functional Standard v1.5; Georgia Fusion Center SAR Reporting Protocol",
    "callout": "Document what you OBSERVE. Write behavior and appearance — never write conclusions like 'looks like a terrorist.'",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Georgia Fusion Center & Reporting Channels",
    "body": "The Georgia Bureau of Investigation (GBI) operates the Georgia Information Sharing and Analysis Center (GISAC), the state's primary fusion center. Fusion centers aggregate SAR reports from law enforcement, private security, and the public — then analyze, deduplicate, and route intelligence to the appropriate agencies.\n\nAs a security officer, your reporting chain is:\n1. Report immediately to your supervisor or dispatch\n2. Your agency routes to local law enforcement\n3. Local law enforcement enters into the SAR system → routes to GISAC as appropriate\n\nFor imminent threats or active surveillance that represents immediate danger, call 911 first.\n\nFor non-emergency suspicious activity, your agency may have a direct line to local law enforcement liaison units.",
    "keyPoints": [
      "GISAC (GBI fusion center) aggregates private security SAR reports across Georgia",
      "Non-emergency SAR: report to supervisor → agency → law enforcement liaison",
      "Imminent threat: 911 first, then supervisor and incident report",
      "Your written report becomes a permanent record in the SAR system"
    ],
    "legalRef": "OCGA § 35-3-190 et seq. (GBI Information Sharing); 28 C.F.R. Part 23 (Criminal Intelligence Systems)",
    "callout": "Never attempt to follow or detain a suspected terrorist. Your role ends at the report.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Prohibited Profiling — What SAR Is Not",
    "body": "Suspicious activity reporting must be grounded in observed behavior — not in race, ethnicity, national origin, religion, gender, sexual orientation, or disability. Profiling based on these characteristics:\n• Violates civil rights law (42 U.S.C. § 1983; Title VI of the Civil Rights Act)\n• Exposes you and your employer to civil liability\n• Undermines the SAR program's effectiveness by flooding the system with noise\n• Is explicitly prohibited by the DHS SAR Functional Standard\n\nA valid SAR indicator: A person photographs the access control panel and guard station from multiple angles, then leaves and returns the next day and does the same.\n\nAn invalid basis for SAR: A person wearing religious attire walks past the building entrance twice.",
    "keyPoints": [
      "SAR must be based on observed behavior, never appearance or identity characteristics",
      "Profiling-based reports violate federal civil rights law and DHS SAR standards",
      "Invalid profiling exposes officers and agencies to civil rights lawsuits",
      "Behavioral indicators are specific, articulable, and documented — not instinct"
    ],
    "legalRef": "42 U.S.C. § 1983; Title VI Civil Rights Act of 1964; DHS SAR Functional Standard v1.5 § 3.1",
    "callout": "Ask yourself: 'What specific behavior am I observing?' If the answer refers to appearance rather than action, stop and reconsider.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Photographer at Gate 3",
    "body": "You are on post at Gate 3 of a water treatment facility at 10:45 AM. A man in civilian clothing parks his car in the adjacent lot and spends approximately 12 minutes photographing the gate control panel, the fencing system, the security camera positions, and the approach road. He does not approach the gate. He then drives away.\n\nAt 2:15 PM the same individual returns. He parks in the same spot and makes a phone call while appearing to observe shift change at the gate for 20 minutes. He leaves when the shift change is complete.\n\nThere is no law against photography on public property adjacent to the facility.",
    "keyPoints": [
      "OBSERVE: Document both incidents with times, descriptions, vehicle (plate if visible), direction of departure",
      "REPORT: Notify supervisor immediately and complete a written incident report for both occurrences",
      "DO NOT: Approach, question, or follow the individual — this is a law enforcement function",
      "ESCALATE: Because the subject returned and appeared to observe shift change specifically, the supervisor should contact law enforcement for a SAR submission",
      "PRESERVE: Your contemporaneous notes are the foundation of any law enforcement investigation"
    ],
    "legalRef": "DHS SAR Functional Standard; OCGA § 16-11-62 (surveillance recording restrictions do not apply to officers on duty)",
    "callout": "Two visits in one day, focused on security infrastructure and shift timing — this meets the threshold for a formal SAR report. Write it up completely.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "SAR Field Checklist",
    "body": "When you observe behavior that may warrant a SAR report, capture these elements before the subject leaves your observation area.",
    "keyPoints": [
      "Date, time, and exact location of the observed behavior",
      "Full physical description: sex, approximate age, height, build, clothing, hair, distinguishing features",
      "Direction of travel and means of transportation (vehicle make, model, color, plate if visible)",
      "Exact nature of the activity — what specifically did the person do, say, or photograph?",
      "Duration of observation and any return visits",
      "Witnesses present (names/contact info if obtainable)",
      "Any items carried, left behind, or retrieved",
      "Your identity, post location, and supervisor notified"
    ],
    "legalRef": "DHS SAR Functional Standard v1.5; Georgia Fusion Center Reporting Guidelines",
    "callout": "A complete SAR report is factual, behavioral, and specific. Vague reports are discarded. Detailed reports save lives.",
    "narrationUrl": null
  }
]
$slides_uas13$
);

-- ============================================================
-- UAS-14: Bomb Threats & Suspicious Package Protocols
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-14',
'Bomb Threats & Suspicious Package Protocols',
$slides_uas14$
[
  {
    "type": "slide",
    "heading": "Taking Bomb Threats Seriously — Every Time",
    "body": "The overwhelming majority of bomb threats are hoaxes. But security officers do not have the ability to determine which threats are real in the moment — that determination requires trained explosive ordnance professionals. Your legal and professional obligation is to treat every bomb threat as real until law enforcement and EOD personnel determine otherwise.\n\nFailing to evacuate based on a threat that turns out to be real exposes you, your employer, and the client to catastrophic liability and criminal negligence claims. The cost of an unnecessary evacuation is disruption. The cost of a missed threat is lives.\n\nThis module covers two scenarios: (1) receiving a bomb threat call, and (2) encountering a suspicious package.",
    "keyPoints": [
      "Treat every bomb threat as credible until EOD clears it",
      "You cannot assess credibility — that is an EOD function",
      "Unnecessary evacuation costs: inconvenience. Missed threat costs: lives",
      "Document everything from the first second of the call"
    ],
    "legalRef": "18 U.S.C. § 844(e) (bomb threat federal crime); OCGA § 16-11-37 (terroristic threats, Georgia); DHS Bomb Threat Guidance",
    "callout": "The moment you receive a threat, your sole job is to notify the chain of command and begin documentation.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Bomb Threat Call Procedure — DHS Checklist",
    "body": "If you receive a bomb threat by phone:\n\n1. STAY CALM — keep the caller on the line as long as possible\n2. SIGNAL a colleague to call 911 while you continue the call — do not hang up\n3. ACTIVATE the DHS Bomb Threat Checklist (printed copy should be at your post)\n4. RECORD every detail: exact words used, voice characteristics, background sounds, accent, speech patterns, emotional state\n5. NOTE the time the call was received and when the caller disconnected\n6. DO NOT share threat details with other staff — only your supervisor and law enforcement\n7. PRESERVE the phone — do not use it for other calls; it may be needed for trace or evidence\n\nDHS Bomb Threat Checklist key fields:\n• Exact time: ___\n• Exact words of caller: ___\n• Where is the bomb? (ask the caller)\n• When will it go off? (ask the caller)\n• What does it look like? (ask the caller)\n• Why are you doing this? (ask the caller)\n• Caller's voice: calm / excited / slow / rapid / soft / loud / accent\n• Background noise: voices / traffic / music / other",
    "keyPoints": [
      "Keep the caller on the line — every extra second is information",
      "Signal colleague to call 911 while you listen",
      "Write down exact words — do not paraphrase",
      "Ask the DHS checklist questions if the caller remains on the line",
      "Preserve the phone as potential evidence"
    ],
    "legalRef": "DHS Bomb Threat Guidance; FEMA IS-906 Workplace Security Awareness",
    "callout": "A printed DHS Bomb Threat Checklist should be at every security post. If yours does not have one, request it today.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Suspicious Package Recognition — AVIAN Criteria",
    "body": "A suspicious package may be a bomb, a chemical or biological device, or simply an abandoned item. The decision to treat it as suspicious is based on observable characteristics, not assumption.\n\nRecognition criteria (any one warrants heightened concern; multiple criteria warrant immediate evacuation and EOD call):\n• No return address or a return address that does not match the postmark city\n• Unusual weight for size, or uneven weight distribution\n• Oily stains, unusual odor, or discoloration on the wrapper\n• Protruding wires, strings, or aluminum foil visible\n• Excessive postage (someone avoiding the post office to avoid detection)\n• Unexpected delivery — no one was expecting this package\n• Restricted markings: 'Personal,' 'Private,' 'Confidential,' 'Do Not X-Ray'\n• Poor handwriting, misspelled words, or a generic title instead of a name\n• Rigid envelope or package that should be flexible\n• Ticking, buzzing, or other sounds",
    "keyPoints": [
      "No single indicator confirms a device — it is the totality of criteria",
      "Multiple criteria present = treat as suspicious and act immediately",
      "Do not pick up, move, or attempt to open a suspicious package",
      "Do not attempt to determine if it is real — that is EOD's function"
    ],
    "legalRef": "DHS Bomb Threat Guidance for Workplaces; ATF Suspicious Package Recognition Guidelines",
    "callout": "If it looks suspicious, it IS suspicious. Do not touch, move, or X-ray it. Evacuate and call.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Evacuation Authority, Standoff Distances & Radio Prohibition",
    "body": "When a suspicious package is identified or a bomb threat received:\n\nEVACUATION:\n• Your supervisor or the building emergency coordinator has evacuation authority\n• If neither is reachable and threat is immediate: act — evacuate and notify simultaneously\n• Evacuate laterally and to cover, not toward windows or thin walls\n• Account for all personnel — especially those in areas near the package\n\nSTANDOFF DISTANCES (DHS/ATF minimum):\n• Pipe bomb (small package): 70 feet minimum from all personnel\n• Suicide vest (on a person): 300 feet minimum\n• Vehicle (car): 320 feet minimum; van/truck: 500 feet minimum\n• Postal package: 70 feet minimum\n\nRADIO PROHIBITION:\n• Do NOT use two-way radios, cell phones, or any radio-frequency transmitting device within the standoff distance of a suspected IED\n• RF signals can trigger certain detonators\n• Establish your communications perimeter OUTSIDE the standoff zone\n\nLAW ENFORCEMENT HANDOFF:\n• Meet incoming officers at the perimeter — guide them with your documentation\n• Provide: location of package, exact time found, who touched it, any witnesses",
    "keyPoints": [
      "Evacuation authority: supervisor or emergency coordinator — or you if immediate threat and no one reachable",
      "Standoff: 70 ft minimum (small package); 320 ft (vehicle); 500 ft (van/truck)",
      "NO radios or cell phones inside the standoff perimeter — RF can trigger detonators",
      "Meet law enforcement at the perimeter with your written documentation"
    ],
    "legalRef": "DHS Bomb Threat Guidance; ATF Bomb Threat Management; FEMA IS-320 Bomb Threat Management for Schools (civilian protocol)",
    "callout": "CRITICAL: Using a radio or cell phone near a suspected IED can detonate it. Establish your comms perimeter OUTSIDE the standoff zone.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Unaddressed Box at the Loading Dock",
    "body": "At 2:30 PM on a Tuesday, a warehouse security officer conducting a perimeter patrol discovers a medium-sized brown cardboard box at the rear loading dock. The box has no return address, excessive postage, and a slight oily stain on one corner. The box was not there during the 1:00 PM patrol. Loading dock staff confirm they did not receive a delivery this afternoon and the box was not there when they took a break at 1:45 PM. The dock is approximately 40 feet from the main warehouse entrance where 85 employees are working.",
    "keyPoints": [
      "STOP: Do not touch, move, or open the box",
      "CLEAR the area: The 40-foot distance is inside the minimum standoff — evacuate dock and adjacent areas immediately to 70+ feet",
      "NOTIFY: Call supervisor, call 911 — use your radio only after you are outside the standoff zone",
      "DO NOT use your radio or cell phone until you are at least 70 feet from the box",
      "DOCUMENT: Time found, exact location, physical description of box, who last confirmed the area clear, witness names",
      "HOLD: Keep the area clear until EOD arrives — no one re-enters regardless of curiosity or business disruption",
      "MEET: Guide responding officers to the scene from outside the standoff perimeter"
    ],
    "legalRef": "DHS Bomb Threat Guidance; OCGA § 16-7-85 (hoax devices — criminal penalty for filing false reports)",
    "callout": "The warehouse is 40 feet away — that is inside the minimum standoff. Everyone inside the building must move out until EOD clears the package.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Bomb Threat & Suspicious Package Response Checklist",
    "body": "Execute these steps in order during a bomb threat or suspicious package event.",
    "keyPoints": [
      "THREAT RECEIVED: Keep caller on line, signal colleague to call 911, write exact words",
      "PACKAGE FOUND: Do not touch or move — clear area to standoff distance immediately",
      "NOTIFY: Supervisor → 911 → building emergency coordinator (in this order for threats; 911 first for imminent packages)",
      "RADIO PROHIBITION: No RF devices inside standoff perimeter — move outside first",
      "EVACUATE: Lateral and to cover, away from windows and thin walls — account for all personnel",
      "DOCUMENT: Time, location, description, who was present, what was touched",
      "PERIMETER: Hold the standoff perimeter until EOD clears — no re-entry",
      "HANDOFF: Meet law enforcement at perimeter with written documentation"
    ],
    "legalRef": "DHS Bomb Threat Checklist; ATF Bomb Threat Management Guidelines",
    "callout": "Post-incident: Complete a full written incident report within 2 hours regardless of outcome. Include all times, persons, and actions taken.",
    "narrationUrl": null
  }
]
$slides_uas14$
);

-- ============================================================
-- UAS-15: Crime Prevention Through Environmental Design (CPTED)
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-15',
'Crime Prevention Through Environmental Design (CPTED)',
$slides_uas15$
[
  {
    "type": "slide",
    "heading": "What Is CPTED?",
    "body": "Crime Prevention Through Environmental Design (CPTED) is a security discipline that uses the physical environment to reduce opportunities for crime and the fear of crime. Rather than relying solely on guards and technology, CPTED modifies the environment itself — lighting, landscaping, sight lines, fencing, signage — to deter criminal behavior and increase the perception of risk for potential offenders.\n\nCPTED was formalized by criminologist C. Ray Jeffery in 1971 and expanded by Oscar Newman's 'Defensible Space' theory. Today it is incorporated into building codes, architectural standards, and security assessments worldwide, including by the International CPTED Association (ICA) and the ASIS International Physical Security Professional (PSP) body of knowledge.\n\nAs a security officer, CPTED is a tool for your post assessment and for communicating improvement recommendations to management.",
    "keyPoints": [
      "CPTED modifies the physical environment to reduce criminal opportunity",
      "Complements — does not replace — security personnel and technology",
      "Used in building design, facility assessments, and security audits",
      "Security officers apply CPTED when identifying vulnerabilities at their posts"
    ],
    "legalRef": "ASIS International Physical Security Standard (PSS); International CPTED Association Standards",
    "callout": "CPTED does not eliminate the need for security officers — it makes your job more effective by reducing the number of incidents you must respond to.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "The Four Principles of CPTED",
    "body": "CPTED rests on four core principles. Security officers apply all four during post assessments and vulnerability reporting.\n\n1. NATURAL SURVEILLANCE: Design and maintain the environment so that legitimate users can observe the space. Criminals avoid areas where they can be seen. Examples: clear sight lines, adequate lighting, trimmed vegetation below 3 feet, windows facing parking areas, open lobby designs.\n\n2. NATURAL ACCESS CONTROL: Guide legitimate users through clearly defined entry points while making unauthorized access difficult. Examples: single-entry vestibules, landscaping that channels foot traffic, signage, physical barriers that signal 'this is not a public path.'\n\n3. TERRITORIAL REINFORCEMENT: Create a clear sense that the space is owned, monitored, and maintained. Criminals avoid spaces where someone clearly cares. Examples: clean facilities, working lights, posted rules, branded signage, maintained fencing, employee ID areas clearly marked.\n\n4. MAINTENANCE: A deteriorated environment signals neglect and invites criminal activity ('broken windows' effect). Examples: burned-out lights replaced promptly, graffiti removed immediately, broken fencing repaired, overgrown vegetation cleared.",
    "keyPoints": [
      "Natural Surveillance: see and be seen — clear sight lines, lighting, trimmed landscaping",
      "Natural Access Control: one clear entrance, landscape funnels traffic, barriers deter shortcuts",
      "Territorial Reinforcement: signals ownership and care — signage, branding, rules posted",
      "Maintenance: prompt repair of broken lights, fencing, and vandalism prevents escalation"
    ],
    "legalRef": "ASIS International Physical Security Standard; C. Ray Jeffery, CPTED (1971); Oscar Newman, Defensible Space (1972)",
    "callout": "A single burned-out light in a parking garage can shift criminal perception of the entire structure. Report maintenance deficiencies immediately — every one of them.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Applying CPTED at Your Post",
    "body": "CPTED is not a design exercise for architects alone — it is a daily operational tool for security officers. During every patrol, you should assess your environment through the CPTED lens.\n\nCommon deficiencies to identify and report:\n• Dead angles in CCTV coverage due to camera repositioning or new fixtures blocking view\n• Vegetation that has grown to obscure sight lines to entry/exit points\n• Lighting outages, especially in stairwells, parking areas, and perimeter paths\n• Broken or incomplete fencing that creates unauthorized access paths\n• Signage that has faded, fallen, or been removed — eliminating access control cues\n• Furniture or equipment that has been repositioned to create concealment opportunities\n• 'Informal paths' — worn-down grass indicating staff or visitors are bypassing controlled entry points\n\nWhen you identify a CPTED deficiency, write it in your patrol log with: location, nature of deficiency, date discovered, and recommended corrective action.",
    "keyPoints": [
      "Assess CPTED deficiencies during every patrol — not just formal audits",
      "Dead camera angles, vegetation overgrowth, and lighting outages are top priorities",
      "Informal paths indicate access control failure — people are bypassing your perimeter",
      "Document every deficiency with location, nature, date, and recommended fix"
    ],
    "legalRef": "ASIS International Facilities Physical Security Measures Guideline; GBPDSA Code of Conduct (professional diligence)",
    "callout": "You are the first person to see most CPTED deficiencies. If you don't write it down and report it, it won't get fixed.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Communicating CPTED Findings to Management",
    "body": "Identifying a deficiency is only half the job. Reporting it effectively so that management takes action is the other half.\n\nEffective CPTED deficiency report structure:\n1. LOCATION: Building A, north parking lot, row 3, light pole P-07\n2. DEFICIENCY: Light pole P-07 has been non-operational since [date]. The affected area covers approximately 40 feet of the pedestrian path to the rear entrance.\n3. RISK: This creates a sight-line gap that allows unobserved approach to the rear entrance from the adjacent street.\n4. RECOMMENDATION: Replace lamp or repair fixture. Consider adding a temporary portable light until permanent repair is made.\n5. URGENCY: High — rear entrance receives late-shift staff arrivals between 10 PM and midnight.\n\nThis structure gives management the information they need to prioritize and act. Vague reports ('light is out by parking lot') are frequently deprioritized. Specific, risk-grounded reports get repaired.",
    "keyPoints": [
      "Use the 5-part structure: Location, Deficiency, Risk, Recommendation, Urgency",
      "Quantify where possible: affected footage, time of highest exposure, number of personnel at risk",
      "Risk framing — not just the deficiency — drives management action",
      "Follow up in writing if verbal reports are not acted on within a reasonable timeframe"
    ],
    "legalRef": "ASIS International Security Management Standard; GBPDSA Code of Professional Conduct",
    "callout": "A CPTED finding is only as valuable as the report that communicates it. Write it clearly, specifically, and with recommended action.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Overgrown Corner",
    "body": "During your 0600 patrol of a corporate office park, you notice that a stand of ornamental bushes at the southeast corner of Building C has grown to approximately 5 feet in height. The bushes now completely obstruct the fixed CCTV camera's view of the corner from the lobby monitor station. An informal foot path is visible through the overgrowth — indicating that people are cutting through the bushes to access the rear service entrance rather than using the controlled front entrance. The rear service entrance door is propped open with a wooden wedge.",
    "keyPoints": [
      "DEFICIENCY 1: 5-foot vegetation obstructing CCTV coverage at SE corner — Natural Surveillance failure",
      "DEFICIENCY 2: Informal path through bushes bypassing controlled entry — Natural Access Control failure",
      "DEFICIENCY 3: Rear door propped open — Territorial Reinforcement and Access Control failure",
      "IMMEDIATE ACTION: Remove the door wedge and secure the rear entrance",
      "DOCUMENT: All three deficiencies in patrol log with location, nature, and photo if camera allows",
      "REPORT: Written report to supervisor before end of shift with risk assessment and recommendations",
      "RECOMMEND: Vegetation trimming to 3 feet; CCTV repositioning; physical barrier across informal path; door alarm"
    ],
    "legalRef": "ASIS International Facilities Physical Security Measures Guideline; OCGA § 16-7-21 (trespass — propped door creates unauthorized access risk)",
    "callout": "Three simultaneous CPTED failures at one location = elevated risk. This warrants an urgent written report, not just a patrol log note.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "CPTED Patrol Assessment Checklist",
    "body": "Apply this checklist during every patrol to identify environmental security deficiencies.",
    "keyPoints": [
      "NATURAL SURVEILLANCE: All exterior lights operational? Vegetation below 3 feet at entry points? No new blind spots created by moved furniture or equipment?",
      "CCTV: Camera angles unobstructed? PTZ cameras positioned at current risk areas? Lens clean and undamaged?",
      "NATURAL ACCESS CONTROL: Single controlled entry enforced? Signage clearly directs visitors? No informal paths appearing in landscaping?",
      "TERRITORIAL REINFORCEMENT: All signs posted and legible? No graffiti or vandalism present? Facility appearance clean and maintained?",
      "MAINTENANCE: Lights out — report immediately. Fencing damage — report immediately. Broken locks or door hardware — report immediately and restrict access",
      "DOCUMENT: Every deficiency entered in patrol log with location, date/time, and recommended corrective action",
      "ESCALATE: Any deficiency creating immediate security risk (propped doors, broken perimeter fencing) — notify supervisor before completing patrol"
    ],
    "legalRef": "ASIS International Physical Security Standard; GBPDSA Code of Conduct (professional diligence obligation)",
    "callout": "CPTED is not a once-a-year audit — it is a daily operational habit. Your patrol log is the living record of your facility's environmental security health.",
    "narrationUrl": null
  }
]
$slides_uas15$
);

-- ============================================================
-- UAS-16: Crowd Management & Public Assembly Security
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-16',
'Crowd Management & Public Assembly Security',
$slides_uas16$
[
  {
    "type": "slide",
    "heading": "Crowd Psychology — Why Crowds Behave Differently",
    "body": "A crowd is not simply many individuals standing in proximity — it is a social organism with its own behavioral dynamics. Understanding crowd psychology is the foundation of effective crowd management.\n\nKey crowd psychology concepts for security officers:\n\nDEINDIVIDUATION: In large crowds, individuals experience reduced personal accountability. Behavior they would never exhibit alone becomes possible in a crowd — including violence, property destruction, and panic.\n\nEMOTIONAL CONTAGION: Emotion spreads through crowds rapidly. A single person screaming 'fire' can trigger mass panic even when no fire exists. Conversely, a calm, authoritative voice can arrest panic before it becomes a stampede.\n\nCROWD BEHAVIOR PHASES: Crowds typically progress through: Casual gathering → Aware (something is happening) → Expressive (emotional engagement) → Active (physical movement/action). Your intervention is most effective in the early phases.\n\nIMPLICATION FOR SECURITY: You cannot treat a crowd as a collection of individuals when it has reached the Expressive or Active phase. You must manage the crowd as a unit.",
    "keyPoints": [
      "Deindiviuation reduces personal accountability — behavior norms shift in large crowds",
      "Emotional contagion is rapid — one panicked person can cascade into a stampede",
      "Intervene in the Casual or Aware phase — crowd management in the Active phase is extremely difficult",
      "Manage crowd movement as a unit; individual-level engagement loses effectiveness at scale"
    ],
    "legalRef": "ASIS International Crowd Management Guideline; NFPA 101 Life Safety Code (assembly occupancy)",
    "callout": "Your most powerful crowd management tool is early intervention — before the crowd reaches the Active phase. Waiting makes everything harder.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Crowd Density, Crush Prevention & Ingress/Egress Management",
    "body": "Crowd crush is a genuine life-safety emergency. It does not require violence — it can occur in a fully cooperative crowd that is simply too dense for the available space.\n\nCROWD DENSITY THRESHOLDS:\n• Comfortable flow: 0–1 person per square meter\n• Walking pace movement: 1–2 persons per sq meter\n• Restricted movement: 2–3 persons per sq meter\n• No free movement: 3–4 persons per sq meter\n• Crush risk begins: 4+ persons per sq meter — emergency management required\n• Life-threatening: 6+ persons per sq meter — immediate intervention required\n\nINGRESS MANAGEMENT:\n• Control entry rate — never allow the interior space to exceed safe density\n• Stagger entry points — never all gates open simultaneously if interior is approaching capacity\n• Communicate capacity limit to event organizers BEFORE the event, in writing\n\nEGRESS MANAGEMENT:\n• Plan and communicate primary and secondary exit routes before the event begins\n• Never block an exit route — even temporarily\n• Designate a separate medical/emergency egress path\n• In emergency egress: open all exits simultaneously, direct crowd toward exits using audio (PA) not physical barriers",
    "keyPoints": [
      "Crush risk begins at 4 persons per square meter — monitor density visually during events",
      "Control ingress rate — interior density drives crush risk more than total attendance",
      "All exit routes must be clear and known to all security staff before the event opens",
      "In emergency egress: open all exits, direct by PA audio — do not add physical barriers to panicked crowds"
    ],
    "legalRef": "NFPA 101 Life Safety Code § 12/13 (assembly occupancy); OSHA 29 C.F.R. 1910.37 (exit routes); ASIS International Crowd Management Guideline",
    "callout": "A crowd crush can kill people who are standing upright — they cannot breathe under lateral compression. Density control is a life-safety function.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Working with Event Staff, Law Enforcement & Permit Requirements",
    "body": "Large public assemblies in Georgia require permits from the local jurisdiction under OCGA § 36-60-6 (and local ordinances). Security officers working permitted events operate within a legal and logistical framework that includes:\n\nEVENT ORGANIZER: Responsible for the overall event and its permit conditions. Security officers report to the organizer's incident command structure.\n\nLAW ENFORCEMENT LIAISON: Off-duty or on-duty officers assigned to the event have full peace officer authority. When they are present, defer to their tactical decisions on crowd control, arrest, and use of force escalation beyond your authority.\n\nCOMMUNICATIONS PROTOCOL: Establish a unified radio channel shared with event staff and law enforcement before gates open. Know the incident command structure — who calls for evacuation, who calls for law enforcement backup.\n\nYOUR AUTHORITY LIMITS: On private property events, you can deny entry to individuals, enforce the event's code of conduct, and request individuals to leave. You cannot make warrantless arrests except for felonies committed in your presence (OCGA 17-4-60). You cannot direct traffic on public roadways — that is law enforcement's function.",
    "keyPoints": [
      "Permitted assemblies include law enforcement liaison — defer to their tactical authority",
      "Establish unified radio channel with event staff and law enforcement before gates open",
      "Your authority: deny entry, enforce code of conduct, request departure from private property",
      "You cannot direct public roadway traffic — request law enforcement for road control"
    ],
    "legalRef": "OCGA § 36-60-6 (public assembly permits); OCGA § 17-4-60 (citizen arrest); Georgia local ordinances on special event permits",
    "callout": "In a multi-agency event response, your role is within your legal authority and the incident command structure. Do not freelance — coordinate.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Concert Crowd Surge",
    "body": "You are working the floor at a 3,000-person music venue. Twenty minutes into the headliner's set, you notice a visible pressure surge toward the front of the stage. Crowd members in the front section are raising their arms and appear unable to move freely. Two patrons near the stage barrier are shouting to security that they cannot breathe. The band has not stopped playing. The event organizer's supervisor is 200 feet away at the production desk and not yet aware.",
    "keyPoints": [
      "IMMEDIATE: Alert your supervisor via radio — this is a crowd crush emergency in progress",
      "SIGNAL: Get word to the stage manager to stop the music — music silence immediately reduces crowd urgency",
      "OPEN: Open side exits adjacent to the front section to create lateral relief — crowd compression increases when only one exit path is visible",
      "DO NOT: Use physical force to push back the crowd — this adds lateral pressure and worsens crush",
      "COMMUNICATE: Use a calm, loud, authoritative voice over PA if available: 'For your safety, please step back from the stage. All exits are open.'",
      "EMS: Call for medical personnel immediately — anyone who reports they cannot breathe needs assessment",
      "DOCUMENT: Time, actions taken, personnel notified, medical calls made"
    ],
    "legalRef": "NFPA 101 Life Safety Code; ASIS International Crowd Management Guideline; OCGA § 51-3-1 (premises liability)",
    "callout": "Do not wait for the event organizer to act. When people cannot breathe, you act and notify simultaneously.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Crowd Management Event Checklist",
    "body": "Complete this checklist before every large event assignment.",
    "keyPoints": [
      "PRE-EVENT: Walk all ingress and egress routes — confirm all exits are clear and unlocked",
      "PRE-EVENT: Confirm radio channel shared with event staff and law enforcement liaison",
      "PRE-EVENT: Know the venue capacity and your density monitoring responsibility area",
      "PRE-EVENT: Identify the medical station location and EMS contact in the incident command",
      "DURING EVENT: Monitor crowd density visually — identify compression before it becomes crush",
      "DURING EVENT: Watch for crowd phase escalation — Casual → Aware → Expressive → Active",
      "DURING EVENT: Report any exit obstruction or medical emergency immediately via radio",
      "EMERGENCY: Stop music/PA → open all exits → PA announcement → EMS call → law enforcement if needed",
      "POST-EVENT: Document any incidents, crowd density concerns, or near-misses in written report"
    ],
    "legalRef": "NFPA 101; ASIS International Crowd Management Guideline; OSHA 29 C.F.R. 1910.37",
    "callout": "A post-event debrief with your supervisor — even when nothing went wrong — identifies near-misses that prevent future incidents.",
    "narrationUrl": null
  }
]
$slides_uas16$
);

-- ============================================================
-- UAS-17: Workplace Violence Prevention
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-17',
'Workplace Violence Prevention',
$slides_uas17$
[
  {
    "type": "slide",
    "heading": "The Four Types of Workplace Violence",
    "body": "OSHA and the National Institute for Occupational Safety and Health (NIOSH) classify workplace violence into four types based on the relationship between the perpetrator and the workplace. Security officers encounter all four in their careers.\n\nTYPE I — CRIMINAL INTENT: The perpetrator has no relationship to the workplace. Examples: armed robbery, theft with violence. Most common in retail and late-night service settings.\n\nTYPE II — CUSTOMER/CLIENT: Violence by a person the business serves — a patient, client, customer, or member of the public. Examples: patient attacking hospital staff, passenger assaulting transportation worker. Highest fatality rate in healthcare settings.\n\nTYPE III — WORKER-ON-WORKER: Violence by a current or former employee against another employee or supervisor. Often preceded by escalating grievances, threats, or behavioral warning signs. Active shooter scenarios frequently fall here.\n\nTYPE IV — PERSONAL RELATIONSHIP: Violence by someone with a personal relationship to an employee — domestic partner, family member. The workplace becomes the venue; other employees may be affected.",
    "keyPoints": [
      "Type I: Criminal — no workplace relationship. Type II: Client — person the business serves",
      "Type III: Worker-on-worker — most often preceded by observable warning signs",
      "Type IV: Personal relationship — domestic violence spilling into the workplace",
      "Each type requires different prevention and response strategies"
    ],
    "legalRef": "OSHA 3148 (Guidelines for Preventing Workplace Violence); NIOSH Workplace Violence Classification; OCGA § 16-5-90 et seq. (stalking, which frequently precedes Type IV incidents)",
    "callout": "Type III violence is the most preventable. Warning signs appear days, weeks, or months before the incident — if someone reports them.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Threat Red Flags & Behavioral Warning Signs",
    "body": "Most perpetrators of serious workplace violence displayed observable warning signs before the incident. Research from the FBI's Behavioral Analysis Unit and the Secret Service's National Threat Assessment Center consistently shows that targeted violence is NOT impulsive — it follows a pathway from grievance to attack.\n\nBehavioral warning signs (any should be reported to supervisor immediately):\n• Direct or indirect threats: 'I'm going to make them pay,' 'They'll regret this'\n• Expressions of hopelessness or suicidal ideation combined with expressed anger at others\n• Dramatic changes in behavior: social withdrawal, hygiene deterioration, erratic performance\n• Increased interest in weapons or workplace violence incidents\n• Grievance fixation: repeatedly returning to perceived unfair treatment after the matter is resolved\n• Testing security: asking about camera locations, officer schedules, entry/exit points\n• Social media posts expressing rage at coworkers, supervisors, or the organization\n• Unexplained presence outside normal work hours\n\nNOTE: No single indicator confirms threat. Patterns matter. Your job is to REPORT — not to assess, diagnose, or confront.",
    "keyPoints": [
      "Targeted workplace violence follows a pathway — it is not random or spontaneous",
      "Direct and indirect threats are the most actionable indicators — always report them",
      "Grievance fixation and weapons interest are high-weight warning signs",
      "Report patterns of behavior to supervisor — multiple low-level indicators outweigh a single major one"
    ],
    "legalRef": "FBI Behavioral Analysis Unit (Workplace Violence); Secret Service NTAC (Targeted School and Workplace Violence); OSHA 3148",
    "callout": "You are not a threat assessor — that is a multidisciplinary team function. You are the observer and reporter. Report everything and let the team assess.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Behavioral Threat Assessment Team (BTAT) & Your Role",
    "body": "Many medium and large organizations maintain a Behavioral Threat Assessment Team (BTAT) — a multidisciplinary group typically including HR, legal, management, mental health, and security. When a threat or concerning behavior is reported, the BTAT evaluates it and determines appropriate intervention.\n\nAs a security officer, your role in the BTAT process:\n1. OBSERVE: Note behavioral warning signs during your patrol and post duties\n2. DOCUMENT: Write factual observations in your patrol log or incident report — behaviors, dates, times, locations, witnesses\n3. REPORT: Escalate to your supervisor immediately — do not filter, minimize, or delay\n4. MAINTAIN CONFIDENTIALITY: BTAT deliberations are confidential. Do not share threat reports with other employees.\n5. IMPLEMENT: If the BTAT determines protective measures (access restriction, escort protocols, increased patrols), you execute those measures\n6. CONTINUE OBSERVATION: The BTAT process is ongoing — continue reporting new observations\n\nIf your organization does not have a formal BTAT, report to your supervisor who will coordinate with HR and management.",
    "keyPoints": [
      "BTAT is multidisciplinary — security is one input, not the sole decision-maker",
      "Your role: observe, document, report — not to assess or confront the subject",
      "BTAT deliberations are confidential — do not share with uninvolved employees",
      "After BTAT action, continue observing and reporting new developments"
    ],
    "legalRef": "OSHA 3148; SHRM Workplace Violence Prevention Guidelines; GBPDSA Code of Conduct (confidentiality obligation)",
    "callout": "The time between a report and a violent incident is the window for prevention. Every hour of delay narrows that window.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Active Shooter Response — Run, Hide, Fight",
    "body": "When an active shooter situation is underway, DHS and FEMA recommend the Run-Hide-Fight protocol for civilians and security officers not in a position to neutralize the threat.\n\nRUN (Evacuate if possible):\n• Know your evacuation routes before an incident occurs\n• Leave belongings behind — do not slow down for property\n• Prevent others from entering the area if you can do so safely\n• Call 911 when safe — describe shooter location, description, weapons, number of victims\n\nHIDE (Shelter in place if run is not possible):\n• Lock and barricade the door — move heavy furniture against it\n• Silence phones and electronic devices\n• Turn off lights; stay low and out of sight from windows and doors\n• Communicate with 911 via text if voice would expose your location\n\nFIGHT (As a last resort when your life is in immediate danger):\n• Commit fully — hesitation is more dangerous than action\n• Use any available improvised weapon\n• Aim to incapacitate, not subdue\n\nLAW ENFORCEMENT ARRIVAL:\n• Keep hands visible — drop any weapon you may be holding\n• Follow officer instructions exactly and immediately\n• Do not grab officers or block their path",
    "keyPoints": [
      "Run: evacuate with nothing, prevent entry, call 911 when safe",
      "Hide: lock and barricade, silence devices, communicate via text to 911",
      "Fight: last resort only — commit fully with improvised weapons",
      "Law enforcement arrival: hands visible, comply immediately, do not impede officers"
    ],
    "legalRef": "DHS Active Shooter Preparedness (IS-907); FEMA IS-907; OCGA § 16-3-21 (use of force in defense of self and others)",
    "callout": "Your training changes the calculus — but Run-Hide-Fight remains the correct protocol when you are not in a position to safely engage the threat.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Terminated Employee",
    "body": "On Monday morning, a warehouse supervisor reports to you that an employee, Marcus, was terminated last Friday after a heated confrontation with his manager. During the confrontation, Marcus said: 'You'll wish you hadn't done this.' On Monday at 7:45 AM, you observe Marcus in the parking lot sitting in his car. He has not entered the building. His employee access badge was deactivated Friday. You make eye contact with Marcus and he looks away. At 8:15 AM, he is still in the parking lot.",
    "keyPoints": [
      "IMMEDIATE: Contact supervisor and HR — terminated employee with threatening statement is on premises",
      "DO NOT: Confront Marcus alone — approach could escalate; this requires a law enforcement consultation",
      "DOCUMENT: Time observed, vehicle description, plate number, Marcus's physical appearance and demeanor",
      "ACCESS: Confirm his badge is deactivated and building access is fully revoked",
      "LAW ENFORCEMENT: Supervisor should determine whether to call law enforcement for a welfare check or trespass enforcement",
      "HEIGHTENED PATROL: Increase interior and perimeter patrol frequency until situation resolved",
      "BTAT: Report to BTAT or HR for threat assessment — this pattern (threat + lingering presence) is a high-priority indicator"
    ],
    "legalRef": "OCGA § 16-7-21 (criminal trespass — on premises without authority after termination); OCGA § 16-5-90 (stalking elements may apply)",
    "callout": "A terminated employee with a verbal threat who returns to the premises the following business day is a serious behavioral threat indicator. Do not minimize or wait for more information.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Workplace Violence Prevention Checklist",
    "body": "Apply these practices daily to contribute to a workplace violence prevention culture.",
    "keyPoints": [
      "KNOW the four types of workplace violence and which your assignment is most exposed to",
      "REPORT any direct or indirect threats to supervisor immediately — do not wait to 'see how it develops'",
      "DOCUMENT behavioral warning signs in patrol log: who, what behavior, date, time, location",
      "MAINTAIN CONFIDENTIALITY on all threat reports and BTAT matters",
      "VERIFY access control: terminated employees' badges deactivated; visitor badges returned",
      "KNOW your evacuation routes and practice them — do not wait for an incident to learn the layout",
      "BRIEF law enforcement on your layout when they arrive — guide them, then clear their path",
      "POST-INCIDENT: Complete written report within 2 hours; participate in after-action review"
    ],
    "legalRef": "OSHA 3148; GBPDSA Code of Conduct; DHS IS-907 Active Shooter Preparedness",
    "callout": "Workplace violence prevention is a shared responsibility. Your observations and reports are the early warning system. Use them.",
    "narrationUrl": null
  }
]
$slides_uas17$
);

-- ============================================================
-- UAS-18: Incident Response & Scene Management
-- ============================================================
INSERT INTO public.module_lessons (module_id, title, slides) VALUES (
'UAS-18',
'Incident Response & Scene Management',
$slides_uas18$
[
  {
    "type": "slide",
    "heading": "First-on-Scene: Your Core Responsibilities",
    "body": "When you are the first security officer on scene at an incident — assault, theft, medical emergency, fire, or any other serious event — your actions in the first 60 seconds shape everything that follows: the victim's outcome, the investigation, and the legal defensibility of your employer's response.\n\nThe first-on-scene security officer has five core responsibilities, in priority order:\n\n1. LIFE SAFETY: Is anyone injured? Can the hazard injure more people? Life safety is always priority one — above scene preservation, above evidence, above reporting.\n\n2. SCENE STABILIZATION: Stop the incident from getting worse. Separate combatants. Remove bystanders from a hazard area. Prevent additional persons from entering a compromised space.\n\n3. NOTIFY: Call your supervisor and 911 simultaneously if the incident warrants law enforcement or EMS. Do not delay notification while you manage the scene.\n\n4. PRESERVE: Once life safety is addressed and help is notified, preserve the scene exactly as found. Do not move, touch, or allow others to disturb evidence.\n\n5. DOCUMENT: Begin contemporaneous notes immediately. Time-stamp every action. You will not remember details accurately an hour later.",
    "keyPoints": [
      "Life safety first — always, without exception",
      "Stabilize: stop the incident from expanding or injuring additional persons",
      "Notify: supervisor and 911 — do not choose between them, do both",
      "Preserve: once life safety addressed, nothing moves until law enforcement arrives",
      "Document: contemporaneous notes, time-stamped, starting immediately"
    ],
    "legalRef": "OCGA § 51-3-1 (premises liability — duty of care); GBPDSA Code of Conduct (professional responsibilities); OCGA § 17-4-60 (scene management authority)",
    "callout": "The order matters. A security officer who preserves a scene perfectly while an injured person goes unattended has failed their primary duty.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Scene Preservation — Evidence Integrity Before Police Arrival",
    "body": "Crime scene preservation is not the exclusive domain of law enforcement. The period between when a security officer arrives and when law enforcement takes control is when the most evidence is lost — through well-intentioned interference, bystander contamination, or poor scene management.\n\nSCENE PRESERVATION RULES:\n• Do not touch, move, or allow anyone else to touch or move items that may be evidence\n• Secure the perimeter — establish a clear boundary beyond which no unauthorized person enters\n• Document who was in the scene before you established control — they may have disturbed evidence\n• If you must touch something for life safety (move an injured person, activate a fire suppression system), document exactly what you did and why\n• Photograph the scene if you have a camera available and it is safe to do so — before any disturbance occurs\n• Do not clean up blood, broken glass, or damaged property before law enforcement documents the scene\n\nEVIDENCE INTEGRITY:\n• Do not touch physical evidence without gloves, and only if law enforcement explicitly directs you to\n• Do not allow evidence to be moved to a different location 'for safekeeping'\n• Do not allow bystanders to photograph evidence with personal phones — direct them to the perimeter",
    "keyPoints": [
      "Establish a perimeter immediately — no unauthorized entry after you take control",
      "Document who was present when you arrived — they may have disturbed evidence",
      "Any life-safety contact with the scene must be documented: what you touched, when, and why",
      "No cleaning, no moving, no photographing by bystanders — until law enforcement takes control"
    ],
    "legalRef": "OCGA § 16-10-94 (tampering with evidence — applies to persons who move or destroy evidence); ASIS International Crime Prevention Guideline",
    "callout": "Evidence moved 'for safekeeping' is evidence that may be inadmissible. Leave it. Document it. Let law enforcement decide.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Witness Identification & Witness Hold Protocol",
    "body": "Witnesses are evidence. Human memory begins degrading within minutes of a stressful event — contaminated by conversation with other witnesses, by media coverage, by the passage of time. Identifying and securing witness statements as quickly as possible is among the most important post-incident functions a security officer performs.\n\nWITNESS IDENTIFICATION:\n• Ask everyone in the immediate area: 'Did you see what happened? Where were you when it occurred?'\n• Identify both eyewitnesses (saw the event) and proximate witnesses (were present, may have heard or observed peripheral details)\n• Get name, employer (if on-premises), phone number, and email for every witness\n• Note who leaves the scene before providing their information\n\nWITNESS HOLD:\n• Request (do not order) that witnesses remain available to speak with law enforcement\n• You cannot legally compel a witness to remain (only law enforcement can detain)\n• If a witness refuses to remain: document their name if obtained, physical description, and direction of departure\n• Keep witnesses separated — cross-contamination of witness accounts destroys evidentiary value\n\nSTATEMENTS:\n• Ask each witness to write their account in their own words\n• Do not interview witnesses yourself in a way that introduces leading questions\n• Your job is identification and preservation — the interview is law enforcement's function",
    "keyPoints": [
      "Identify all witnesses immediately — memory degrades rapidly under stress",
      "Separate witnesses — contact between witnesses contaminates accounts",
      "You cannot compel witnesses to remain — request, document refusals",
      "Get name, phone, and email for every witness before law enforcement arrives"
    ],
    "legalRef": "OCGA § 24-6-601 et seq. (witness competency); Daubert standard (eyewitness contamination in Georgia courts); GBPDSA Code of Conduct",
    "callout": "Separated witnesses with written accounts are gold. Witnesses who've talked to each other for 20 minutes are nearly useless in court.",
    "narrationUrl": null
  },
  {
    "type": "slide",
    "heading": "Law Enforcement Handoff — Transferring Scene Control",
    "body": "When law enforcement arrives, scene control transfers to them. This is not a failure — it is the design of the system. Your role shifts from scene manager to witness and subject matter expert.\n\nLAW ENFORCEMENT ARRIVAL PROTOCOL:\n1. MEET AND GUIDE: Meet responding officers at the perimeter. Provide a brief verbal orientation: 'I'm [name] with [company]. The scene is [location]. [Summary of incident]. [Number] witnesses held here. One person transported by EMS.'\n2. TRANSFER YOUR NOTES: Provide your contemporaneous notes — this is exactly what you documented them for\n3. PRESERVE THE CHAIN: Tell officers everything that was touched, moved, or disturbed and by whom — including your own actions for life safety\n4. DO NOT RE-ENTER: Once law enforcement takes control, do not re-enter the scene without explicit permission\n5. REMAIN AVAILABLE: Stay on-scene until the lead officer releases you — you may be needed for additional information\n6. INCIDENT REPORT: Complete your full written incident report before end of shift — while memory is fresh\n\nFOLLOW-THROUGH:\n• Preserve all CCTV footage from the incident time window — notify IT or the recording system administrator immediately\n• Do not delete or overwrite security footage under any circumstances",
    "keyPoints": [
      "Meet officers at the perimeter with a verbal summary and your notes",
      "Disclose everything touched or moved — officers need a complete contamination log",
      "Do not re-enter the scene after handoff without explicit law enforcement permission",
      "Preserve CCTV footage immediately — notify IT before footage overwrites"
    ],
    "legalRef": "OCGA § 16-10-94 (evidence tampering — CCTV deletion can constitute this offense); OCGA § 51-3-1 (premises liability — documentation protects employer)",
    "callout": "CCTV footage that overwrites before law enforcement can copy it may be the most damaging evidence loss in any incident. Notify IT the moment you have scene control.",
    "narrationUrl": null
  },
  {
    "type": "scenario",
    "heading": "Scenario: The Assault at the Parking Deck",
    "body": "At 9:45 PM, you receive a radio call from a witness reporting a man down on level 3 of the parking deck. You arrive at 9:47 PM. You find a male subject approximately 40 years old, unconscious on the ground near a vehicle. There is blood on the pavement beneath his head. A woman in scrubs is kneeling beside him. Four other bystanders are standing in a group approximately 10 feet away discussing what they saw. A cell phone and a briefcase are on the ground 6 feet from the subject.",
    "keyPoints": [
      "LIFE SAFETY: Assess victim — is he breathing? Instruct the woman in scrubs to maintain care; call 911 immediately for EMS",
      "STABILIZE: Clear the area — bystanders to a safe distance; no additional vehicles enter level 3",
      "SEPARATE WITNESSES: Move the four bystanders apart before they discuss further — get names and phones",
      "PRESERVE: The cell phone and briefcase are potential evidence — do not touch; mark their location verbally and in notes",
      "CCTV: Radio your supervisor to initiate footage preservation for parking deck cameras from 9:00 PM forward",
      "DOCUMENT: 9:47 PM arrival, scene conditions, who was present, what was touched and by whom",
      "HANDOFF: Meet responding officers at level 3 entrance with your summary, notes, and witness list"
    ],
    "legalRef": "OCGA § 51-3-1 (premises liability); OCGA § 16-10-94 (evidence preservation obligation); GBPDSA Code of Conduct",
    "callout": "The four bystanders who are already talking to each other are your most urgent scene management problem after EMS. Separate them before they contaminate each other's accounts.",
    "narrationUrl": null
  },
  {
    "type": "checklist",
    "heading": "Incident Response & Scene Management Checklist",
    "body": "Execute in order at every significant incident.",
    "keyPoints": [
      "LIFE SAFETY: Injured persons? Ongoing hazard? Address before anything else",
      "STABILIZE: Stop the incident from expanding — separate combatants, clear bystanders from hazard area",
      "NOTIFY: Supervisor and 911 — simultaneous, not sequential",
      "PERIMETER: Establish a clear boundary, no unauthorized entry",
      "WITNESSES: Identify, separate, get contact info, request they remain for law enforcement",
      "PRESERVE: Nothing touched, moved, or cleaned until law enforcement takes control",
      "DOCUMENT: Time-stamped notes starting immediately — who, what, where, when, what was disturbed",
      "CCTV: Notify IT to preserve footage before shift ends — specify time window",
      "HANDOFF: Meet law enforcement at perimeter with verbal summary, notes, witness list",
      "INCIDENT REPORT: Written report completed before end of shift"
    ],
    "legalRef": "GBPDSA Code of Conduct; OCGA § 16-10-94; OCGA § 51-3-1; ASIS International Incident Response Guideline",
    "callout": "A well-managed scene protects victims, preserves evidence, and protects your employer from liability. Every step on this checklist is a layer of that protection.",
    "narrationUrl": null
  }
]
$slides_uas18$
);
