export type SlideType = 'slide' | 'video' | 'scenario' | 'checklist';

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

export type Slide = SlideSlide | VideoSlide | ScenarioSlide | ChecklistSlide;

export interface LessonProgress {
  currentSlide: number;
  totalSlides: number;
  lastSavedAt: string;
}

export type TTSProvider = 'elevenlabs' | 'polly' | 'google';
