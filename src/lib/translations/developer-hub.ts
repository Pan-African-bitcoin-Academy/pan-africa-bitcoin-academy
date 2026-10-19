import type { SiteLanguage } from "@/contexts/LanguageContext";
import developerHubEn from "./developer-hub-en.json";
import developerHubTi from "./developer-hub-ti.json";

export type DeveloperHubCopy = typeof developerHubEn;

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

export function getDeveloperHubCopy(lang: SiteLanguage): DeveloperHubCopy {
  const raw = lang === "ti" ? (developerHubTi as DeveloperHubCopy) : developerHubEn;
  return trimDeep(raw);
}
