import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "f5_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET não configurada (veja .env.example)");
  return s;
}

/**
 * Autenticação mínima para uso interno (single user / poucos usuários):
 * um cookie assinado (HMAC), sem senha por usuário nem OAuth.
 * Trocar por NextAuth/Clerk quando a equipe crescer — ver CLAUDE.md → "Autenticação".
 */
export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  const signature = createHmac("sha256", secret()).update(issuedAt).digest("hex");
  return `${issuedAt}.${signature}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expected = createHmac("sha256", secret()).update(issuedAt).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const ageSeconds = (Date.now() - Number(issuedAt)) / 1000;
  return ageSeconds >= 0 && ageSeconds <= SESSION_MAX_AGE_SECONDS;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
