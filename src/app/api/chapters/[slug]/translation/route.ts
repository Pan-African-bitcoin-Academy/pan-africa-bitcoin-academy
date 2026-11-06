import { readFile } from "node:fs/promises";
import path from "node:path";

const chapterTranslations: Record<string, string> = {
  "the-journey-of-money": "ch02-journey-of-money-ti.md",
  "problems-with-traditional-fiat-money": "ch03-fiat-problems-ti.md",
  "from-crisis-to-innovation": "ch04-crisis-to-innovation-ti.md",
  "the-birth-of-bitcoin": "ch05-birth-of-bitcoin-ti.md",
  "keys-and-transactions": "ch06-keys-and-transactions-ti.md",
  "blockchain-basics": "ch07-blockchain-basics-ti.md",
  "exchange-software-wallet": "ch08-exchange-and-wallet-ti.md",
  "utxos-fees-coin-control": "ch09-utxos-fees-ti.md",
  "good-bitcoin-hygiene": "ch10-hygiene-ti.md",
  "hardware-signers": "ch11-hardware-signers-ti.md",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const fileName = chapterTranslations[slug];

  if (!fileName) {
    return Response.json({ error: "Tigrinya translation not found." }, { status: 404 });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "courses",
      "genesis",
      "chapters",
      fileName,
    );
    const markdown = await readFile(filePath, "utf8");
    const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const title = heading?.replace(/^ምዕራፍ\s+\d+\s*[·:.-]\s*/u, "").trim();
    const lessonStart = markdown.match(/^##\s+ቀንዲ ትሕዝቶ ትምህርቲ\s*$/mu);
    const content = lessonStart?.index !== undefined
      ? markdown.slice(lessonStart.index + lessonStart[0].length).trim()
      : markdown.replace(/^#\s+.+\r?\n+/, "").trim();

    return Response.json(
      { content, title },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
    );
  } catch (error) {
    console.error(`Failed to load Tigrinya chapter translation for ${slug}.`, error);
    return Response.json(
      { error: "Unable to load the Tigrinya chapter translation." },
      { status: 500 },
    );
  }
}
