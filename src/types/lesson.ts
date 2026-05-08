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
}

export interface VideoSlide {
  type: 'video';
  src: string;
  caption: string;
  description: string;
}

export interface ScenarioSlide {
  type: 'scenario';
  scenario: string;
  reflection: string;
}

export interface ChecklistSlide {
  type: 'checklist';
  title: string;
  items: Array<{ label: string; description: string }>;
}

export type Slide = SlideSlide | VideoSlide | ScenarioSlide | ChecklistSlide;

export interface LessonProgress {
  currentSlide: number;
  totalSlides: number;
  lastSavedAt: string;
}
