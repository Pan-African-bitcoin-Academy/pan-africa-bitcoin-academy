import type { SiteLanguage } from "@/contexts/LanguageContext";
import blogEn from "./blog-en.json";
import blogTi from "./blog-ti.json";

export type BlogCopy = typeof blogEn;

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

export function getBlogCopy(lang: SiteLanguage): BlogCopy {
  const raw = lang === "ti" ? (blogTi as BlogCopy) : blogEn;
  return trimDeep(raw);
}
