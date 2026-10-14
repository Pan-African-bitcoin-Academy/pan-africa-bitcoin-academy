import type { SiteLanguage } from "@/contexts/LanguageContext";
import homeEn from "./home-en.json";
import homeTi from "./home-ti.json";

export type HomeCopy = typeof homeEn;

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

export function getHomeCopy(lang: SiteLanguage): HomeCopy {
  const raw = lang === "ti" ? (homeTi as HomeCopy) : homeEn;
  return trimDeep(raw);
}
