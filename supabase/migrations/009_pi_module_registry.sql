-- ============================================================
-- 009_pi_module_registry.sql
-- Module registry for MJM 2026 Private Detective (PI) curriculum
-- Grounded in: GA Admin Code 509-3-.06 (72-hour PI standard)
-- 24 modules: PI-01 through PI-24
-- ============================================================

DELETE FROM public.mjm_modules WHERE track = 'private-detective';

INSERT INTO public.mjm_modules
  (id, track, title, description, sequence_order, passing_score, duration_hours, critical_question_ids, scorm_course_id, is_active)
VALUES
  ('PI-01', 'private-detective', 'History of Law Enforcement & the PI Industry',
   'Origins of the private investigation profession, the evolution of Georgia law, GBPDSA regulatory framework, and the scope of PI authority versus sworn law enforcement.',
   1, 80, 2.0, ARRAY['pi01-q1'], 'TBD', true),

  ('PI-02', 'private-detective', 'Ethics for Private Investigators',
   'Honesty, responsibility, respect, fairness, and compassion as professional mandates. GBPDSA Code of Conduct, prohibited conduct, and the ethical duty that supersedes client loyalty.',
   2, 85, 2.0, ARRAY['pi02-q1','pi02-q3'], 'TBD', true),

  ('PI-03', 'private-detective', 'Types of Investigations',
   'Civil versus criminal investigations, insurance, domestic, corporate, and defense matters. Client intake procedures, scope definition, and conflict-of-interest checks.',
   3, 75, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-04', 'private-detective', 'Principal GA Misdemeanors & Felonies',
   'OCGA structure, misdemeanor and felony classifications, jurisdiction and venue, and the specific criminal exposures unique to private investigator work including trespass, stalking, and eavesdropping.',
   4, 85, 4.0, ARRAY['pi04-q4','pi04-q5'], 'TBD', true),

  ('PI-05', 'private-detective', 'Laws of Arrest',
   'Citizen arrest authority under OCGA 17-4-60, constitutional guarantees, due process obligations, use-of-force limits for private actors, and false imprisonment exposure.',
   5, 85, 4.0, ARRAY['pi05-q1','pi05-q5'], 'TBD', true),

  ('PI-06', 'private-detective', 'Search & Seizure',
   'Fourth Amendment application to private actors, plain view doctrine, hot pursuit, stop-and-frisk precedent under Terry v. Ohio, and Georgia recording consent laws under OCGA 16-11-62.',
   6, 85, 2.0, ARRAY['pi06-q2'], 'TBD', true),

  ('PI-07', 'private-detective', 'Crime Scene Investigation',
   'Scene preservation, forensic fundamentals including fingerprinting and trace evidence, polygraph use and limitations, and photographic documentation standards for legal proceedings.',
   7, 80, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-08', 'private-detective', 'Interviewing Suspects & Witnesses',
   'Kinesics and body language, cognitive interview methodology, rapport-building techniques, and the absolute prohibition on coercion that voids testimonial evidence.',
   8, 80, 2.0, ARRAY['pi08-q4'], 'TBD', true),

  ('PI-09', 'private-detective', 'Process Serving',
   'Service of process under OCGA 9-11-4, personal versus substituted service requirements, civil suits and subpoenas, skip-tracing for location, and proper proof-of-service documentation.',
   9, 80, 2.0, ARRAY['pi09-q2'], 'TBD', true),

  ('PI-10', 'private-detective', 'Sources of Information',
   'Public records access, commercial database compliance, Driver''s Privacy Protection Act (DPPA) federal restrictions, FCRA background screening rules, and information broker vetting.',
   10, 80, 4.0, ARRAY['pi10-q3'], 'TBD', true),

  ('PI-11', 'private-detective', 'Surveillance',
   'OCGA 16-11-62 eavesdropping law, one-party consent recording, stationary and mobile surveillance techniques, GPS placement legality under OCGA 16-11-60.1, counter-surveillance, electronic surveillance, and night operations.',
   11, 85, 8.0, ARRAY['pi11-q2','pi11-q5'], 'TBD', true),

  ('PI-12', 'private-detective', 'Basic Videography & Photography',
   'Equipment selection for legal admissibility, shot composition standards, metadata integrity and chain of custody for digital media, and archiving and delivery formats for court proceedings.',
   12, 75, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-13', 'private-detective', 'Proper Note Taking',
   'Legal weight of contemporaneous notes, log format standards, digital versus handwritten documentation, and work product doctrine protection from discovery.',
   13, 75, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-14', 'private-detective', 'Case Management & Report Writing',
   'Case file architecture, investigative report standards, chain-of-custody documentation for every evidence handoff, billing and retainer records, and client communication documentation.',
   14, 80, 4.0, ARRAY['pi14-q3'], 'TBD', true),

  ('PI-15', 'private-detective', 'Courtroom Testimony',
   'Expert versus fact witness roles, direct and cross-examination techniques, the absolute perjury prohibition, Daubert/Frye standards for PI methodology, and pre-testimony preparation.',
   15, 85, 4.0, ARRAY['pi15-q4'], 'TBD', true),

  ('PI-16', 'private-detective', 'Court Records Research',
   'Georgia court structure, PACER federal records access, clerk of courts in-person procedures, vital and probate records, FOIA and Georgia Open Records Act requests, and interpreting court documents.',
   16, 80, 4.0, ARRAY[]::text[], 'TBD', true),

  ('PI-17', 'private-detective', 'Criminal Defense Investigation',
   'PI role working under defense attorneys, locating exculpatory evidence under Brady and Giglio, witness re-interview legal constraints, and working with incarcerated clients within facility rules.',
   17, 80, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-18', 'private-detective', 'Undercover Investigation',
   'Legal framework for deception in PI work, the absolute entrapment prohibition, cover story construction and exit protocols, and documentation techniques during undercover operations.',
   18, 85, 2.0, ARRAY['pi18-q2'], 'TBD', true),

  ('PI-19', 'private-detective', 'Domestic Investigation',
   'Scope of domestic PI work including infidelity, custody, and asset searches. Georgia stalking law OCGA 16-5-90, working with family law attorneys, and managing high-conflict client relationships.',
   19, 85, 2.0, ARRAY['pi19-q2'], 'TBD', true),

  ('PI-20', 'private-detective', 'Insurance Fraud Investigations',
   'Types of insurance fraud, SIU protocols, documentation standards for carriers, and providing effective testimony in civil fraud proceedings.',
   20, 80, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-21', 'private-detective', 'White Collar Crime & Cyber Forensics',
   'White collar crime overview, digital evidence preservation and hash verification, OSINT tools and legal use limits, and when to hand off to a licensed digital forensics expert.',
   21, 80, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-22', 'private-detective', 'Executive Protection Services',
   'Intersection of EP and PI work, threat assessment and protective intelligence, advance work and route surveys, and Georgia GBPDSA requirements for armed executive protection.',
   22, 80, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-23', 'private-detective', 'Proper Business Practices',
   'Georgia PI agency licensing requirements, engagement agreement essentials, billing and retainer standards, and insurance requirements including E&O and general liability.',
   23, 80, 2.0, ARRAY[]::text[], 'TBD', true),

  ('PI-24', 'private-detective', 'Final Accreditation Examination',
   'Comprehensive capstone assessment covering all 23 content modules. Tests mastery of Georgia law, ethical obligations, surveillance limitations, evidence standards, and business compliance. Minimum 85% required. Three critical questions — any wrong answer triggers 24-hour cooldown.',
   24, 85, 2.0, ARRAY['pi24-q3','pi24-q7','pi24-q9'], 'TBD', true);
