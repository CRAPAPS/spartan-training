-- ============================================================
-- 017_uas_module_registry.sql
-- Module registry for MJM 2026 Unarmed Security Officer (UAS) curriculum
-- Grounded in: GA Admin Code 509-3-.01 (24-hour unarmed security standard)
-- 24 modules: UAS-01 through UAS-24
-- ============================================================

DELETE FROM public.mjm_modules WHERE track = 'unarmed-security';

INSERT INTO public.mjm_modules
  (id, track, title, description, sequence_order, passing_score, duration_hours, critical_question_ids, scorm_course_id, is_active)
VALUES
  ('UAS-01', 'unarmed-security', 'Role & Legal Authority of Unarmed Security Officers',
   'The scope of private security officer authority under Georgia law, the distinction between peace officer powers and private security powers, the GBPDSA licensing framework, and the legal consequences of exceeding your authority.',
   1, 80, 1.0, ARRAY['uas01-q1'], 'TBD', true),

  ('UAS-02', 'unarmed-security', 'GBPDSA Framework — OCGA Title 43, Chapter 38',
   'The Georgia Board of Private Detectives and Security Agencies: licensing requirements for individual officers and employing agencies, the 24-hour training mandate under GA Admin Code 509-3-.01, renewal obligations, and Board enforcement authority.',
   2, 80, 1.0, ARRAY['uas02-q1'], 'TBD', true),

  ('UAS-03', 'unarmed-security', 'Ethics & Professional Conduct',
   'The GBPDSA Code of Conduct, the five pillars of professional ethics for security officers, prohibited conduct, conflicts of interest, client confidentiality obligations, and the professional standards that protect both officers and the public.',
   3, 85, 1.0, ARRAY['uas03-q1','uas03-q3'], 'TBD', true),

  ('UAS-04', 'unarmed-security', 'Criminal & Civil Law for Security Officers',
   'OCGA Title 16 structure, misdemeanor and felony classifications relevant to security work, civil liability exposure from negligent or excessive security conduct, and the distinction between criminal and civil responsibility for security officer actions.',
   4, 85, 1.0, ARRAY['uas04-q4','uas04-q5'], 'TBD', true),

  ('UAS-05', 'unarmed-security', 'Laws of Arrest — Citizen Arrest Authority',
   'Citizen arrest authority under OCGA 17-4-60, the felony-in-presence requirement, constitutional due process obligations, false imprisonment and false arrest exposure, and the practical rule: detain only what the law permits, never more.',
   5, 85, 1.0, ARRAY['uas05-q1','uas05-q5'], 'TBD', true),

  ('UAS-06', 'unarmed-security', 'Search & Seizure Fundamentals',
   'Fourth Amendment application to private security officers, the plain view doctrine, when security officers may conduct consensual searches, prohibition on unauthorized searches of persons or property, and evidence handling when law enforcement arrives.',
   6, 85, 1.0, ARRAY['uas06-q2'], 'TBD', true),

  ('UAS-07', 'unarmed-security', 'Use of Force Continuum — Unarmed Officers',
   'The use-of-force continuum for unarmed security personnel, proportional response principles, the imminent threat standard, circumstances permitting physical restraint, documentation requirements after any use of force, and post-incident reporting obligations.',
   7, 85, 1.0, ARRAY['uas07-q1','uas07-q3'], 'TBD', true),

  ('UAS-08', 'unarmed-security', 'De-escalation & Conflict Resolution',
   'Verbal communication techniques that reduce confrontation, proxemics and personal space management, recognizing pre-attack indicators, tactical positioning, the decision framework for escalating to force versus maintaining verbal control.',
   8, 80, 1.0, ARRAY['uas08-q4'], 'TBD', true),

  ('UAS-09', 'unarmed-security', 'Observation, Patrol & Situational Awareness',
   'Patrol methodologies (fixed post, roving, vehicle), observation reporting techniques, the OODA loop applied to security patrol, environmental scanning, anomaly recognition, and contemporaneous log-keeping during patrol operations.',
   9, 80, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-10', 'unarmed-security', 'Access Control & Perimeter Security',
   'Layered perimeter defense principles, credential verification procedures, visitor management systems, tailgating and piggybacking recognition, key and badge accountability, and the legal authority to deny entry to private property.',
   10, 80, 1.0, ARRAY['uas10-q2'], 'TBD', true),

  ('UAS-11', 'unarmed-security', 'Report Writing & Documentation Standards',
   'The legal weight of contemporaneous security reports, incident report structure (who/what/when/where/how), use of objective versus subjective language, chain-of-custody documentation, and digital versus handwritten report standards.',
   11, 75, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-12', 'unarmed-security', 'Emergency Procedures — Fire, Medical & Evacuation',
   'Emergency Action Plan components, fire detection and evacuation coordination, medical emergency first-responder role for security officers, AED/CPR awareness, mass casualty incident protocols, and coordination with EMS and fire services on scene.',
   12, 85, 1.0, ARRAY['uas12-q1','uas12-q5'], 'TBD', true),

  ('UAS-13', 'unarmed-security', 'Terrorism Awareness & Suspicious Activity Reporting',
   'Indicators of terrorist planning and surveillance activity, the See Something Say Something framework, reporting through Georgia Fusion Center channels, the security officer''s role in the national suspicious activity reporting (SAR) initiative, and prohibited profiling.',
   13, 85, 1.0, ARRAY['uas13-q2'], 'TBD', true),

  ('UAS-14', 'unarmed-security', 'Bomb Threats & Suspicious Package Protocols',
   'Bomb threat call procedures (DHS Bomb Threat Checklist), suspicious package recognition criteria, evacuation decision authority, safe standoff distances, prohibition on using radios near suspected IEDs, and post-threat documentation requirements.',
   14, 85, 1.0, ARRAY['uas14-q1'], 'TBD', true),

  ('UAS-15', 'unarmed-security', 'Crime Prevention Through Environmental Design (CPTED)',
   'The four principles of CPTED: natural surveillance, natural access control, territorial reinforcement, and maintenance. Application to security post assessment, lighting evaluation, sight-line obstruction identification, and communicating CPTED findings to management.',
   15, 75, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-16', 'unarmed-security', 'Crowd Management & Public Assembly Security',
   'Crowd psychology, crowd density thresholds, ingress and egress flow management, crowd crush recognition, working with event staff and law enforcement at permitted assemblies, use of barrier systems, and the security officer''s authority limits in public gatherings.',
   16, 80, 1.0, ARRAY['uas16-q3'], 'TBD', true),

  ('UAS-17', 'unarmed-security', 'Workplace Violence Prevention',
   'The four categories of workplace violence (Type I–IV), threat assessment red flags, the security officer''s role in the Behavioral Threat Assessment Team (BTAT) process, active shooter response (Run-Hide-Fight), and post-incident support obligations.',
   17, 80, 1.0, ARRAY['uas17-q2'], 'TBD', true),

  ('UAS-18', 'unarmed-security', 'Incident Response & Scene Management',
   'First-on-scene security officer responsibilities: life safety first, scene preservation, witness identification and hold, law enforcement handoff protocols, evidence integrity obligations before police arrival, and the documentation chain from incident through court preparation.',
   18, 80, 1.0, ARRAY['uas18-q4'], 'TBD', true),

  ('UAS-19', 'unarmed-security', 'Communications — Radios, Dispatch & Logs',
   'Radio protocol (NATO phonetic alphabet, prowords, channel discipline), dispatch log standards, 10-code versus plain-language policy, radio discipline during emergencies, documentation of all communications during incidents, and equipment accountability.',
   19, 75, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-20', 'unarmed-security', 'Trespass & Banning Procedures',
   'Georgia trespass law under OCGA 16-7-21, the property owner''s authority to ban individuals, the security officer''s role in communicating and enforcing a trespass notice, documentation of banning events, and coordination with law enforcement for criminal trespass prosecution.',
   20, 80, 1.0, ARRAY['uas20-q3'], 'TBD', true),

  ('UAS-21', 'unarmed-security', 'Traffic Control & Parking Enforcement',
   'Authority and limitations of security officers directing traffic on private property, hand signal standards, high-visibility vest and equipment requirements, coordination with GDOT or local traffic enforcement when incidents affect public roadways, and parking citation documentation.',
   21, 75, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-22', 'unarmed-security', 'Drug & Alcohol Awareness in the Workplace',
   'Recognizing signs of impairment in subjects encountered during security patrol, security officer obligations when impairment is observed, Georgia drug-free workplace policies, the security officer''s own fitness-for-duty obligations, and documentation requirements for impairment observations.',
   22, 80, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-23', 'unarmed-security', 'Customer Service & Professional Image',
   'The security officer as the client organization''s frontline representative, professional appearance standards, effective public communication, handling complaints and difficult persons without escalation, and the direct relationship between professional conduct and contract retention.',
   23, 75, 1.0, ARRAY[]::text[], 'TBD', true),

  ('UAS-24', 'unarmed-security', 'Final Accreditation Examination',
   'Comprehensive capstone assessment covering all 23 content modules. Tests mastery of Georgia law, use-of-force limits, emergency procedures, access control, reporting standards, and professional ethics. Minimum 85% required. Three critical questions — any wrong answer triggers 24-hour cooldown.',
   24, 85, 1.0, ARRAY['uas24-q3','uas24-q7','uas24-q9'], 'TBD', true);
