import type { SiteLanguage } from "@/contexts/LanguageContext";
import mentorshipEn from "./mentorship-en.json";
import mentorshipTi from "./mentorship-ti.json";

export type MentorshipCopy = typeof mentorshipEn;

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

export function getMentorshipCopy(lang: SiteLanguage): MentorshipCopy {
  const raw = lang === "ti" ? (mentorshipTi as MentorshipCopy) : mentorshipEn;
  return trimDeep(raw);
}
