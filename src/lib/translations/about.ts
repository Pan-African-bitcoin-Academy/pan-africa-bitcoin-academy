import type { SiteLanguage } from "@/contexts/LanguageContext";
import aboutEn from "./about-en.json";
import aboutTi from "./about-ti.json";

export type AboutCopy = typeof aboutEn;

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

export function getAboutCopy(lang: SiteLanguage): AboutCopy {
  const raw = lang === "ti" ? (aboutTi as AboutCopy) : aboutEn;
  return trimDeep(raw);
}
