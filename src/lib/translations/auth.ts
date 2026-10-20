import type { SiteLanguage } from "@/contexts/LanguageContext";
import authEn from "./auth-en.json";
import authTi from "./auth-ti.json";

export type AuthCopy = typeof authEn;

function trimDeep<T>(value: T): T {
  if (typeof value === "string") return value.trim() as T;
  if (Array.isArray(value)) return value.map((item) => trimDeep(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = trimDeep(nested);
    }
    return out as T;
  }
  return value;
}

export function getAuthCopy(lang: SiteLanguage): AuthCopy {
  const raw = lang === "ti" ? (authTi as AuthCopy) : authEn;
  return trimDeep(raw);
}
