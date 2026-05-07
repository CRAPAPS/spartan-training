import { createHmac, timingSafeEqual } from 'crypto';

const APP_ID = process.env.SCORM_CLOUD_APP_ID!;
const SECRET  = process.env.SCORM_CLOUD_SECRET_KEY!;
const BASE    = 'https://cloud.scorm.com/api/v2';

function authHeader(): Record<string, string> {
  const encoded = Buffer.from(`${APP_ID}:${SECRET}`).toString('base64');
  return { Authorization: `Basic ${encoded}`, 'Content-Type': 'application/json' };
}

async function scormFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...authHeader(), ...init?.headers } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SCORM Cloud API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const scormCloud = {
  // Create a registration linking an operator to a course.
  // registrationId format: {operatorId}__{moduleId}
  createRegistration: (operatorId: string, moduleId: string, courseId: string) =>
    scormFetch('/registrations', {
      method: 'POST',
      body: JSON.stringify({
        courseId,
        learner: { id: operatorId, firstName: 'Operator', lastName: operatorId },
        registrationId: `${operatorId}__${moduleId}`,
      }),
    }),

  // Returns a time-limited launch URL to embed in the SCORM iframe.
  getLaunchUrl: async (operatorId: string, moduleId: string, redirectUrl: string): Promise<string> => {
    const registrationId = `${operatorId}__${moduleId}`;
    const data = await scormFetch<{ launchLink: string }>(
      `/registrations/${registrationId}/launchLink`,
      {
        method: 'POST',
        body: JSON.stringify({ expiry: 3600, redirectOnExitUrl: redirectUrl }),
      },
    );
    return data.launchLink;
  },

  // Verify the HMAC-SHA256 signature on incoming SCORM Cloud webhooks.
  verifyWebhookSignature: (rawBody: string, signature: string): boolean => {
    const expected = createHmac('sha256', process.env.SCORM_CLOUD_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');
    try {
      return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
    } catch {
      return false;
    }
  },
};
