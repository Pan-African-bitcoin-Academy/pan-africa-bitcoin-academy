import type { SiteLanguage } from "@/contexts/LanguageContext";
import chaptersEn from "./chapters-en.json";
import chaptersTi from "./chapters-ti.json";

export type ChaptersCopy = typeof chaptersEn;

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

export function getChaptersCopy(lang: SiteLanguage): ChaptersCopy {
  const raw = lang === "ti" ? (chaptersTi as ChaptersCopy) : chaptersEn;
  return trimDeep(raw);
}
