import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SPARTAN_SYSTEM_PROMPT = `You are the Spartan Training Lead Specialist — Authoritative Accreditation Specialist for MJM 2026 Armed Security.

You are the lead registrar and tactical gatekeeper for Spartan Training. You are engineered to audit complex certification documents — specifically the MJM 2026 Armed Security standards — to establish a strict Competency Gauge for professional operators.

CORE DIRECTIVES:
- Accreditation Proctoring: Generate high-stakes exams, knowledge checks, and "Critical Fail" logic to ensure the Spartan Standard is met without compromise.
- LMS Intelligence: Provide grading rubrics aligned to GBPDSA minimum standards for each module.
- Operator Development: You are invested in the success of each operator. When they pass, acknowledge the achievement. When they fall short, be direct about what must be improved — because their safety and the safety of others depends on it.
- Persona: Precise, authoritative, and mission-focused. You hold operators to the highest standard because the work demands it — but you recognize that learning is a process and every serious operator who commits to improvement will meet the standard.

CRITICAL FAIL DEFINITION:
A Critical Fail question is one where a wrong answer indicates the operator poses an active safety risk to persons or property. These are non-negotiable disqualifiers. Wrong answers on Critical Fail questions trigger immediate Tactical Reset regardless of overall score.

Examples of Critical Fail topics:
- Unlawful use of deadly force
- Firearm safety violations
- Illegal search and seizure
- Failure to de-escalate when legally required
- Chain of custody violations

OUTPUT FORMAT:
Always respond with valid JSON only. No preamble, no explanation, no markdown fencing. Begin your response with { and end with }.`;

const PDF_PATHS = {
  armedSecurity: path.join(
    process.cwd(),
    '..',
    'CertificationTraining material',
    '2026 MJM ARMED SECURITY TRAINING CLASS GBPDSA 16hr Armed Security Officer Training.pdf'
  ),
  privateDetective: path.join(
    process.cwd(),
    '..',
    'CertificationTraining material',
    '2026 MJM PRIVATE DETECTIVE TRAINING CLASS GBPDSA Private Detective Training 72 hr.pages.pdf'
  ),
};

function loadPdfAsBase64(pdfPath: string): string | null {
  try {
    return fs.readFileSync(path.resolve(pdfPath)).toString('base64');
  } catch {
    return null;
  }
}

export interface QuizQuestion {
  id:          string;
  question:    string;
  options:     { A: string; B: string; C: string; D: string };
  correct:     'A' | 'B' | 'C' | 'D';
  explanation: string;
  isCritical:  boolean;
  topic:       string;
}

export interface GeneratedQuiz {
  moduleId:     string;
  moduleTitle:  string;
  passingScore: number;
  questions:    QuizQuestion[];
}

export interface QuizEvaluation {
  totalQuestions: number;
  correctAnswers: number;
  score:          number;
  passed:         boolean;
  criticalFail:   boolean;
  criticalFailId: string | null;
  feedback:       { questionId: string; correct: boolean; explanation: string }[];
}

export async function generateModuleQuiz(
  moduleId: string,
  moduleTitle: string,
  passingScore: number,
  questionCount = 10
): Promise<GeneratedQuiz> {
  const pdfBase64 = loadPdfAsBase64(PDF_PATHS.armedSecurity);

  const prompt = `Using the MJM 2026 Armed Security training document as your authoritative knowledge base, generate a ${questionCount}-question accreditation quiz for:

MODULE ID: ${moduleId}
MODULE TITLE: ${moduleTitle}
PASSING THRESHOLD: ${passingScore}%

REQUIREMENTS:
- Exactly ${questionCount} multiple-choice questions (A, B, C, D)
- At least 2 questions must be marked isCritical: true (questions where a wrong answer indicates an active safety risk)
- Questions must be directly traceable to GBPDSA standards in the knowledge base
- Distractors must be plausible — not obviously wrong
- No trick questions; test genuine comprehension

Return this exact JSON structure with no text before or after:
{
  "moduleId": "${moduleId}",
  "moduleTitle": "${moduleTitle}",
  "passingScore": ${passingScore},
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "A",
      "explanation": "...",
      "isCritical": false,
      "topic": "..."
    }
  ]
}`;

  type ContentBlock =
    | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } }
    | { type: 'text'; text: string };

  const content: ContentBlock[] = [];

  if (pdfBase64) {
    content.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
    });
  }

  content.push({ type: 'text', text: prompt });

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    temperature: 0.4,
    system: SPARTAN_SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  });

  const raw = message.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('');

  // Strip markdown code fences Claude occasionally emits despite instructions
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  return JSON.parse(text) as GeneratedQuiz;
}

export async function evaluateQuizAnswers(
  questions: QuizQuestion[],
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>
): Promise<QuizEvaluation> {
  let correct = 0;
  let criticalFail = false;
  let criticalFailId: string | null = null;

  const feedback = questions.map(q => {
    const given   = answers[q.id];
    const isRight = given === q.correct;
    if (isRight) correct++;

    if (!isRight && q.isCritical && !criticalFail) {
      criticalFail   = true;
      criticalFailId = q.id;
    }

    return { questionId: q.id, correct: isRight, explanation: q.explanation };
  });

  const score  = Math.round((correct / questions.length) * 100);
  const passed = score >= 80 && !criticalFail;

  return { totalQuestions: questions.length, correctAnswers: correct, score, passed, criticalFail, criticalFailId, feedback };
}
