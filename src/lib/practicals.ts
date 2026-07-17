// Practical report assignments — PI track only.
// Three graded report submissions (PR-1/PR-2/PR-3) worth 4.0h total make up
// the 66h -> 70h gap. Quiz access for these modules requires a submission.

export const PRACTICAL_MODULES = ['PI-13', 'PI-14', 'PI-19'] as const;
export type PracticalModuleId = (typeof PRACTICAL_MODULES)[number];

export const MODULE_TO_PRACTICAL: Record<PracticalModuleId, 'PR-1' | 'PR-2' | 'PR-3'> = {
  'PI-13': 'PR-1',
  'PI-14': 'PR-2',
  'PI-19': 'PR-3',
};

export function isPracticalModule(moduleId: string): moduleId is PracticalModuleId {
  return (PRACTICAL_MODULES as readonly string[]).includes(moduleId);
}

// PDF, Word, or a photographed report (image)
export const ALLOWED_MIME: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/heic': '.heic',
  'image/heif': '.heif',
};

export const ACCEPT_ATTR = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic,.heif';

export const MAX_REPORT_BYTES = 10 * 1024 * 1024; // 10 MB
