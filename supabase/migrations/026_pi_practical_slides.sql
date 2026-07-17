-- Migration: 026_pi_practical_slides
-- Appends the three practical report assignment slides (PR-1/PR-2/PR-3) to
-- PI-13, PI-14 and PI-19. Companion to 025_practical_reports (durations + table).
-- Appended at the END of each slide deck: existing narrationUrls are stored
-- inline per slide, so indices are unaffected, and the assignment lands
-- directly before the "Begin Knowledge Assessment" CTA.
-- slide_count is a GENERATED column — it updates automatically.
-- Idempotent: the @> guard prevents double-append if run twice.

-- ── PR-1 · PI-13 Proper Note Taking · 1.3h ──────────────────────────────────
UPDATE module_lessons
SET slides = slides || $pr1$[
  {
    "type": "practical",
    "practicalId": "PR-1",
    "title": "Practical Report 1 — Field Incident Report to Your Supervising Investigator",
    "hourCredit": 1.3,
    "brief": [
      "SITUATION: You are a field operative for Meridian Investigative Group, a licensed Georgia agency, on hour six of a stationary surveillance in Marietta, Cobb County (Case 26-0417). The subject has an active disability claim for a right-shoulder injury, and your authorized objective is documentation of the subject's physical activity.",
      "YOUR CONTEMPORANEOUS FIELD NOTES READ: 0642 — arrived, positioned NE corner of Laurel Ridge Ct with clear view of subject residence, overcast, light traffic. 1108 — subject exited residence via garage. 1112–1131 — subject loaded furniture into a rented box truck, including repeated overhead lifts using the right arm; 14 photographs and 6 minutes of video captured. 1119 — unknown male exited the neighboring property, looked directly at my vehicle, and photographed it and the plate with his phone. 1127 — subject's child, approx. 4 years old, wandered unattended to within a few feet of the roadway for approx. 3 minutes before the subject retrieved him. 1134 — subject re-entered residence. 1140 — rotated vehicle position two streets north as a precaution against compromise.",
      "TASKING: Convert these field notes into a formal internal incident report addressed to your supervising licensed private investigator. Your report must escalate three matters: (1) observed physical activity inconsistent with the subject's claimed injury, (2) the possible compromise (burn) of your surveillance position, and (3) the child-welfare observation and how you handled it. Close with your recommendation: should surveillance continue as crewed, be rotated to a different operative or vehicle, or be suspended?",
      "This is exactly the report a working investigator writes at the end of an eventful shift. Separate observed fact from operative opinion, quote verbatim where your notes are verbatim, and write it knowing it will live in the case file and may be produced in litigation."
    ],
    "requiredSections": [
      "Report header block — agency name, case number, report date and time, operative name and ID, confidentiality classification",
      "Subject and assignment summary — who is under surveillance, where, and the authorized objective",
      "Summary of incidents — each of the three escalated matters in one concise paragraph",
      "Chronological narrative — time-stamped entries drawn directly from the field notes, 24-hour clock",
      "Observed facts versus operative assessment — clearly separated and labeled",
      "Equipment and media log — devices used, photographs/video created, timestamps, storage location",
      "Compromise assessment — the possible burn, indicators observed, and precautions taken",
      "Recommendations to supervisor — continue, rotate, or suspend, with justification",
      "Certification and signature block — attestation of truth and accuracy, date, signature"
    ],
    "formattingStandards": [
      "First person, past tense, 24-hour clock, full dates (e.g., 14 March 2026)",
      "Every factual assertion traceable to a contemporaneous field-note entry",
      "Verbatim material in quotation marks; paraphrase clearly identified as such",
      "No speculation stated as fact — assessments labeled (\"Operative assessment: …\")",
      "Professional layout: titled sections, numbered pages, consistent typeface",
      "Proofread before submission — spelling, grammar, and name/time consistency"
    ],
    "submissionInstructions": "Submit your completed report below as a PDF, Word document, or a clear photo of a printed report. All three practical reports (PR-1, PR-2, PR-3) are mandatory for course completion and together account for 4.0 of your 70 certification hours — this assignment carries 1.3 hours. At least one of your three submitted reports will be formally graded by the lead instructor. You will not be told which one, so every report must be to professional standard."
  }
]$pr1$::jsonb,
    updated_at = now()
WHERE module_id = 'PI-13'
  AND NOT slides @> '[{"practicalId":"PR-1"}]'::jsonb;

-- ── PR-2 · PI-14 Case Management & Report Writing · 1.4h ────────────────────
UPDATE module_lessons
SET slides = slides || $pr2$[
  {
    "type": "practical",
    "practicalId": "PR-2",
    "title": "Practical Report 2 — Comprehensive Investigative Report for Law-Enforcement Hand-Off",
    "hourCredit": 1.4,
    "brief": [
      "ENGAGEMENT: Meridian Investigative Group was retained by Aegis Distribution LLC to investigate inventory shrinkage exceeding $84,000 over five months at its Fulton Industrial Boulevard warehouse (Case 26-0533). You are the assigned investigator.",
      "WHAT YOUR INVESTIGATION ESTABLISHED: Badge-access logs show seven after-hours entries in the loss period, six by the same swing-shift lead. Time-lapse footage you installed with client authorization captured two individuals loading cartons into a private box truck at 0215 on 3 April 2026. A cooperating warehouse employee provided a recorded, signed statement identifying the swing-shift lead and describing cash sales of merchandise at a weekend flea-market stall. Serial numbers on fourteen power tools recovered from purchases at that stall match the client's stolen-inventory manifest. A controlled purchase you conducted on 12 April 2026 recovered one further serialized unit, documented on receipt.",
      "TASKING: The client has directed that the file be referred to the Fulton County Sheriff's Office. Prepare the comprehensive investigative report that will be handed to law enforcement — the document a detective could use to open a criminal case without calling you first. It must be complete, chronological, source-attributed, and carry a full evidence index with an unbroken chain of custody for every item.",
      "DISCIPLINE: Report facts. Do not state legal conclusions — you do not declare any person guilty of theft by taking; you report what was observed, recorded, recovered, and stated. The detective and the prosecutor draw the legal conclusions. This is the flagship deliverable of this course: write it so it could go straight across a detective's desk."
    ],
    "requiredSections": [
      "Cover page and report header — agency, Georgia agency license number, case number, client, reporting investigator, date",
      "Executive summary — one page: the engagement and the material findings",
      "Scope and engagement — who retained the agency, when, the authorized purpose, and its limits",
      "Methodology — records review, surveillance, interview, controlled purchase, and the lawful basis for each",
      "Chronological findings — dated, time-stamped, each finding attributed to its source",
      "Witness index — name, role, and contact for every witness; date and format of each statement",
      "Evidence index with chain of custody — item number, description, serial number, collected by/when/where, and every custody transfer logged",
      "Conclusions — a factual summary only; no legal determinations",
      "Attachments list — photographs, footage log, badge records, signed statement, controlled-purchase receipt",
      "Certification and signature block"
    ],
    "formattingStandards": [
      "Third person, past tense, objective register throughout (\"The investigator observed …\")",
      "Every finding cites its source — footage timestamp, badge-log line, statement page",
      "Individuals identified by full name and role at first mention, consistently thereafter",
      "No opinion on guilt, criminal liability, or chargeable offenses — facts only",
      "Evidence items numbered (E-01, E-02 …) and referenced by number in the narrative",
      "Paginated and sectioned, fit for photocopying directly into a criminal case file"
    ],
    "submissionInstructions": "Submit your completed report below as a PDF, Word document, or a clear photo of a printed report. All three practical reports (PR-1, PR-2, PR-3) are mandatory for course completion and together account for 4.0 of your 70 certification hours — this assignment carries 1.4 hours. At least one of your three submitted reports will be formally graded by the lead instructor. You will not be told which one, so every report must be to professional standard."
  }
]$pr2$::jsonb,
    updated_at = now()
WHERE module_id = 'PI-14'
  AND NOT slides @> '[{"practicalId":"PR-2"}]'::jsonb;

-- ── PR-3 · PI-19 Domestic Investigation · 1.3h ──────────────────────────────
UPDATE module_lessons
SET slides = slides || $pr3$[
  {
    "type": "practical",
    "practicalId": "PR-3",
    "title": "Practical Report 3 — Domestic Disturbance Surveillance Report",
    "hourCredit": 1.3,
    "brief": [
      "ENGAGEMENT: Your agency is retained through family-law counsel, Whitfield Family Law LLC, in a contested custody matter (Case 26-0611). Your authorized assignment is lawful, public-vantage documentation of scheduled custody exchanges. Your pre-surveillance legal clearance is complete and you are operating inside the limits of OCGA 16-5-90.",
      "THE INCIDENT: At the 18 April 2026 exchange in a supermarket parking lot in Cherokee County, you observed from a lawful public vantage: a verbal altercation between the parents escalating to shouting; the subject repositioning a vehicle to block the other parent's car for approximately four minutes; the minor child, age 7, present and visibly distressed throughout; a bystander telephoning 911; two Cherokee County Sheriff's deputies responding (you noted both car numbers), separating the parties, and taking statements; no arrest made. You obtained the CAD incident number from a responding deputy. You captured photographs and video with timestamps.",
      "TASKING: Prepare the surveillance report for the retaining attorney documenting the disturbance. Write it in the certain knowledge that it may be produced in discovery, subpoenaed, and read aloud in a custody hearing — factual, neutral, and admissibility-aware. Include a law-enforcement referral note (responding agency, deputy names and car numbers, CAD incident number) so counsel can obtain the official incident report.",
      "NEUTRALITY: You document what occurred. You do not characterize either parent's fitness, and you keep what you personally observed strictly separated from what any party or bystander told you."
    ],
    "requiredSections": [
      "Report header — agency, case number, retaining attorney and firm, report date, operative name and ID",
      "Assignment and legal authority — scope authorized by counsel; public-vantage basis; OCGA 16-5-90 compliance note",
      "Pre-incident observations — arrival time, position, conditions, persons and vehicles present",
      "Incident narrative — time-stamped, chronological, direct observations only",
      "Verbatim statements log — exact words heard, with time and speaker",
      "Child welfare observations — the minor's location, demeanor, and duration of exposure, as facts only",
      "Law-enforcement response — agency, deputy names and car numbers, actions taken, CAD incident number",
      "Media log — photographs and video captured, device, timestamps, storage location",
      "Hearsay distinction — what parties or bystanders told you, clearly separated from direct observation",
      "Certification and signature block"
    ],
    "formattingStandards": [
      "Neutral, factual tone — no advocacy for either parent and no fitness conclusions",
      "First person for direct observations; attributed reporting for anything second-hand",
      "All times on the 24-hour clock; distances estimated with the method of estimate noted",
      "Verbatim quotes only where actually heard — never reconstructed dialogue",
      "Drafted as a discoverable litigation document — contains nothing you could not defend under cross-examination",
      "Titled sections, numbered pages, consistent professional layout"
    ],
    "submissionInstructions": "Submit your completed report below as a PDF, Word document, or a clear photo of a printed report. All three practical reports (PR-1, PR-2, PR-3) are mandatory for course completion and together account for 4.0 of your 70 certification hours — this assignment carries 1.3 hours. At least one of your three submitted reports will be formally graded by the lead instructor. You will not be told which one, so every report must be to professional standard."
  }
]$pr3$::jsonb,
    updated_at = now()
WHERE module_id = 'PI-19'
  AND NOT slides @> '[{"practicalId":"PR-3"}]'::jsonb;
