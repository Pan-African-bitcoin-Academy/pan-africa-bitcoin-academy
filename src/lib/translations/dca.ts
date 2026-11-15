import type { SiteLanguage } from "@/contexts/LanguageContext";
import dcaEn from "./dca-en.json";
import dcaTi from "./dca-ti.json";

export type DcaCopy = typeof dcaEn;

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

export function getDcaCopy(lang: SiteLanguage): DcaCopy {
  const raw = lang === "ti" ? (dcaTi as unknown as DcaCopy) : dcaEn;
  return trimDeep(raw);
}
