import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE = 'cm_admin_session';

const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'cm-design-dev-session-secret';
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function createAdminSession() {
  const issuedAt = Date.now();
  const nonce = randomBytes(12).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token?: string | null) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [issuedAtRaw, nonce, signature] = parts;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt) || !nonce || !signature) return false;

  const ageSeconds = (Date.now() - issuedAt) / 1000;
  if (ageSeconds < 0 || ageSeconds > MAX_AGE_SECONDS) return false;

  const expected = sign(`${issuedAtRaw}.${nonce}`);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return false;

  return timingSafeEqual(expectedBuf, actualBuf);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  };
}
