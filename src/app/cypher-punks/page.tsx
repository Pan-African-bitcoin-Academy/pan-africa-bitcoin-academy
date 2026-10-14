import type { Metadata } from 'next';
import Link from 'next/link';
import { Noto_Sans_Ethiopic } from 'next/font/google';
import { MarkdownContent } from '@/components/MarkdownContent';
import { DownloadPdfButton } from '@/components/DownloadPdfButton';
import { cypherpunkArticleSections } from '@/content/cypherpunksArticle';

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'ሳይፈርፓንክስ፡ ብሕታዊነት፡ ክሪፕቶግራፊን ቃልሲ ንዲጂታላዊ ናጽነትን',
  description:
    'Long-form article on cypherpunk ideas, cryptography, privacy, and digital freedom in Tigrinya.',
  alternates: {
    canonical: '/cypher-punks',
  },
};

const sectionImages: Record<string, { src: string; alt: string; caption: string }[]> = {
  intro: [
    {
      src: 'The cypherpunk movement.jpg',
      alt: 'A futuristic networked computer and connected circuits representing the early digital culture of cypherpunks.',
      caption: 'Early cypherpunk culture was built around networked computation and encrypted communication.',
    },
  ],
  'section-1': [
    {
      src: 'What does Cypherpunk mean.jpg',
      alt: 'A conceptual illustration about the meaning of cypherpunk in a digital age.',
      caption: 'The term “cypherpunk” describes a political commitment to privacy through technical means.',
    },
  ],
  'section-2': [
    {
      src: 'Historical origins cryptography before cypherpunks.jpg',
      alt: 'Historic cryptography and communications imagery showing the long prehistory before cypherpunks.',
      caption: 'The movement grew from older cryptographic traditions and the desire to protect communication.',
    },
  ],
  'section-3': [
    {
      src: 'The birth of the cypherpunk movement.jpg',
      alt: 'Early cypherpunk movement imagery emphasizing the birth of a privacy-focused technical community.',
      caption: 'The movement emerged from a small internet culture that saw privacy as a technical and political issue.',
    },
  ],
  'section-4': [
    {
      src: 'The Cypherpunks mailing list.jpg',
      alt: 'A historical mailing list or archive scene illustrating how cypherpunks shared ideas online.',
      caption: 'Mailing lists became the main communication hub for sharing code, essays, and critiques.',
    },
  ],
  'section-5': [
    {
      src: 'The Cypherpunks manifesto.jpg',
      alt: 'A black-and-white manifesto page highlighting the original cypherpunk text and its privacy arguments.',
      caption: 'The manifesto framed privacy as a precondition for open societies and individual autonomy.',
    },
  ],
  'section-6': [
    {
      src: 'David Chaum DigiCash eCash portrait.webp',
      alt: 'Portrait of David Chaum, a key early cryptographer and privacy advocate.',
      caption: 'David Chaum’s work on eCash helped shape the idea that digital money could be private and decentralized.',
    },
    {
      src: 'Wei Dai b-money 1998 original paper.webp',
      alt: 'A portrait and paper cover representing Wei Dai’s b-money proposal.',
      caption: 'Wei Dai’s b-money proposal advanced the idea of digital money that avoids centralized control.',
    },
  ],
  'section-7': [
    {
      src: 'Code as a form of political action.jpg',
      alt: 'A symbolic image representing code as a form of political action and technological change.',
      caption: 'For cypherpunks, code was not only engineering—it was a political instrument.',
    },
  ],
  'section-8': [
    {
      src: 'The cypherpunks and the Crypto Wars.jpg',
      alt: 'A scene tied to the Crypto Wars era and the conflict over cryptography policy.',
      caption: 'The movement collided with state surveillance and export controls during the Crypto Wars.',
    },
  ],
  'section-9': [
    {
      src: 'Practical tools for building privacy.jpg',
      alt: 'An image representing practical privacy tools for secure communication and digital protection.',
      caption: 'Practical tools—such as encryption software and secure protocols—translated theory into action.',
    },
    {
      src: 'Phil Zimmermann PGP creator portrait.webp',
      alt: 'Portrait of Phil Zimmermann, creator of PGP and a leading figure in practical cryptography.',
      caption: 'PGP became a symbol of practical privacy technology in everyday communication.',
    },
  ],
  'section-10': [
    {
      src: 'John Gilmore cypherpunk portrait.webp',
      alt: 'Portrait of John Gilmore, a prominent cypherpunk and technologist associated with digital liberty.',
      caption: 'Cypherpunks were not a single person or movement; they were a network of builders and advocates.',
    },
    {
      src: 'Adam Back official portrait Blockstream.webp',
      alt: 'Portrait of Adam Back, a cypherpunk-era figure tied to cryptographic and Bitcoin innovations.',
      caption: 'The movement’s networks threaded through later technical communities and new forms of monetary systems.',
    },
  ],
  'section-11': [
    {
      src: 'Open-source software and peer review.jpg',
      alt: 'An illustration of open-source software and collaborative peer review in a technical community.',
      caption: 'Open-source software and peer review made the movement more transparent and resilient.',
    },
  ],
  'section-12': [
    {
      src: 'Decentralization, trust, and individual control.jpg',
      alt: 'A symbolic image showing decentralization, trust, and individual control in digital systems.',
      caption: 'Cypherpunks argued that trust should be replaced by verifiable technical systems where possible.',
    },
  ],
  'section-13': [
    {
      src: 'Internal disagreements and criticism.jpg',
      alt: 'An abstract scene illustrating internal disagreements and criticism inside the cypherpunk movement.',
      caption: 'The movement did not agree on everything; criticism and disagreement were part of its evolution.',
    },
  ],
  'section-14': [
    {
      src: 'What cypherpunks got right—and what they could not solve.jpg',
      alt: 'An illustration representing the limits and strengths of cypherpunk ideas in modern digital life.',
      caption: 'The movement correctly identified surveillance and centralization as major problems, but it could not solve every social challenge alone.',
    },
  ],
  'section-15': [
    {
      src: 'The continuing relevance of cypherpunk ideas.jpg',
      alt: 'A visual reflecting the continuing relevance of cypherpunk-era ideas in the modern digital world.',
      caption: 'Cypherpunk ideas remain relevant whenever institutions seek control over identity, money, and communication.',
    },
  ],
  conclusion: [
    {
      src: 'Conclusion — Digital freedom must be built.jpg',
      alt: 'A concluding image representing the ongoing struggle to build digital freedom and secure private communication.',
      caption: 'Digital freedom is not given; it must be designed, defended, and continually renewed.',
    },
  ],
};

const CYPHER_PUNKS_PDF_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/doc_files/Cypher%20Punks%20-%20Pan-African%20Bitcoin%20Academy.pdf`;

export default function CypherpunksPage() {
  return (
    <div className={`${notoEthiopic.className} min-h-screen overflow-x-hidden bg-[#070b11] text-zinc-100`}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="pt-4 sm:pt-8">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-orange-300/80 sm:text-[11px]">
            <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-1.5">
              PanAfrican Bitcoin Academy
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300">ትግርኛ</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
                Long-form article
              </p>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl lg:text-5xl">
                ሳይፈርፓንክስ፡ ብሕታዊነት፡ ክሪፕቶግራፊን ቃልሲ ንዲጂታላዊ ናጽነትን
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-zinc-300 sm:text-sm">
                <span className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1.5">
                  ትግርኛ translation
                </span>
                <span className="rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1.5">
                  10-12 minute read
                </span>
              </div>

              <div className="mt-4">
                <DownloadPdfButton
                  pdfUrl={CYPHER_PUNKS_PDF_URL}
                  fileName="Cypher Punks - Pan-African Bitcoin Academy.pdf"
                />
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <img
                src={`/cypher-punk/${encodeURIComponent('The cypherpunk movement.jpg')}`}
                alt="A networked computer and glowing circuits symbolizing the early cypherpunk movement and digital freedom."
                className="mx-auto block h-auto w-auto max-h-[300px] max-w-full object-contain sm:max-h-[440px] lg:mx-0"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </header>

        <div className="mt-8 lg:mt-10">
          <article className="prose prose-invert prose-lg max-w-none overflow-hidden text-zinc-200">
            {cypherpunkArticleSections.map((section) => {
              const sectionImageList = sectionImages[section.id] ?? [];

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6"
                >
                  <h2 className="mb-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                    {section.heading}
                  </h2>

                  <MarkdownContent content={section.body} highlightTerms={[]} />

                  {sectionImageList.length > 0 ? (
                    <div className="mt-6 space-y-5">
                      {sectionImageList.map((image, index) => (
                        <figure key={`${section.id}-${image.src}`} className="mx-auto max-w-full">
                          <img
                            src={`/cypher-punk/${encodeURIComponent(image.src)}`}
                            alt={image.alt}
                            className="mx-auto block h-auto w-auto max-h-[260px] max-w-full object-contain sm:max-h-[400px]"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                          <figcaption className="mx-auto mt-2 max-w-2xl text-center text-xs leading-relaxed text-zinc-400 sm:text-sm">
                            {image.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </article>
        </div>

        <footer className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-sm text-zinc-300">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-orange-300">Attribution</p>
              <p className="mt-2 text-zinc-200">PanAfrican Bitcoin Academy — Tigrinya translation</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link href="/chapters" className="text-cyan-300 transition hover:text-cyan-200">
                View chapters
              </Link>
              <span className="text-zinc-600">•</span>
              <Link href="/white_paper" className="text-cyan-300 transition hover:text-cyan-200">
                Tigrinya whitepaper
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
