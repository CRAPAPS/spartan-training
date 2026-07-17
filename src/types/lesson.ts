export type SlideType = 'slide' | 'video' | 'scenario' | 'checklist' | 'practical';

export interface Callout {
  type: 'warning' | 'info' | 'tip';
  text: string;
}

export interface SlideSlide {
  type: 'slide';
  heading: string;
  body: string;
  keyPoints?: string[];
  legalRef?: string;
  callout?: Callout;
  narrationUrl?: string;
}

export interface VideoSlide {
  type: 'video';
  src: string;
  caption: string;
  description: string;
  // narrationUrl on video slides plays only when video has no audio track
  narrationUrl?: string;
}

export interface ScenarioSlide {
  type: 'scenario';
  scenario: string;
  reflection: string;
  narrationUrl?: string;
}

export interface ChecklistSlide {
  type: 'checklist';
  title: string;
  items: Array<{ label: string; description: string }>;
  narrationUrl?: string;
}

export interface PracticalSlide {
  type: 'practical';
  practicalId: 'PR-1' | 'PR-2' | 'PR-3';
  title: string;
  hourCredit: number;
  brief: string[];
  requiredSections: string[];
  formattingStandards: string[];
  submissionInstructions: string;
  narrationUrl?: string;
}

export type Slide = SlideSlide | VideoSlide | ScenarioSlide | ChecklistSlide | PracticalSlide;

export interface PracticalSubmissionState {
  status: 'submitted' | 'graded';
  fileName: string;
  submittedAt: string;
  grade?: 'pass' | 'fail' | null;
  feedback?: string | null;
}

export interface LessonProgress {
  currentSlide: number;
  totalSlides: number;
  lastSavedAt: string;
}

export type TTSProvider = 'elevenlabs' | 'polly' | 'google';
