'use client';

import { useEffect } from 'react';

/**
 * Records that a specific slide was actually REACHED, not merely linked to.
 *
 * WHY THIS EXISTS
 * The corrective action screen used to mark an item "reviewed" in its onClick
 * handler — the moment the learner clicked the link, before anything had loaded.
 * If the destination bounced (the module page has its own enrollment and sequential
 * gates and redirects to /dashboard?gate=blocked), the learner landed somewhere
 * else entirely, closed the tab, and the note fields unlocked regardless. They were
 * let through the gate without ever seeing the material.
 *
 * The module page renders this only when a `?slide=` anchor actually resolved to a
 * real slide, so its presence is proof the learner got there. The corrective action
 * screen reads the key back when its tab regains focus.
 *
 * Deliberately localStorage rather than a server write: the two pages are separate
 * tabs on the same origin, and this is a training aid, not an access control. It
 * stops the accidental case — a bounced link silently unlocking the fields. It is
 * not tamper-proof against a determined learner with devtools, and nothing
 * client-side could be. `remediation_records.slide_viewed_at` carries the same
 * caveat and always has.
 */
export const slideAckKey = (slideId: string) => `ca-viewed:${slideId}`;

export function SlideViewAck({ slideId }: { slideId: string }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(slideAckKey(slideId), new Date().toISOString());
    } catch {
      // Private browsing, blocked storage, quota. The corrective action screen
      // detects that storage is unusable and enables its fields rather than
      // trapping the learner behind a signal that can never arrive.
    }
  }, [slideId]);

  return null;
}
