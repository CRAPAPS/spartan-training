export interface ShuffledOption {
  label: string;      // display position: 'A' | 'B' | 'C' | 'D'
  text: string;
  originalKey: string; // original letter in DB — submitted to server for grading
}

export interface ShuffledQuestion {
  id: string;
  question: string;
  options: ShuffledOption[];
  is_critical: boolean;
  topic: string;
}

export interface TimelineEvent {
  type: 'answer' | 'timeout' | 'tab_exit' | 'tab_return' | 'strike_submit' | 'auto_submit';
  questionIdx: number;
  timeRemainingMs: number;
  timestamp: string;
  originalKey?: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  criticalFail: boolean;
  criticalFailId: string | null;
  status: string;
  attempts: number;
  feedback: FeedbackItem[];
}

export interface FeedbackItem {
  questionId: string;
  sequence: number;
  question: string;
  given: string | null;
  answer: string;
  correct: boolean;
  isCritical: boolean;
  explanation: string;
}
