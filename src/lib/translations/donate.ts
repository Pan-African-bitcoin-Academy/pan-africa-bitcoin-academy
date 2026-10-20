import type { SiteLanguage } from "@/contexts/LanguageContext";
import donateEn from "./donate-en.json";
import donateTi from "./donate-ti.json";

export type DonateCopy = typeof donateEn;

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

export function getDonateCopy(lang: SiteLanguage): DonateCopy {
  const raw = lang === "ti" ? (donateTi as DonateCopy) : donateEn;
  return trimDeep(raw);
}
