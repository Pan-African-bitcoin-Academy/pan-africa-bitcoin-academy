import type { SiteLanguage } from "@/contexts/LanguageContext";
import applyEn from "./apply-en.json";
import applyTi from "./apply-ti.json";

export type ApplyCopy = typeof applyEn;

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

export function getApplyCopy(lang: SiteLanguage): ApplyCopy {
  const raw = lang === "ti" ? (applyTi as ApplyCopy) : applyEn;
  return trimDeep(raw);
}
