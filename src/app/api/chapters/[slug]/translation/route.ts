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
  "verify-for-yourself-block-explorers-nodes": "ch12-verify-for-yourself-ti.md",
  "proof-of-work-and-block-rewards": "ch13-proof-of-work-ti.md",
  "mining-in-practice": "ch14-mining-in-practice-ti.md",
  "layer-2-sidechains-in-daily-life": "ch15-layer2-sidechains-ti.md",
  "full-node-opening-a-lightning-channel": "ch16-full-node-lightning-ti.md",
  "multi-sig-collaborative-custody": "ch17-multisig-ti.md",
  "intro-to-bitcoin-script-optional-track": "ch18-bitcoin-script-ti.md",
  "utxo-consolidation-privacy-risks": "ch19-consolidation-privacy-ti.md",
  "why-bitcoin-philosophy-adoption": "ch20-philosophy-ti.md",
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
    const lessonStart =
      markdown.match(/^##\s+ቀንዲ ትሕዝቶ(?: ትምህርቲ)?\s*$/mu) ||
      markdown.match(/^##\s+መእተዊ\s*$/mu);
    const content = lessonStart?.index !== undefined
      ? (markdown.slice(lessonStart.index + (lessonStart[0].includes("መእተዊ") ? 0 : lessonStart[0].length))).trim()
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
