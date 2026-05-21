// Resend transactional email — server-side only
// RESEND_API_KEY must be set in .env.local and GitHub Secrets

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS   = 'Spartan Training <training@spartantraining.live>';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — email suppressed:', subject, 'to', to);
    return;
  }
  const res = await fetch(RESEND_API_URL, {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error('[email] Resend error:', res.status, body);
  }
}

export async function sendMagicLinkEmail(
  email:     string,
  fullName:  string,
  magicLink: string,
): Promise<void> {
  // Wrap in our interstitial so email security scanners (Defender, Mimecast, etc.)
  // can't consume the single-use Supabase token by pre-fetching the raw link.
  const encodedLink = Buffer.from(magicLink).toString('base64');
  const verifyUrl   = `https://spartantraining.live/auth/verify?next=${encodedLink}`;

  await sendEmail(
    email,
    'Spartan Training — Your Login Link',
    `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0A0907;font-family:Inter,sans-serif;color:#F0EDE6;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#111009;border:1px solid #2A2520;border-radius:4px;">
        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid #2A2520;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C5A059;">SPARTAN TRAINING LLC</p>
            <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#F0EDE6;">Your Login Link</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#B8B0A0;font-size:14px;line-height:1.6;">Operator <strong style="color:#F0EDE6;">${fullName}</strong>,</p>
            <p style="color:#B8B0A0;font-size:14px;line-height:1.6;">Click the button below to access your Spartan Training dashboard. This link is single-use and expires in 1 hour.</p>
            <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tr>
                <td style="background:#C5A059;border-radius:3px;">
                  <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;font-family:'Courier New',monospace;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0A0907;text-decoration:none;">Access Dashboard</a>
                </td>
              </tr>
            </table>
            <p style="color:#6A6460;font-size:12px;line-height:1.6;margin:0;">If the button does not work, copy and paste this address into your browser:<br/><span style="color:#B8B0A0;word-break:break-all;">${verifyUrl}</span></p>
            <p style="color:#6A6460;font-size:12px;line-height:1.6;margin:16px 0 0;">After first login, go to <strong style="color:#B8B0A0;">Settings</strong> to set a passphrase for future sign-ins.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2A2520;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#6A6460;">SPARTAN TRAINING LLC · MJM 2026 · GBPDSA COMPLIANT</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  );
}

export async function sendEnrollmentConfirmation(
  email:      string,
  fullName:   string,
  operatorId: string,
  track:      string,
): Promise<void> {
  const trackLabel =
    track === 'private-detective'      ? 'Private Detective (72hr)'
    : track === 'executive-protection' ? 'Executive Protection'
    : 'Armed Security Officer (16hr)';

  await sendEmail(
    email,
    'Spartan Training — Enrollment Confirmed',
    `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0A0907;font-family:Inter,sans-serif;color:#F0EDE6;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#111009;border:1px solid #2A2520;border-radius:4px;">
        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid #2A2520;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C5A059;">SPARTAN TRAINING LLC</p>
            <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#F0EDE6;">Enrollment Confirmed</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#B8B0A0;font-size:14px;line-height:1.6;">Operator <strong style="color:#F0EDE6;">${fullName}</strong>,</p>
            <p style="color:#B8B0A0;font-size:14px;line-height:1.6;">Your enrollment in the MJM 2026 <strong style="color:#C5A059;">${trackLabel}</strong> program has been confirmed. You will receive a separate email with your login link shortly.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#181510;border:1px solid #2A2520;border-radius:4px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#6A6460;">Operator ID</p>
                <p style="margin:0;font-family:'Courier New',monospace;font-size:20px;font-weight:700;color:#C5A059;">${operatorId}</p>
              </td></tr>
            </table>
            <p style="color:#B8B0A0;font-size:13px;line-height:1.6;margin:0;">Keep your Operator ID for all correspondence with MJM and GBPDSA.<br/>Platform: <a href="https://spartantraining.live" style="color:#C5A059;">spartantraining.live</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2A2520;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#6A6460;">SPARTAN TRAINING LLC · MJM 2026 · GBPDSA COMPLIANT</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  );
}

export async function sendCriticalFailAlert(
  operatorEmail:  string,
  operatorName:   string,
  operatorId:     string,
  moduleId:       string,
  moduleTitle:    string,
  commanderEmail: string | null,
): Promise<void> {
  const subject = `CRITICAL FAIL — ${operatorId} — ${moduleId}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0A0907;font-family:Inter,sans-serif;color:#F0EDE6;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#111009;border:1px solid #E84040;border-radius:4px;">
        <tr>
          <td style="padding:20px 40px;background:#E84040;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#fff;">SPARTAN TRAINING — CRITICAL FAIL ALERT</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#B8B0A0;font-size:14px;line-height:1.6;">A Critical Fail event has been recorded:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#181510;border:1px solid #2A2520;border-radius:4px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:13px;color:#B8B0A0;">Operator: <strong style="color:#F0EDE6;">${operatorName}</strong> (${operatorId})</p>
                <p style="margin:0 0 8px;font-size:13px;color:#B8B0A0;">Module: <strong style="color:#F0EDE6;">${moduleId} — ${moduleTitle}</strong></p>
                <p style="margin:0;font-size:13px;color:#B8B0A0;">Time: <strong style="color:#F0EDE6;">${new Date().toUTCString()}</strong></p>
              </td></tr>
            </table>
            <p style="color:#B8B0A0;font-size:13px;line-height:1.6;margin:0;">This operator has been placed in Tactical Reset status. A 24-hour cooldown is in effect. Module ${moduleId} must be reviewed in full before re-examination.<br/><br/>Review the full event log at <a href="https://spartantraining.live/dashboard/admin" style="color:#C5A059;">spartantraining.live/dashboard/admin</a>.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2A2520;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#6A6460;">SPARTAN TRAINING LLC · IMMUTABLE AUDIT LOG ACTIVE</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();

  // Always notify the operator
  await sendEmail(operatorEmail, subject, html);

  // Also notify commander if set
  if (commanderEmail && commanderEmail !== operatorEmail) {
    await sendEmail(commanderEmail, subject, html);
  }

  // Always copy super admin
  const adminEmail = process.env.SPARTAN_ADMIN_EMAIL;
  if (adminEmail && adminEmail !== operatorEmail) {
    await sendEmail(adminEmail, subject, html);
  }
}
