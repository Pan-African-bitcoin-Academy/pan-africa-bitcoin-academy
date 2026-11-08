"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { getChapterBySlug, chaptersContent } from "@/content/chaptersContent";
import type { ChapterContent } from "@/content/chaptersContent";
import { getChaptersList } from "@/content/chaptersListContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChapterAccessCheck } from "./ChapterAccessCheck";
import { ChapterCompletionTracker } from "./ChapterCompletionTracker";
import { NextChapterButton } from "./NextChapterButton";
import { DoneChapterButton } from "./DoneChapterButton";
import { LiveBlockchainData } from "@/components/LiveBlockchainData";
import { AdminModeWrapper } from "@/components/AdminModeWrapper";
import { ChapterAssignment } from "@/components/ChapterAssignment";
import { Chapter6Assignment } from "@/components/Chapter6Assignment";
import { Chapter8Assignment } from "@/components/Chapter8Assignment";
import { Chapter18Assignment } from "@/components/Chapter18Assignment";
import { ChapterUTXOAssignment } from "@/components/ChapterUTXOAssignment";
import { Chapter14HalvingPuzzle } from "@/components/Chapter14HalvingPuzzle";
import { ChapterExplorerAssignment } from "@/components/ChapterExplorerAssignment";
import { Chapter17MultisigAssignment } from "@/components/Chapter17MultisigAssignment";
import { SeedPhraseGrid } from "@/components/SeedPhraseGrid";
import { BtcSatsConverter } from "@/components/BtcSatsConverter";
import { ChapterSectionAnimated } from "@/components/chapters/ChapterSectionAnimated";
import { ChapterTechVectors } from "@/components/chapters/ChapterTechVectors";
import { WrapUpResourcesContent } from "@/components/chapters/WrapUpResourcesContent";
import { ZoomableImage } from "@/components/ZoomableImage";
import { MarkdownContent } from "@/components/MarkdownContent";
import { KeysChapterHeroQuote } from "@/components/chapters/KeysChapterHeroQuote";
import { BlockchainBasicsHeroQuote } from "@/components/chapters/BlockchainBasicsHeroQuote";

const Chapter1InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter1InteractiveLesson").then((module) => module.Chapter1InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 1 learning activities…
      </p>
    ),
  }
);

const Chapter2InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter2InteractiveLesson").then((module) => module.Chapter2InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 2 learning activities…
      </p>
    ),
  }
);

const Chapter3InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter3InteractiveLesson").then((module) => module.Chapter3InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 3 learning activities…
      </p>
    ),
  }
);

const Chapter4InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter4InteractiveLesson").then((module) => module.Chapter4InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 4 learning activities…
      </p>
    ),
  }
);

const Chapter5InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter5InteractiveLesson").then((module) => module.Chapter5InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 5 learning activities...
      </p>
    ),
  }
);

const Chapter6InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter6InteractiveLesson").then((module) => module.Chapter6InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 6 learning activities...
      </p>
    ),
  }
);

const Chapter7InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter7InteractiveLesson").then((module) => module.Chapter7InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 7 learning activities...
      </p>
    ),
  }
);

const Chapter8InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter8InteractiveLesson").then((module) => module.Chapter8InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 8 learning activities...
      </p>
    ),
  }
);

const Chapter9InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter9InteractiveLesson").then((module) => module.Chapter9InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 9 learning activities...
      </p>
    ),
  }
);

const Chapter10InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter10InteractiveLesson").then((module) => module.Chapter10InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 10 learning activities...
      </p>
    ),
  }
);

const Chapter11InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter11InteractiveLesson").then((module) => module.Chapter11InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 11 learning activities...
      </p>
    ),
  }
);

const Chapter12InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter12InteractiveLesson").then((module) => module.Chapter12InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 12 learning activities...
      </p>
    ),
  }
);

const Chapter13InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter13InteractiveLesson").then((module) => module.Chapter13InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 13 visual representations...
      </p>
    ),
  }
);

const Chapter14InteractiveLesson = dynamic(
  () => import("@/components/chapters/Chapter14InteractiveLesson").then((module) => module.Chapter14InteractiveLesson),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400" role="status">
        Loading Chapter 14 mining activities...
      </p>
    ),
  }
);

function TigrinyaChapterLesson({
  content,
  chapter,
}: {
  content: string;
  chapter: ChapterContent;
}) {
  const sections = content
    .split(/(?=^#{2,3}\s+)/m)
    .map((markdown) => {
      const heading = markdown.match(/^#{2,3}\s+(.+)$/m)?.[1]?.trim();
      if (!heading || /image\s*references?|visual\s*references?|ስእላዊ|መወከሲታት/iu.test(heading)) {
        return null;
      }

      return { heading, markdown };
    })
    .filter((section): section is { heading: string; markdown: string } => section !== null);

  const findOriginalSection = (heading: string) => {
    const sectionNumber = heading.match(/^\s*(\d+(?:\.\d+)?)/)?.[1];
    if (sectionNumber) {
      const numberedSection = chapter.sections.find(
        (section) => section.heading.match(/^\s*(\d+(?:\.\d+)?)/)?.[1] === sectionNumber,
      );
      if (numberedSection) return numberedSection;
    }

    if (heading.includes("መእተዊ")) {
      return chapter.sections.find((section) => section.heading === "Introduction");
    }

    const normalizedHeading = heading.toLowerCase();
    if (normalizedHeading.includes("seed phrase") || heading.includes("ዘርኢ ሓረግ")) {
      return chapter.sections.find((section) => section.seedPhrase?.length);
    }

    if (chapter.slug === "the-birth-of-bitcoin" && heading.includes("ሳት")) {
      return chapter.sections.find((section) => section.heading === "What Are Sats?");
    }

    return undefined;
  };

  return (
    <div className="space-y-5">
      {sections.map(({ heading, markdown }, index) => {
        const originalSection = findOriginalSection(heading);
        const images = originalSection?.images ?? [];
        const isBlockchainDemo =
          chapter.slug === "blockchain-basics" &&
          heading.includes("መስተጋብራዊ ብሎክቸይን ዲሞ");
        const duplicateDemoIndex =
          chapter.slug === "blockchain-basics" && heading.startsWith("7.4")
            ? markdown.search(/^####\s+መስተጋብራዊ ብሎክቸይን/imu)
            : -1;
        const sectionMarkdown =
          duplicateDemoIndex >= 0 ? markdown.slice(0, duplicateDemoIndex) : markdown;
        const deferredExampleIndex =
          chapter.slug === "problems-with-traditional-fiat-money" &&
          originalSection?.heading.startsWith("3.1")
            ? sectionMarkdown.search(/^>\s*\*\*📖/m)
            : -1;
        const lessonMarkdown =
          deferredExampleIndex >= 0
            ? sectionMarkdown.slice(0, deferredExampleIndex)
            : sectionMarkdown;
        const deferredExampleMarkdown =
          deferredExampleIndex >= 0 ? sectionMarkdown.slice(deferredExampleIndex) : "";

        return (
          <ChapterSectionAnimated
            key={`${index}-${heading}`}
            sectionId={`tigrinya-section-${index}`}
            sectionIdx={index}
          >
            <section
              id={`tigrinya-section-${index}`}
              className={`chapter-section-inner scroll-mt-20 rounded-lg border border-zinc-800/60 bg-zinc-950 p-3.5 shadow-inner transition-shadow duration-300 sm:p-5 ${
                isBlockchainDemo ? "border-cyan-400/30 bg-cyan-500/10" : ""
              }`}
            >
              <MarkdownContent content={lessonMarkdown} variant="chapter" />
              {originalSection?.seedPhrase?.length ? (
                <SeedPhraseGrid words={originalSection.seedPhrase} columns={4} />
              ) : null}
              {chapter.slug === "the-birth-of-bitcoin" && heading.includes("ሳት") ? (
                <div className="mt-6">
                  <BtcSatsConverter />
                </div>
              ) : null}
              {chapter.slug === "blockchain-basics" && heading.startsWith("7.0") ? (
                <div className="mt-6">
                  <LiveBlockchainData />
                </div>
              ) : null}
              {images.length > 0 ? (
                images.length >= 3 &&
                images.some((image) =>
                  ["jade.png", "ledger.jpeg", "trazeor.jpeg"].some((name) =>
                    image.src.includes(name),
                  ),
                ) ? (
                  <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {images.map((image) => (
                      <div key={image.src} className="flex flex-col items-center">
                        <ZoomableImage
                          src={image.src}
                          alt={image.alt}
                          caption={image.caption}
                          className="w-full rounded-lg shadow-lg"
                          thumbnailClassName="max-h-[28rem]"
                        />
                      </div>
                    ))}
                  </div>
                ) : chapter.slug === "problems-with-traditional-fiat-money" &&
                  originalSection?.heading.startsWith("3.1") &&
                  images.length >= 4 ? (
                  <div className="mt-6 space-y-5">
                    <p className="text-center text-base font-semibold text-orange-200">
                      ቅድሚ 20 ዓመት → ሕጂ
                    </p>
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
                      {images.slice(0, 3).map((image, imageIndex) => (
                        <div key={image.src} className="flex flex-col items-center">
                          {imageIndex === 0 ? (
                            <p className="mb-1 text-xs font-semibold text-orange-200">ቅድሚ 20 ዓመት</p>
                          ) : null}
                          {imageIndex === 2 ? (
                            <p className="mb-1 text-xs font-semibold text-orange-200">ሕጂ</p>
                          ) : null}
                          <ZoomableImage
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className={`rounded-lg shadow-lg ${
                              image.src.includes("arrow")
                                ? "h-10 w-20 object-contain sm:h-12 sm:w-24"
                                : "w-28 sm:w-36"
                            }`}
                            thumbnailClassName={
                              image.src.includes("arrow")
                                ? "max-h-12"
                                : "max-h-28 sm:max-h-32 object-contain"
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {images.length >= 5 ? (
                      <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                        {images.slice(3, 5).map((image) => (
                          <div key={image.src} className="flex flex-col items-center">
                            <ZoomableImage
                              key={image.src}
                              src={image.src}
                              alt={image.alt}
                              caption={image.caption}
                              className="w-full rounded-lg shadow-lg"
                              thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : chapter.slug === "problems-with-traditional-fiat-money" &&
                  originalSection?.heading.startsWith("3.2") &&
                  images.length === 2 ? (
                  <div className="mt-6 space-y-4">
                    <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                      {images.map((image) => (
                        <div key={image.src} className="flex flex-col items-center">
                          <ZoomableImage
                            key={image.src}
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                            thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm font-semibold text-orange-200">
                      ማእከላዊ ቁጽጽር ኣብ ገንዘብ
                    </p>
                  </div>
                ) : chapter.slug === "from-crisis-to-innovation" &&
                  originalSection?.heading.startsWith("4.1") ? (
                  <div className="mt-6 flex flex-col items-center space-y-4">
                    {images.map((image) => (
                      <div key={image.src} className="flex w-full min-w-0 flex-col items-center sm:max-w-[50%]">
                        <ZoomableImage
                          src={image.src}
                          alt={image.alt}
                          caption={image.caption}
                          className="w-full rounded-lg border border-orange-400/20 object-contain shadow-lg"
                          thumbnailClassName="max-h-44 sm:max-h-48 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ) : chapter.slug === "keys-and-transactions" &&
                  originalSection?.heading.startsWith("6.2") &&
                  images.length === 1 ? (
                  <div className="mt-6 flex flex-col items-center space-y-4">
                    <div className="w-full max-w-2xl rounded-lg border border-cyan-400/20 bg-zinc-900/50 p-4 shadow-lg">
                      <ZoomableImage
                        src={images[0].src}
                        alt={images[0].alt}
                        caption={images[0].caption}
                        className="w-full rounded-lg object-contain"
                      />
                      <p className="mt-2 text-center text-xs text-zinc-400">
                        ኣሊስ ትራንዛክሽን ትፈጥር → ትፍኖ → ኖድስ የረጋግጹ → ዕደናውያን የረጋግጹ
                      </p>
                    </div>
                  </div>
                ) : chapter.slug === "problems-with-traditional-fiat-money" &&
                  originalSection?.heading.startsWith("3.5") &&
                  images.length >= 1 ? (
                  <div className="mt-6 space-y-4">
                    <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                      {images.map((image) => (
                        <div key={image.src} className="flex flex-col items-center">
                          <ZoomableImage
                            key={image.src}
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                            thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : chapter.slug === "from-crisis-to-innovation" &&
                  originalSection?.heading.startsWith("4.2") &&
                  images.length >= 1 ? (
                  <div className="mt-6 space-y-4">
                    <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                      {images.map((image) => (
                        <div key={image.src} className="flex flex-col items-center">
                          <ZoomableImage
                            key={image.src}
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                            thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`mt-6 grid gap-6 ${
                      images.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {images.map((image) => (
                      <ZoomableImage
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        caption={image.caption}
                        className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                        thumbnailClassName={
                          image.src.includes("utxosize") ||
                          image.src.includes("mempool") ||
                          image.src.includes("markel") ||
                          image.src.includes("pow")
                            ? "max-h-[32rem]"
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )
              ) : null}
              {deferredExampleMarkdown ? (
                <MarkdownContent content={deferredExampleMarkdown} variant="chapter" />
              ) : null}
              {originalSection?.video ? (
                <div className="mt-6 flex flex-col items-center">
                  <div
                    className={[
                      "w-full mx-auto overflow-hidden rounded-xl border border-orange-400/20 bg-black shadow-lg",
                      chapter.slug === "problems-with-traditional-fiat-money"
                        ? "max-w-md sm:max-w-lg"
                        : "max-w-2xl",
                    ].join(" ")}
                  >
                    <video
                      className="w-full max-h-56 sm:max-h-64 object-contain aspect-video"
                      controls
                      preload="metadata"
                      src={originalSection.video.src}
                      playsInline
                    >
                      {originalSection.video.caption}
                    </video>
                  </div>
                  {originalSection.video.caption ? (
                    <p className="mt-2 text-center text-sm italic text-zinc-400">
                      {originalSection.video.caption}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>
            {chapter.slug === "the-journey-of-money" && heading.includes("መእተዊ") ? (
              <Chapter2InteractiveLesson module="evolution" isTi={true} />
            ) : null}
            {chapter.slug === "the-journey-of-money" && heading.startsWith("2.1") ? (
              <Chapter2InteractiveLesson module="barter_commodity" isTi={true} />
            ) : null}
            {chapter.slug === "the-journey-of-money" && heading.startsWith("2.2") ? (
              <Chapter2InteractiveLesson module="coinage_aksum" isTi={true} />
            ) : null}
            {chapter.slug === "the-journey-of-money" && heading.startsWith("2.3") ? (
              <Chapter2InteractiveLesson module="goldsmith_paper" isTi={true} />
            ) : null}
            {chapter.slug === "the-journey-of-money" && heading.startsWith("2.4") ? (
              <Chapter2InteractiveLesson module="fiat_inflation" isTi={true} />
            ) : null}
            {chapter.slug === "problems-with-traditional-fiat-money" && heading.startsWith("3.1") ? (
              <Chapter3InteractiveLesson module="inflation_power" isTi={true} />
            ) : null}
            {chapter.slug === "problems-with-traditional-fiat-money" && heading.startsWith("3.2") ? (
              <Chapter3InteractiveLesson module="centralized_control" isTi={true} />
            ) : null}
            {chapter.slug === "problems-with-traditional-fiat-money" && heading.startsWith("3.3") ? (
              <Chapter3InteractiveLesson module="cantillon_funnel" isTi={true} />
            ) : null}
            {chapter.slug === "problems-with-traditional-fiat-money" && heading.startsWith("3.5") ? (
              <Chapter3InteractiveLesson module="crisis_bailout_2008" isTi={true} />
            ) : null}
            {chapter.slug === "from-crisis-to-innovation" && heading.startsWith("4.1") ? (
              <Chapter4InteractiveLesson module="cypherpunk_timeline" isTi={true} />
            ) : null}
            {chapter.slug === "from-crisis-to-innovation" && heading.startsWith("4.2") ? (
              <Chapter4InteractiveLesson module="timestamp_chain" isTi={true} />
            ) : null}
            {chapter.slug === "the-birth-of-bitcoin" && heading.startsWith("5.1") ? (
              <Chapter5InteractiveLesson module="genesis_whitepaper" isTi={true} />
            ) : null}
            {chapter.slug === "the-birth-of-bitcoin" && heading.startsWith("5.2") ? (
              <>
                <Chapter5InteractiveLesson module="p2p_vs_centralized" isTi={true} />
                <Chapter5InteractiveLesson module="network_topology" isTi={true} />
                <Chapter5InteractiveLesson module="three_pillars" isTi={true} />
              </>
            ) : null}
            {chapter.slug === "keys-and-transactions" && heading.startsWith("6.1") ? (
              <Chapter6InteractiveLesson module="mailbox_keys" isTi={true} />
            ) : null}
            {chapter.slug === "keys-and-transactions" && heading.startsWith("6.2") ? (
              <Chapter6InteractiveLesson module="p2p_pipeline" isTi={true} />
            ) : null}
          </ChapterSectionAnimated>
        );
      })}
    </div>
  );
}

type ChapterDetailClientProps = {
  slug: string;
};

export function ChapterDetailClient({ slug }: ChapterDetailClientProps) {
  const { language } = useLanguage();
  const isTi = language === "ti";
  const hasTigrinyaMarkdown = isTi && [
    "the-journey-of-money",
    "problems-with-traditional-fiat-money",
    "from-crisis-to-innovation",
    "the-birth-of-bitcoin",
    "keys-and-transactions",
    "blockchain-basics",
    "exchange-software-wallet",
    "utxos-fees-coin-control",
    "good-bitcoin-hygiene",
    "hardware-signers",
  ].includes(slug);
  const [tigrinyaLesson, setTigrinyaLesson] = React.useState<{
    slug: string;
    title: string;
    content: string;
  } | null>(null);
  const [translationError, setTranslationError] = React.useState<string | null>(null);
  const [translationRequest, setTranslationRequest] = React.useState(0);

  React.useEffect(() => {
    if (!hasTigrinyaMarkdown) {
      setTigrinyaLesson(null);
      setTranslationError(null);
      return;
    }

    const controller = new AbortController();
    setTigrinyaLesson(null);
    setTranslationError(null);

    const loadTranslation = async () => {
      try {
        const response = await fetch(`/api/chapters/${encodeURIComponent(slug)}/translation`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Translation request failed (${response.status}).`);
        }

        const payload: unknown = await response.json();
        if (
          typeof payload !== "object" ||
          payload === null ||
          !("content" in payload) ||
          typeof payload.content !== "string" ||
          !("title" in payload) ||
          typeof payload.title !== "string"
        ) {
          throw new Error("The translation response was invalid.");
        }

        setTigrinyaLesson({ slug, title: payload.title, content: payload.content });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setTranslationError(
          error instanceof Error ? error.message : "Unable to load the Tigrinya translation.",
        );
      }
    };

    void loadTranslation();
    return () => controller.abort();
  }, [hasTigrinyaMarkdown, slug, translationRequest]);
  
  if (!slug) {
    notFound();
  }
  const chapter = getChapterBySlug(slug, language);
  const localizedChapter = hasTigrinyaMarkdown
    ? getChaptersList("ti").find((item) => item.number === chapter?.number)
    : undefined;
  const activeTigrinyaLesson = tigrinyaLesson?.slug === slug ? tigrinyaLesson : null;

  if (!chapter) {
    const titleFromSlug = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return (
      <PageContainer
        title={`Chapter: ${titleFromSlug}`}
        subtitle="This chapter is part of the Pan-Africa Bitcoin Academy curriculum. Full content coming soon."
      >
        <div className="space-y-6 sm:space-y-8 text-sm text-zinc-100 sm:text-base w-full min-w-0">
          <section className="rounded-xl border border-zinc-800/50 bg-zinc-950 p-4 sm:p-5 shadow-inner">
            <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
              Chapter Content
            </h2>
            <p className="mt-2 text-sm text-zinc-200">
              This chapter is being developed. Please check back soon for the full lesson content.
            </p>
          </section>
        </div>
      </PageContainer>
    );
  }

  const nextChapter =
    chapter.nextSlug && (getChapterBySlug(chapter.nextSlug, language) || chaptersContent.find((c) => c.slug === chapter.nextSlug));
  
  const previousChapter = chapter.number > 1
    ? chaptersContent.find((c) => c.number === chapter.number - 1) ? getChapterBySlug(chaptersContent.find((c) => c.number === chapter.number - 1)!.slug, language) : null
    : null;

  const isWrapUpResources = chapter.slug === "wrap-up-resources";

  return (
    <AdminModeWrapper>
      <ChapterAccessCheck chapterNumber={chapter.number} chapterSlug={chapter.slug}>
        <ChapterCompletionTracker chapterNumber={chapter.number} chapterSlug={chapter.slug} />
        <PageContainer
      title={
        isWrapUpResources
          ? undefined
          : isTi
            ? `ምዕራፍ ${chapter.number} · ${activeTigrinyaLesson?.title ?? localizedChapter?.title ?? chapter.title}`
            : `Chapter ${chapter.number} · ${chapter.title}`
      }
      subtitle={
        isWrapUpResources
          ? undefined
          : isTi
          ? `${localizedChapter?.difficulty ?? chapter.level} · ${chapter.duration} · ${chapter.type === "Theory" ? "ቲዮሪ" : chapter.type === "Practice" ? "ልምምድ" : "ተሓዋዊ"}`
          : `${chapter.level} · ${chapter.duration} · ${chapter.type}`
      }
    >
      <div className="space-y-8 text-sm text-zinc-100 sm:text-base">
        {isWrapUpResources ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <DoneChapterButton chapterNumber={chapter.number} chapterSlug={chapter.slug} />
          </div>
        ) : (
        /* Hero */
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-950 p-3.5 sm:p-6 shadow-inner w-full min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-cyan-300/90">
                <span className="rounded-full border border-cyan-400/40 px-2 py-0.5">
                  {localizedChapter?.difficulty ?? chapter.level}
                </span>
                <span className="rounded-full border border-orange-400/40 px-2 py-0.5">
                  {isTi
                    ? chapter.type === "Practice"
                      ? "ልምምድ"
                      : chapter.type === "Theory"
                        ? "ክልሰ-ሓሳብ"
                        : "ተሓዋዊ"
                    : chapter.type}
                </span>
                <span className="rounded-full border border-purple-400/40 px-2 py-0.5">
                  {chapter.duration}
                </span>
              </div>
              {!hasTigrinyaMarkdown ? (
                <p className="text-lg font-semibold text-zinc-100 sm:text-xl">
                  {chapter.hook}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {previousChapter ? (
                <Link
                  href={`/chapters/${previousChapter.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200 transition hover:border-purple-400/70 hover:bg-purple-500/20"
                >
                  {isTi ? `← ምዕራፍ ${previousChapter.number}` : `← Chapter ${previousChapter.number}`}
                </Link>
              ) : null}
              {nextChapter ? (
                <NextChapterButton
                  nextChapterSlug={nextChapter.slug}
                  nextChapterNumber={nextChapter.number}
                  currentChapterNumber={chapter.number}
                  currentChapterSlug={chapter.slug}
                  variant="top"
                />
              ) : null}
            </div>
          </div>
        </section>
        )}

        {chapter.slug === "keys-and-transactions" ? <KeysChapterHeroQuote /> : null}
        {chapter.slug === "blockchain-basics" ? <BlockchainBasicsHeroQuote /> : null}

        {!isWrapUpResources ? (
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-950 p-3.5 sm:p-6 shadow-inner w-full min-w-0">
          <h2 className="text-base font-semibold text-zinc-100 sm:text-lg">
            {isTi ? "እንታይ ክትመሃር ኢኻ።" : "What You Will Learn"}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-200">
            {(localizedChapter?.learnPoints ?? chapter.learn).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        ) : null}

        {isWrapUpResources ? (
        <WrapUpResourcesContent isTi={isTi} />
        ) : (
        <section className="relative space-y-4 rounded-xl border border-zinc-800/50 bg-zinc-950 p-3 sm:p-6 shadow-inner w-full min-w-0 overflow-hidden">
          <ChapterTechVectors />
          <h2 className="relative text-base font-semibold text-zinc-100 sm:text-lg">
            {isTi ? "ቀንዲ ትሕዝቶ ትምህርቲ" : "Main Lesson Content"}
          </h2>
          <div className="relative space-y-5">
            {hasTigrinyaMarkdown ? (
              activeTigrinyaLesson ? (
                <>
                  <TigrinyaChapterLesson
                    content={activeTigrinyaLesson.content}
                    chapter={chapter}
                  />
                </>
              ) : translationError ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100" role="alert">
                  <p>
                    {isTi
                      ? "እዚ ትርጉም ክጽዕን ኣይከኣለን።"
                      : "The translation could not be loaded."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTranslationRequest((request) => request + 1)}
                    className="mt-3 rounded-md border border-red-300/40 px-3 py-1.5 font-semibold hover:bg-red-400/10"
                  >
                    {isTi ? "እንደገና ፈትን" : "Try again"}
                  </button>
                </div>
              ) : (
                <p className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300" role="status">
                  {isTi ? "ትርጉም ይጽዕን ኣሎ..." : "Loading translation..."}
                </p>
              )
            ) : chapter.sections.map((section, sectionIdx) => {
              const sectionId = `section-${sectionIdx}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              const comparisonSection = chapter.slug === "the-birth-of-bitcoin" && (section.heading === "What Are Sats?" || section.heading === "ሳት እንታይ እዮም?") ? (
                <ChapterSectionAnimated key="bitcoin-gold-fiat-comparison" sectionId="section-bitcoin-gold-fiat-comparison" sectionIdx={chapter.sections.length}>
                  <div id="section-bitcoin-gold-fiat-comparison" className="chapter-section-inner scroll-mt-20 rounded-lg border border-zinc-800/60 bg-zinc-950 p-3.5 sm:p-5 shadow-inner transition-shadow duration-300 w-full min-w-0 overflow-hidden">
                    <h3 className="text-lg font-bold text-zinc-100 sm:text-xl mb-3 pb-2 border-b border-zinc-800/50">
                      {isTi ? "ምውድዳር ቢትኮይን ኣንጻር ወርቂ ኣንጻር ፊያት/ገንዘብ" : "Bitcoin vs Gold vs Fiat/Cash Comparison"}
                    </h3>
                    <div className="space-y-4 text-zinc-200 leading-relaxed">
                      <p>
                        {isTi
                          ? "ወርቅን ፊያት ባጤራን ኣብ ታሪኽ ገንዘብ ክልተ ዓበይቲ መድረኻት ይውክሉ። ወርቂ ብሰንኪ ተፈጥሮኣዊ ዋሕዲን ጽንዓትን ተቐባልነት ረኺቡ፣ ንኣሽሓት ዓመታት ዘተኣማምን መኽዘን ዋጋ ኮይኑ። ድሒሩ ፊያት ባጤራታት ኣብ ብዙሓት ሃገራት ብወርቂ ዝድገፍ ስርዓታት ብምትካእ መንግስታትን ማእከላይ ባንክታትን ገንዘብ ብዝያዳ ተዓጻጻፊ መንገዲ ከውጽኡን ከመሓድሩን ኣኽኢልዎም። እዚ ድማ ዘመናዊ ቁጠባታት ብቐሊሉ ንኽሰርሓ ዝገብሮ እኳ እንተኾነ፡ ነቲ ኣብ ሓደ እዋን ክቡር ሓጺናት ዝገብርዎ ዝነበሩ ተፈጥሮኣዊ ገደብ ቀረብ እውን ኣወጊድዎ።"
                          : "Gold and fiat currencies represent two major stages in the history of money. Gold gained acceptance because of its natural scarcity and durability, making it a reliable store of value for thousands of years. Fiat currencies later replaced gold-backed systems in many countries, allowing governments and central banks to issue and manage money more flexibly. While this made modern economies easier to operate, it also removed the natural supply limits that precious metals once imposed."}
                      </p>
                      <p>
                        {isTi
                          ? "ቢትኮይን ዲጂታላዊ ቴክኖሎጂ ምስ ፕሮግራም ዝተገብረሉ ሕጽረት ብምውህሃድ ዝተፈለየ ሞዴል የተኣታቱ። ዘይከምቲ ኣብ ኣካላዊ ዕደና ዝምርኮስ ወርቂን ብማእከላይ ሰበስልጣን ክሰፍሕ ዝኽእል ፊያት ባጤራታትን፡ ቢትኮይን በቲ ፕሮቶኮል ዝትግበር 21 ሚልዮን ሳንቲም ቀዋሚ ቀረብ ኣለዎ። እዚ ዲዛይን እዚ ነቲ ወርቂ ክቡር ዝገበሮ ዋሕዲ ንምዕቃብ ዝፍትን ኮይኑ፡ ብሙሉእ ዲጂታላዊ መርበብ ኣቢሉ ተንቀሳቓስን ምክፍፋልን ንምምሕያሽ ዝዓለመ እዩ።"
                          : "Bitcoin introduces a different model by combining digital technology with programmed scarcity. Unlike gold, which depends on physical mining, and fiat currencies, which can be expanded by central authorities, Bitcoin has a fixed supply of 21 million coins enforced by the protocol. This design attempts to preserve the scarcity that made gold valuable while improving portability and divisibility through a fully digital network."}
                      </p>
                    </div>
                    <div className="mt-6 overflow-x-auto rounded-lg border border-cyan-400/25 bg-zinc-950/70">
                      <table className="w-full min-w-[640px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-cyan-400/30 bg-cyan-500/10">
                            <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">{isTi ? "ብቅዓት" : "Quality"}</th>
                            <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">{isTi ? "ቢትኮይን" : "Bitcoin"}</th>
                            <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">{isTi ? "ወርቂ" : "Gold"}</th>
                            <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">{isTi ? "ፊያት / ጥረ ገንዘብ" : "Fiat / Cash"}</th>
                          </tr>
                        </thead>
                        <tbody className="text-zinc-300">
                          <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">{isTi ? "ዋሕዲ" : "Scarcity"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "21 ሚልዮን ሳንቲም (ቀዋሚ ቀረብ)" : "21 Million coins (fixed Supply)"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ውሱን ግን ከኣ ሓድሽ ወርቂ ይርከብ።" : "Limited but new gold found"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ደረት ኣልቦ ቀረብ፡ ማእከላይ ባንክታት ዝያዳ ክሕትማ ይኽእላ እየን።" : "Unlimited supply, central banks can print more"}</td>
                          </tr>
                          <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">{isTi ? "ተንቀሳቓሲነት" : "Portability"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ዲጂታላዊ፡ ብተሌፎን ትጥቀመሉ" : "Digital, accessible on phone"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ከቢድ፡ ኣካላዊ ንብረት" : "Heavy, physical asset"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ኣካላዊ ሕሳብ/ሳንቲም ብብዝሒ ዶባት ንምንቅስቓስ ዝኸበደ እዩ" : "Physical bills/coins are harder to move large amounts across borders"}</td>
                          </tr>
                          <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">{isTi ? "ጽንዓት" : "Durability"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ዲጂታል፣ ምብስባስ ወይ ምቅዳድ የለን" : "Digital, no wear or tear"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ኣካላዊ ምስ ግዜ ክወርድ ይኽእል እዩ" : "Physical can degrade over time"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ኣካላዊ ጥረ ገንዘብ ክጉዳእ፡ ክጠፍእ ወይ ክዓኑን ይኽእል።" : "Physical cash can get damaged, lost, or destroyed"}</td>
                          </tr>
                          <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">{isTi ? "ምክፍፋል" : "Divisibility"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ደቀቅቲ ምስግጋራት ይከኣል እዩ።" : "Fractional transactions possible"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ብዘይ ክሳራ ክትመቓቐል ከቢድ እዩ" : "Hard to divide without loss"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ውሱን ምክፍፋል (መብዛሕትኡ ግዜ ናብ ሳንቲም)" : "Limited divisibility (usually to cents)"}</td>
                          </tr>
                          <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">{isTi ? "ተቐባልነት" : "Acceptance"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ብዓለም ደረጃ ብፍላይ ኣብ ኣፍሪቃ እናዓበየ ይኸይድ ኣሎ" : "Growing globally, especially in Africa"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ብታሪኽ ኣብ መላእ ዓለም ተቐባልነት ዘለዎ" : "Accepted worldwide historically"}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">{isTi ? "ብመንግስታትን ትካላት ንግድን ሰባትን ብዓለምለኻዊ ደረጃ ተቐባልነት ዘለዎ" : "Universally accepted by governments, businesses, and people"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ChapterSectionAnimated>
              ) : null;
              return (
              <React.Fragment key={section.heading}>
                {comparisonSection}
              <ChapterSectionAnimated sectionId={sectionId} sectionIdx={sectionIdx}>
              <div id={sectionId} className="chapter-section-inner scroll-mt-20 rounded-lg border border-zinc-800/60 bg-zinc-950 p-3.5 sm:p-5 shadow-inner transition-shadow duration-300 w-full min-w-0 overflow-hidden">
                <h3 className="text-lg font-bold text-zinc-100 sm:text-xl mb-3 pb-2 border-b border-zinc-800/50">
                  {section.heading}
                </h3>
                {section.heading.startsWith("1.2") ? (
                  <div className="space-y-4">
                    <p className="mt-3 text-zinc-200 leading-relaxed">{section.paragraphs?.[0]}</p>
                    <div>
                      {(() => {
                        const p1 = section.paragraphs?.[1] ?? "";
                        const [head1, body1] = p1.includes("\n\n") ? [p1.split("\n\n")[0], p1.split("\n\n").slice(1).join("\n\n")] : [p1, ""];
                        return (
                          <>
                            <h4 className="mt-5 mb-2 text-base font-bold text-cyan-200 sm:text-lg border-b border-cyan-400/30 pb-1.5">{head1}</h4>
                            {body1 ? <p className="mt-1 text-zinc-200 leading-relaxed">{body1}</p> : null}
                          </>
                        );
                      })()}
                      <div className="mt-4 rounded-lg border border-orange-900/50 p-4 bg-zinc-900/80 text-orange-100">
                        <span className="font-semibold">{isTi ? "📖 ኣብነት:" : "📖 Example:"}</span>
                        <span className="ml-2">{section.callouts?.[0]?.content}</span>
                      </div>
                      <div className="mt-4 flex min-h-[120px] items-center justify-center rounded-lg bg-zinc-900/30">
                        {section.images?.[0]?.src ? (
                          <ZoomableImage src={section.images[0].src} alt={section.images[0].alt} caption={section.images[0].caption} className="rounded-lg shadow-cyan-900/20" thumbnailClassName="max-h-96" />
                        ) : (
                          <span className="rounded-lg border border-dashed border-zinc-600 bg-zinc-900/50 px-8 py-6 text-sm font-medium text-zinc-500">1st image here</span>
                        )}
                      </div>
                    </div>
                    <div>
                      {(() => {
                        const p3 = section.paragraphs?.[3] ?? "";
                        const [head3, body3] = p3.includes("\n\n") ? [p3.split("\n\n")[0], p3.split("\n\n").slice(1).join("\n\n")] : [p3, ""];
                        return (
                          <>
                            <h4 className="mt-5 mb-2 text-base font-bold text-cyan-200 sm:text-lg border-b border-cyan-400/30 pb-1.5">{head3}</h4>
                            {body3 ? <p className="mt-1 text-zinc-200 leading-relaxed">{body3}</p> : null}
                          </>
                        );
                      })()}
                      <div className="mt-4 flex min-h-[120px] items-center justify-center rounded-lg bg-zinc-900/30">
                        {section.images?.[1]?.src ? (
                          <ZoomableImage src={section.images[1].src} alt={section.images[1].alt} caption={section.images[1].caption} className="rounded-lg shadow-cyan-900/20" thumbnailClassName="max-h-96" />
                        ) : (
                          <span className="rounded-lg border border-dashed border-zinc-600 bg-zinc-900/50 px-8 py-6 text-sm font-medium text-zinc-500">2nd image here</span>
                        )}
                      </div>
                    </div>
                    <div>
                      {(() => {
                        const p4 = section.paragraphs?.[4] ?? "";
                        const [head4, body4] = p4.includes("\n\n") ? [p4.split("\n\n")[0], p4.split("\n\n").slice(1).join("\n\n")] : [p4, ""];
                        return (
                          <>
                            <h4 className="mt-5 mb-2 text-base font-bold text-cyan-200 sm:text-lg border-b border-cyan-400/30 pb-1.5">{head4}</h4>
                            {body4 ? <p className="mt-1 text-zinc-200 leading-relaxed">{body4}</p> : null}
                          </>
                        );
                      })()}
                      <div className="mt-4 flex min-h-[120px] items-center justify-center rounded-lg bg-zinc-900/30">
                        {section.images?.[2]?.src ? (
                          <ZoomableImage src={section.images[2].src} alt={section.images[2].alt} caption={section.images[2].caption} className="rounded-lg shadow-cyan-900/20" thumbnailClassName="max-h-96" />
                        ) : (
                          <span className="rounded-lg border border-dashed border-zinc-600 bg-zinc-900/50 px-8 py-6 text-sm font-medium text-zinc-500">Unit of Account image</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-zinc-200 leading-relaxed">{section.paragraphs?.[5]}</p>
                  </div>
                ) : null}
                {!section.heading.startsWith("1.2") && section.paragraphs?.map((p, pIdx) => {
                  // Check if this paragraph is a subsection heading (exact match)
                                    const isSubHeading = p === "Decentralization Explained" || 
                                       p === "Transparency Without Identity" || 
                                       p === "Scarcity" ||
                                       p === "ዘይማእከላዊ ምሕደራ ክግለጽ" ||
                                       p === "ግሉጽነት ብዘይ መንነት" ||
                                       p === "ዋሕዲ";
                  
                  if (isSubHeading) {
                    return (
                      <h4 key={p} className="mt-6 mb-3 text-base font-bold text-cyan-200 sm:text-lg border-b border-cyan-400/30 pb-1.5">
                        {p}
                      </h4>
                    );
                  }
                  
                  // After full "Decentralization Explained" block (before "Transparency Without Identity"), show dec.jpeg
                  const decImg = section.images?.[0];
                  const isAfterDecentralization = section.heading === "5.3 Bitcoin as Peer-to-Peer Electronic Cash"
                    && pIdx === 10
                    && decImg?.src?.includes("dec.jpeg");
                  if (isAfterDecentralization && decImg) {
                    return (
                      <div key={`${p}-${pIdx}-dec`}>
                        <p className="mt-3 text-zinc-200 leading-relaxed">{p}</p>
                        <div className="mt-4 flex flex-col items-center">
                          <ZoomableImage
                            src={decImg.src}
                            alt={decImg.alt}
                            caption={decImg.caption}
                            className="w-full max-w-xl rounded-lg"
                          />
                          {decImg.caption && (
                            <p className="mt-2 text-center text-sm text-cyan-200/90 italic">{decImg.caption}</p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  // Numbered topic style: "1. Topic Name\n\nBody..." → render as small bold header + body
                  const hasNumberedTopic = /^\d+\.\s+[\s\S]+\n\n/.test(p);
                  if (hasNumberedTopic) {
                    const [topicLine, ...bodyParts] = p.split("\n\n");
                    const body = bodyParts.join("\n\n").trim();
                    return (
                      <div key={`${p}-${pIdx}`}>
                        <h4 className="mt-6 mb-2 text-base font-bold text-cyan-200 sm:text-lg border-b border-cyan-400/30 pb-1.5">
                          {topicLine}
                        </h4>
                        {body ? <p className="mt-2 text-zinc-200 leading-relaxed">{body}</p> : null}
                      </div>
                    );
                  }
                  
                  return (
                    <p key={`${p}-${pIdx}`} className="mt-3 text-zinc-200 leading-relaxed">
                      {p}
                    </p>
                  );
                })}
                {section.heading === "What Are Sats?" || section.heading === "ሳት እንታይ እዮም?" ? (
                  // Special rendering for sats conversion table and converter
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="mb-4 text-base font-semibold text-cyan-200">{isTi ? "Sats → BTC ምቕያር ኣብነታት" : "Sats → BTC Conversion Examples"}</h4>
                      <div className="overflow-x-auto rounded-lg border border-cyan-400/25 bg-zinc-950/70">
                        <table className="w-full min-w-[680px] border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-cyan-400/30 bg-cyan-500/10">
                              <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">{isTi ? "ሳትስ (Sats)" : "Sats"}</th>
                              <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">BTC</th>
                            </tr>
                          </thead>
                          <tbody className="text-zinc-300">
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">1 sat</td>
                              <td className="px-4 py-3 font-mono">0.00000001 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">10 sats</td>
                              <td className="px-4 py-3 font-mono">0.00000010 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">100 sats</td>
                              <td className="px-4 py-3 font-mono">0.00000100 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">1,000 sats</td>
                              <td className="px-4 py-3 font-mono">0.00001000 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">10,000 sats</td>
                              <td className="px-4 py-3 font-mono">0.00010000 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">100,000 sats</td>
                              <td className="px-4 py-3 font-mono">0.00100000 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">1,000,000 sats</td>
                              <td className="px-4 py-3 font-mono">0.01000000 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">10,000,000 sats</td>
                              <td className="px-4 py-3 font-mono">0.10000000 BTC</td>
                            </tr>
                            <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                              <td className="px-4 py-3 font-mono">100,000,000 sats</td>
                              <td className="px-4 py-3 font-mono">1.00000000 BTC</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Interactive Converter */}
                    <BtcSatsConverter />
                  </div>
                ) : null}
                {section.seedPhrase && section.seedPhrase.length > 0 ? (
                  <SeedPhraseGrid words={section.seedPhrase} columns={4} />
                ) : null}
                {section.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-200 leading-relaxed">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                {!section.heading.startsWith("1.2") && section.callouts?.map((callout, idx) => {
                  // Skip example callout for section 3.1 - it will be rendered after images
                  if ((section.heading === "3.1 Inflation and Loss of Purchasing Power" || section.heading.startsWith("3.1")) && callout.type === "example") {
                    return null;
                  }
                  return (
                  <div
                    key={idx}
                    className={`mt-4 rounded-lg border p-4 bg-zinc-900/80 ${
                      callout.type === "note"
                        ? "border-cyan-900/50 text-cyan-100"
                        : callout.type === "tip"
                        ? "border-green-900/50 text-green-100"
                        : callout.type === "warning"
                        ? "border-red-900/50 text-red-100"
                        : "border-orange-900/50 text-orange-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">
                        {callout.type === "note"
                          ? (isTi ? "📝 መተሓሳሰቢ፤" : "📝 Note:")
                          : callout.type === "tip"
                          ? (isTi ? "💡 ምኽሪ፤" : "💡 Tip:")
                          : callout.type === "warning"
                          ? (isTi ? "⚠️ መጠንቀቕታ፤" : "⚠️ Warning:")
                          : (isTi ? "📖 ኣብነት፤" : "📖 Example:")}
                      </span>
                      <div className="flex-1 text-sm">
                        {(() => {
                          const parts: React.ReactNode[] = [];
                          const content = callout.content;
                          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                          let lastIndex = 0;
                          let match;
                          let key = 0;

                          while ((match = linkRegex.exec(content)) !== null) {
                            // Add text before the link
                            if (match.index > lastIndex) {
                              parts.push(<span key={key++}>{content.substring(lastIndex, match.index)}</span>);
                            }
                            // Add the link
                            const [, linkText, linkUrl] = match;
                            parts.push(
                              <a
                                key={key++}
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-300 underline hover:text-cyan-200"
                              >
                                {linkText}
                              </a>
                            );
                            lastIndex = linkRegex.lastIndex;
                          }
                          // Add remaining text after last link
                          if (lastIndex < content.length) {
                            parts.push(<span key={key++}>{content.substring(lastIndex)}</span>);
                          }
                          return parts.length > 0 ? parts : <span>{content}</span>;
                        })()}
                      </div>
                    </div>
                    </div>
                  );
                })}
                {(section.heading === "7.0 What Is a Block?" || section.heading.startsWith("7.0")) ? (
                  // Special rendering for live blockchain data
                  <div className="mt-6">
                    <LiveBlockchainData />
                  </div>
                ) : (section.heading === "6.1 Public/Private Keys Explained Simply" || section.heading.startsWith("6.1")) ? (
                  // Special rendering for public/private key examples
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Public Key Example */}
                      <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-5">
                        <h4 className="text-base font-semibold text-cyan-200 mb-3">{isTi ? "ህዝባዊ ቁልፊ ኣብነት" : "Public Key Example"}</h4>
                        <p className="text-xs text-cyan-300 mb-3">{isTi ? "ካልኦት ቢትኮይን ክሰዱልካ ዝጥቀሙሉ እዚ እዩ።" : "This is what others use to send you Bitcoin"}</p>
                        <div className="bg-zinc-900 rounded-lg p-4 border border-cyan-400/20">
                          <p className="text-xs text-cyan-100 font-mono break-all">
                            02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5fb
                          </p>
                        </div>
                        <p className="text-xs text-cyan-400 mt-2 italic">{isTi ? "ወይ ድማ ከም ኣድራሻ ቢትኮይን፤" : "Or as a Bitcoin address:"}</p>
                        <div className="bg-zinc-900 rounded-lg p-4 border border-cyan-400/20 mt-2">
                          <p className="text-xs text-cyan-100 font-mono break-all">
                            1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                          </p>
                        </div>
                      </div>
                      {/* Private Key Example */}
                      <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 p-5">
                        <h4 className="text-base font-semibold text-orange-200 mb-3">{isTi ? "ናይ ብሕቲ ቁልፊ ኣብነት" : "Private Key Example"}</h4>
                        <p className="text-xs text-orange-300 mb-3">{isTi ? "ነዚ ምስጢርን ውሑስን ሓልዎ - ፈጺምካ ሼር ግበርዎ!" : "Keep this secret and secure - never share it!"}</p>
                        <div className="bg-zinc-900 rounded-lg p-4 border border-orange-400/20">
                          <p className="text-xs text-orange-100 font-mono break-all">
                            L5EZftvrYaSudiozVRzTqLcHLNDoVn7H5HSfM9BAN6tMJX8oTWz6
                          </p>
                        </div>
                        <p className="text-xs text-orange-400 mt-2 italic">{isTi ? "ወይ ድማ ብመልክዕ ሄክስ፤" : "Or in hex format:"}</p>
                        <div className="bg-zinc-900 rounded-lg p-4 border border-orange-400/20 mt-2">
                          <p className="text-xs text-orange-100 font-mono break-all">
                            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Lightning Invoice Example */}
                    <div className="rounded-lg border border-purple-400/30 bg-purple-500/10 p-5">
                      <h4 className="text-base font-semibold text-purple-200 mb-3">{isTi ? "ላይትኒንግ መርበብ ፋክቱር ኣብነት" : "Lightning Network Invoice Example"}</h4>
                      <p className="text-xs text-purple-300 mb-3">{isTi ? "ፋክቱር ላይትኒንግ ኣብ መርበብ ላይትኒንግ ንዝግበር ቅልጡፍን ትሑት ክፍሊትን ትራንዛክሽን ቢትኮይን ናይ ክፍሊት ሕቶ እዩ።" : "A Lightning invoice is a payment request for fast, low-fee Bitcoin transactions on the Lightning Network"}</p>
                      <div className="bg-zinc-900 rounded-lg p-4 border border-purple-400/20">
                        <p className="text-xs text-purple-100 font-mono break-all">
                          lnbc20u1p5cpmx0dqqpp5d5mzfqk3kjv46ujecwtkr0337gm7nlw43n69rlyd0uvlg8tx0sxqsp56wh3phhm0vkpxxtyhxt6u3fm0pfec5nvqy8qz4vp9y5lp0jz033s9qrsgqcqpjnp4q0plte0wjhr4t478uwp02wvl2gra39jamke83jfh8506kjd0dg0gyxqyz5vqrzjqt07ejxdllcugwyqydh5j3m3wgxlqew3ywmfgljfv0u99ssumtxuzqqqqqqqqqqqqgqqqqqqqqqqqqqqrcftdaunftydx463n9chlj6j3dd3hp570hz725nd773hmna2cq9q655djym8ph86wyvdqeta37p5lycaksk9xsfgs3rlnezwx7m8tfsqqq9a2mfy
                        </p>
                      </div>
                      <p className="text-xs text-purple-400 mt-2 italic">{isTi ? "ላይትኒንግ ፋክቱራት ቅጽበታዊ፡ ትሑት ወጻኢታት ዘለዎ ክፍሊት ዘኽእል ኮይኑ፡ ንመዓልታዊ ትራንዛክሽን ቢትኮይን ዝውዕል እዩ።" : "Lightning invoices enable instant, low-cost payments and are used for everyday Bitcoin transactions"}</p>
                    </div>
                  </div>
                ) : section.heading === "7.4 Why Blockchain Matters" ? (
                  // Special rendering for blockchain demo link
                  <div className="mt-6">
                    <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-6">
                      <h4 className="mb-3 text-base font-semibold text-cyan-200">Interactive Blockchain Demo</h4>
                      <p className="mb-4 text-sm text-zinc-300">
                        Explore how blocks, hashes, and blockchain work together in this interactive demonstration. 
                        You can experiment with creating blocks, changing data, and seeing how the hash changes.
                      </p>
                      <a
                        href="https://andersbrownworth.com/blockchain"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-orange-500 px-6 py-3 font-semibold text-black transition hover:brightness-110"
                      >
                        <span>🔗 Try Blockchain Demo</span>
                        <span className="text-sm">→</span>
                      </a>
                      <p className="mt-3 text-xs text-zinc-400">
                        This demo covers: Hash functions, Block structure, Blockchain linking, and Distributed consensus
                      </p>
                    </div>
                  </div>
                ) : (section.heading.startsWith("13.2") || section.heading === "13.2 Halving Schedule and Fixed Supply (Declining Inflation)") ? (
                  // Special rendering for halving periods table
                  <div className="mt-6">
                    <div className="overflow-x-auto rounded-lg border border-purple-400/25 bg-zinc-950/70">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-purple-400/30 bg-purple-500/10">
                            <th className="px-4 py-3 text-left font-semibold text-purple-200">{isTi ? "ናይ ግዜ ምጅማር ዕለት" : "Period Start Date"}</th>
                            <th className="px-4 py-3 text-left font-semibold text-purple-200">{isTi ? "ናይ ግዜ መወዳእታ ዕለት" : "Period End Date"}</th>
                            <th className="px-4 py-3 text-left font-semibold text-purple-200">{isTi ? "ብሎክ ቁመት ደረጃ" : "Block Height Range"}</th>
                            <th className="px-4 py-3 text-left font-semibold text-purple-200">{isTi ? "ክፍሊት ንሓደ ብሎክ (BTC)" : "Subsidy per Block (BTC)"}</th>
                            <th className="px-4 py-3 text-left font-semibold text-purple-200">{isTi ? "BTC ኣብ Period ዝተፈጥረ" : "BTC Created in Period"}</th>
                            <th className="px-4 py-3 text-left font-semibold text-purple-200">{isTi ? "ጠቕላላ BTC ኣብ መወዳእታ ዝወጸ" : "Total BTC Issued at End"}</th>
                          </tr>
                        </thead>
                        <tbody className="text-zinc-300">
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2009-01-03</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2012-11-28</td>
                            <td className="px-4 py-3 font-mono text-xs">0 – 209,999</td>
                            <td className="px-4 py-3 font-mono">50.00000000</td>
                            <td className="px-4 py-3 font-mono">10,500,000.00000000</td>
                            <td className="px-4 py-3 font-mono">10,500,000.00000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2012-11-28</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2016-07-09</td>
                            <td className="px-4 py-3 font-mono text-xs">210,000 – 419,999</td>
                            <td className="px-4 py-3 font-mono">25.00000000</td>
                            <td className="px-4 py-3 font-mono">5,250,000.00000000</td>
                            <td className="px-4 py-3 font-mono">15,750,000.00000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2016-07-09</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2020-05-11</td>
                            <td className="px-4 py-3 font-mono text-xs">420,000 – 629,999</td>
                            <td className="px-4 py-3 font-mono">12.50000000</td>
                            <td className="px-4 py-3 font-mono">2,625,000.00000000</td>
                            <td className="px-4 py-3 font-mono">18,375,000.00000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2020-05-11</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2024-04-20</td>
                            <td className="px-4 py-3 font-mono text-xs">630,000 – 839,999</td>
                            <td className="px-4 py-3 font-mono">6.25000000</td>
                            <td className="px-4 py-3 font-mono">1,312,500.00000000</td>
                            <td className="px-4 py-3 font-mono">19,687,500.00000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">2024-04-20</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2028-03</td>
                            <td className="px-4 py-3 font-mono text-xs">840,000 – 1,049,999</td>
                            <td className="px-4 py-3 font-mono">3.12500000</td>
                            <td className="px-4 py-3 font-mono">656,250.00000000</td>
                            <td className="px-4 py-3 font-mono">20,343,750.00000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2028-03</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2032-02</td>
                            <td className="px-4 py-3 font-mono text-xs">1,050,000 – 1,259,999</td>
                            <td className="px-4 py-3 font-mono">1.56250000</td>
                            <td className="px-4 py-3 font-mono">328,125.00000000</td>
                            <td className="px-4 py-3 font-mono">20,671,875.00000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2032-02</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2036-01</td>
                            <td className="px-4 py-3 font-mono text-xs">1,260,000 – 1,469,999</td>
                            <td className="px-4 py-3 font-mono">0.78125000</td>
                            <td className="px-4 py-3 font-mono">164,062.50000000</td>
                            <td className="px-4 py-3 font-mono">20,835,937.50000000</td>
                          </tr>
                          <tr className="border-b border-purple-400/10 hover:bg-purple-500/5">
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2036-01</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3">~2040-01</td>
                            <td className="px-4 py-3 font-mono text-xs">1,470,000 – 1,679,999</td>
                            <td className="px-4 py-3 font-mono">0.39062500</td>
                            <td className="px-4 py-3 font-mono">82,031.25000000</td>
                            <td className="px-4 py-3 font-mono">20,917,968.75000000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400 italic">
                      {isTi ? "(እቲ ክፍሊት ኣብ ከባቢ ዓመት 2140 0 ሳቶሺ ክሳብ ዝበጽሕ ብተመሳሳሊ ናይ ፍርቂ ምጉዳል ስነ-መጎት ምውጻእ ይቕጽል።)" : "(Issuance continues with the same halving logic until the subsidy reaches 0 satoshis around the year 2140.)"}
                    </p>
                    <div className="mt-4 rounded-lg border border-orange-400/30 bg-orange-500/10 p-4">
                      <h4 className="mb-2 text-sm font-semibold text-orange-200">{isTi ? "መጠንቀቕታ፡ ኣገደስቲ መተሓሳሰቢታት" : "Warning: Important Precision Notes"}</h4>
                      <div className="space-y-2 text-sm text-orange-100">
                        <p>{isTi ? "ብሎኮታት ንቐረብ እምበር ዕለታት ኣይገልጹን።" : "Blocks define supply, not dates."}</p>
                        <p>{isTi ? "ዕለታት ትዕዝብቲ እዩ። መስርዕ ብሎክ ሕጊ እዩ።" : "Dates are an observation. Block height is the law."}</p>
                        <p>{isTi ? "ኩሉ ኣብ ላዕሊ ዘሎ ቁጽሪ ብምባዛሕ ክረጋገጽ ይከኣል፡ ብሎኮታት ኣብ ፒሪድ × ክፍሊት ኣብ ሓደ ብሎክ = ኣብ ፒሪድ ዝተፈጥረ BTC።" : "Every number above can be verified by multiplying: blocks in period × subsidy per block = BTC created in period."}</p>
                      </div>
                    </div>
                  </div>
                ) : !section.heading.startsWith("1.2") && section.images && section.images.length > 0 && (
                  (section.heading === "Introduction" || section.heading === "መእተዊ") && section.images.length === 5 ? (
                    <ol className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {section.images.map((image, idx) => (
                        <li
                          key={image.src}
                          className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
                        >
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-300">
                            {isTi ? `ደረጃ ${idx + 1}` : `Step ${idx + 1}`}
                          </p>
                          <ZoomableImage
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="rounded-lg"
                            thumbnailClassName="aspect-[4/3] w-full"
                          />
                        </li>
                      ))}
                    </ol>
                  ) : (
                    // Default layout for other sections
                    section.heading.startsWith("1.3") && section.images.length > 1 ? (
                      <div className="mt-6 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {section.images.map((image, idx) => (
                          <ZoomableImage
                            key={idx}
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="w-full rounded-lg shadow-lg"
                          />
                        ))}
                        </div>
                        <div>
                          <h4 className="mb-4 text-base font-semibold text-cyan-200">
                            {isTi
                              ? "ምውድዳር ብቅዓት ፡ ቢትኮይን ኣንጻር ወርቂ ኣንጻር ፊያት / ጥረ ገንዘብ"
                              : "Quality comparison: Bitcoin vs Gold vs Fiat / Cash"}
                          </h4>
                          <div className="overflow-x-auto rounded-lg border border-cyan-400/25 bg-zinc-950/70">
                            <table className="w-full min-w-[480px] border-collapse text-sm">
                              <thead>
                                <tr className="border-b border-cyan-400/30 bg-cyan-500/10">
                                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">
                                    {isTi ? "ብቅዓት" : "Quality"}
                                  </th>
                                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">
                                    {isTi ? "ቢትኮይን" : "Bitcoin"}
                                  </th>
                                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">
                                    {isTi ? "ወርቂ" : "Gold"}
                                  </th>
                                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-left font-semibold text-cyan-200">
                                    {isTi ? "ፊያት / ጥረ ገንዘብ" : "Fiat / Cash"}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-zinc-300">
                                <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">
                                    {isTi ? "ምርግጋጽ" : "Verifiability"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ትራንዛክሽን ኣብቲ ብሎክቸይን ብህዝቢ ክረጋገጽ ይከኣል"
                                      : "Transactions publicly verifiable on blockchain"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ኣካላዊ መርመራ የድሊ"
                                      : "Requires physical testing"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ኣብ ባንክታትን ፋይናንሳዊ ትካላትን ይምርኮስ"
                                      : "Depends on banks and financial institutions"}
                                  </td>
                                </tr>
                                <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">
                                    {isTi ? "ዋሕዲ" : "Scarcity"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "21 ሚልዮን ሳንቲም (ቀዋሚ ቀረብ)"
                                      : "21 Million coins (fixed Supply)"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ውሱን ግን ከኣ ሓድሽ ወርቂ ይርከብ።"
                                      : "Limited but new gold found"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ደረት ኣልቦ ቀረብ፡ ማእከላይ ባንክታት ዝያዳ ክሕትማ ይኽእላ እየን።"
                                      : "Unlimited supply, central banks can print more"}
                                  </td>
                                </tr>
                                <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">
                                    {isTi ? "ተንቀሳቓሲነት" : "Portability"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ዲጂታላዊ፡ ብተሌፎን ትጥቀመሉ"
                                      : "Digital, accessible on phone"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ከቢድ፡ ኣካላዊ ንብረት"
                                      : "Heavy, physical asset"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ኣካላዊ ሕሳብ/ሳንቲም ብብዝሒ ዶባት ንምንቅስቓስ ዝኸበደ እዩ"
                                      : "Physical bills/coins are harder to move large amounts across borders"}
                                  </td>
                                </tr>
                                <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">
                                    {isTi ? "ጽንዓት" : "Durability"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ዲጂታል፣ ምብስባስ ወይ ምቅዳድ የለን"
                                      : "Digital, no wear or tear"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ኣካላዊ ምስ ግዜ ክወርድ ይኽእል እዩ"
                                      : "Physical can degrade over time"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ኣካላዊ ጥረ ገንዘብ ክጉዳእ፡ ክጠፍእ ወይ ክዓኑን ይኽእል።"
                                      : "Physical cash can get damaged, lost, or destroyed"}
                                  </td>
                                </tr>
                                <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">
                                    {isTi ? "ምክፍፋል" : "Divisibility"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ደቀቅቲ ምስግጋራት ይከኣል እዩ።"
                                      : "Fractional transactions possible"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ብዘይ ክሳራ ክትመቓቐል ከቢድ እዩ"
                                      : "Hard to divide without loss"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ውሱን ምክፍፋል (መብዛሕትኡ ግዜ ናብ ሳንቲም)"
                                      : "Limited divisibility (usually to cents)"}
                                  </td>
                                </tr>
                                <tr className="border-b border-cyan-400/10 hover:bg-cyan-500/5">
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-cyan-200">
                                    {isTi ? "ተቐባልነት" : "Acceptance"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ብዓለም ደረጃ ብፍላይ ኣብ ኣፍሪቃ እናዓበየ ይኸይድ ኣሎ"
                                      : "Growing globally, especially in Africa"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ብታሪኽ ኣብ መላእ ዓለም ተቐባልነት ዘለዎ"
                                      : "Accepted worldwide historically"}
                                  </td>
                                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                    {isTi
                                      ? "ብመንግስታትን ትካላት ንግድን ሰባትን ብዓለምለኻዊ ደረጃ ተቐባልነት ዘለዎ"
                                      : "Universally accepted by governments, businesses, and people"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (section.heading === "3.1 Inflation and Loss of Purchasing Power" || section.heading.startsWith("3.1")) && section.images.length >= 4 ? (
                      // Special layout: first 3 images (animals, arrow, animals) in a row, then the 4th image below, then Zimbabwe images side by side
                      <div className="mt-6 space-y-5">
                        <div className="flex flex-col items-center mb-3">
                          <p className="text-base font-semibold text-orange-200">{isTi ? "ቅድሚ 20 ዓመት: 40,000 UGX → ሕጂ: 4,000,000 UGX" : "20 Years ago: 40,000 UGX → Now: 4,000,000 UGX"}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                          {section.images.slice(0, 3).map((image, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              {idx === 0 && (
                                <p className="mb-1 text-xs font-semibold text-orange-200">{isTi ? "ቅድሚ 20 ዓመት" : "20 Years ago"}</p>
                              )}
                              {idx === 2 && (
                                <p className="mb-1 text-xs font-semibold text-orange-200">{isTi ? "ሕጂ" : "Now"}</p>
                              )}
                              <ZoomableImage
                                src={image.src}
                                alt={image.alt}
                                caption={image.caption}
                                className={`rounded-lg shadow-lg ${image.src.includes('arrow') ? 'w-20 h-10 sm:w-24 sm:h-12 object-contain' : 'w-28 sm:w-36'}`}
                                thumbnailClassName={image.src.includes('arrow') ? 'max-h-12' : 'max-h-28 sm:max-h-32 object-contain'}
                              />
                            </div>
                          ))}
                        </div>
                        {/* Example callout before Zimbabwe images for section 3.1 */}
                        {section.callouts?.find(c => c.type === "example") && (
                          <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 p-3">
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-orange-100">{isTi ? "📖 ኣብነት፤" : "📖 Example:"}</span>
                              <p className="flex-1 text-sm text-orange-100">
                                {section.callouts.find(c => c.type === "example")?.content}
                              </p>
                            </div>
                          </div>
                        )}
                        {section.images.length >= 5 && (
                          <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                            {section.images.slice(3, 5).map((image, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <ZoomableImage
                                  key={idx}
                                  src={image.src}
                                  alt={image.alt}
                                  caption={image.caption}
                                  className="w-full rounded-lg shadow-lg"
                                  thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {section.video && (
                          <div className="mt-6 flex flex-col items-center">
                            <div
                              className={[
                                "w-full mx-auto overflow-hidden rounded-xl border border-orange-400/20 bg-black shadow-lg",
                                chapter.slug === "problems-with-traditional-fiat-money"
                                  ? "max-w-md sm:max-w-lg"
                                  : "max-w-2xl",
                              ].join(" ")}
                            >
                              <video
                                src={section.video.src}
                                controls
                                className="w-full max-h-56 sm:max-h-64 object-contain aspect-video"
                                playsInline
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                            {section.video.caption && (
                              <p className="mt-2 text-center text-sm italic text-zinc-400">
                                {section.video.caption}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : section.heading === "3.2 Centralized Control — Governments and Banks" && section.images.length === 2 ? (
                      // Special layout for Centralized Control section with title below images
                      <div className="mt-6 space-y-4">
                        <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                          {section.images.map((image, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <ZoomableImage
                                key={idx}
                                src={image.src}
                                alt={image.alt}
                                caption={image.caption}
                                className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                                thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-orange-200">Centralized control over money</p>
                        </div>
                      </div>
                    ) : section.heading === "4.1 The Cypherpunks & Early Digital Currencies → Satoshi's Breakthrough" && section.images.length >= 1 ? (
                      // 4.1 Cypherpunks: images at half size
                      <div className="mt-6 flex flex-col items-center space-y-4">
                        {section.images.map((image, idx) => (
                          <div key={idx} className="flex flex-col items-center w-full max-w-sm sm:max-w-[50%] min-w-0">
                            <ZoomableImage
                              src={image.src}
                              alt={image.alt}
                              caption={image.caption}
                              className="w-full rounded-lg border border-orange-400/20 shadow-lg object-contain"
                              thumbnailClassName="max-h-44 sm:max-h-48 object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (section.heading === "6.2 Peer-to-Peer Transactions (P2P)" || section.heading.startsWith("6.2")) && section.images.length === 1 ? (
                      // P2P transaction flow diagram: one image with flow steps and caption
                      <div className="mt-6 flex flex-col items-center space-y-4">
                        <div className="w-full max-w-2xl rounded-lg border border-cyan-400/20 bg-zinc-900/50 p-4 shadow-lg">
                          <ZoomableImage
                            src={section.images[0].src}
                            alt={section.images[0].alt}
                            caption={section.images[0].caption}
                            className="w-full rounded-lg object-contain"
                          />
                          <p className="mt-2 text-center text-xs text-zinc-400">
                            {isTi ? "ኣሊስ ምስግጋር ትፈጥር → ትፍኖ → ኖድስ የረጋግጹ → ዕደናውያን የረጋግጹ" : "Diagram showing the flow: Alice creates transaction → broadcasts → nodes verify → miners confirm"}
                          </p>
                        </div>
                      </div>
                    ) : section.heading.startsWith("17.1") && section.images.length >= 1 ? (
                      <div className="mt-6 space-y-6">
                        <p className="text-center text-lg font-semibold text-cyan-200">
                          {isTi
                            ? "ዝተፈላለዩ ማልቲ-ሲግ ዲዛይናት ንድሕነትን ተወሳኺ ኣማራጺን ኣብ ሚዛን የእትዉ"
                            : "Different multi-sig designs balance security and redundancy"}
                        </p>
                        <p className="text-center text-sm text-zinc-400">
                          {isTi ? "ስእሊ ንምዕባይ ጠውቕ" : "Click any image to zoom"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {section.images.map((image, idx) => (
                            <ZoomableImage
                              key={idx}
                              src={image.src}
                              alt={image.alt}
                              caption={image.caption}
                            />
                          ))}
                        </div>
                      </div>
                    ) : section.images.some((img) => img.src.includes('jade.png') || img.src.includes('ledger.jpeg') || img.src.includes('trazeor.jpeg')) && section.images.length >= 3 ? (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {section.images.map((image, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <ZoomableImage
                              src={image.src}
                              alt={image.alt}
                              caption={image.caption}
                              className="w-full rounded-lg shadow-lg"
                              thumbnailClassName="max-h-[28rem]"
                            />
                          </div>
                        ))}
                      </div>
                    ) : chapter.slug === "the-nature-of-money" && (section.heading === "Introduction" || section.heading === "መእተዊ") && section.images.length >= 3 ? (
                      <ol className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {section.images.map((image, idx) => (
                          <li
                            key={image.src}
                            className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
                          >
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-300">
                              {isTi ? `ደረጃ ${idx + 1}` : `Step ${idx + 1}`}
                            </p>
                            <ZoomableImage
                              src={image.src}
                              alt={image.alt}
                              caption={image.caption}
                              className="rounded-lg"
                              thumbnailClassName="aspect-[4/3] w-full"
                            />
                          </li>
                        ))}
                      </ol>
                    ) : chapter.slug === "problems-with-traditional-fiat-money" &&
                      (section.heading.startsWith("3.5") || section.heading.includes("2008")) &&
                      section.images.length >= 1 ? (
                      <div className="mt-6 space-y-4">
                        <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                          {section.images.map((image, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <ZoomableImage
                                key={idx}
                                src={image.src}
                                alt={image.alt}
                                caption={image.caption}
                                className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                                thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : chapter.slug === "from-crisis-to-innovation" &&
                      (section.heading.startsWith("4.2") || section.heading.includes("Haber")) &&
                      section.images.length >= 1 ? (
                      <div className="mt-6 space-y-4">
                        <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                          {section.images.map((image, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <ZoomableImage
                                key={idx}
                                src={image.src}
                                alt={image.alt}
                                caption={image.caption}
                                className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                                thumbnailClassName="max-h-40 sm:max-h-44 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : section.images.length === 2 ? (
                      // Side by side layout for sections with exactly 2 images
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.images.map((image, idx) => (
                          <ZoomableImage
                            key={idx}
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="w-full rounded-lg border border-orange-400/20 shadow-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      // Skip dec.jpeg in 5.3 (already shown under Decentralization Explained)
                      (section.heading === "5.3 Bitcoin as Peer-to-Peer Electronic Cash"
                        ? section.images.filter((img) => !img.src.includes("dec.jpeg"))
                        : section.images
                      ).map((image, idx) => (
                        <div key={idx} className={`mt-4 ${image.src.includes('money_usage') || image.src.includes('chinese_first_fiat_money') || image.src.includes('jade.png') ? 'flex flex-col items-center' : ''}`}>
                          <ZoomableImage
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className={`rounded-lg ${image.src.includes('mempool') || image.src.includes('markel') || image.src.includes('pow') ? '' : 'border border-orange-400/20'} ${image.src.includes('money_usage') || image.src.includes('chinese_first_fiat_money') ? 'w-64 sm:w-80 max-w-full' : image.src.includes('jade.png') ? 'w-48 sm:w-64 max-w-full' : 'w-full'}`}
                            thumbnailClassName={image.src.includes('utxosize') || image.src.includes('mempool') || image.src.includes('markel') || image.src.includes('pow') ? 'max-h-[32rem]' : undefined}
                          />
                          {image.src.includes('money_usage') && section.bullets && (
                            <div className="mt-4 w-full max-w-2xl space-y-3">
                              <h4 className="text-base font-semibold text-orange-200 text-center">The three essential functions of money:</h4>
                              <ul className="space-y-2 text-zinc-100 text-base leading-relaxed">
                                {section.bullets.map((bullet, bulletIdx) => (
                                  <li key={bulletIdx} className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    )
                  )
                )}
              </div>
              </ChapterSectionAnimated>
              {chapter.slug === "the-nature-of-money" && sectionIdx === 0 ? (
                <Chapter1InteractiveLesson module="barter" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-nature-of-money" && sectionIdx === 1 ? (
                <Chapter1InteractiveLesson module="functions" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-nature-of-money" && sectionIdx === 2 ? (
                <Chapter1InteractiveLesson module="properties" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-journey-of-money" && sectionIdx === 0 ? (
                <Chapter2InteractiveLesson module="evolution" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-journey-of-money" && sectionIdx === 2 ? (
                <Chapter2InteractiveLesson module="barter_commodity" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-journey-of-money" && sectionIdx === 3 ? (
                <Chapter2InteractiveLesson module="coinage_aksum" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-journey-of-money" && sectionIdx === 4 ? (
                <Chapter2InteractiveLesson module="goldsmith_paper" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-journey-of-money" && sectionIdx === 5 ? (
                <Chapter2InteractiveLesson module="fiat_inflation" isTi={isTi} />
              ) : null}
              {chapter.slug === "problems-with-traditional-fiat-money" && sectionIdx === 1 ? (
                <Chapter3InteractiveLesson module="inflation_power" isTi={isTi} />
              ) : null}
              {chapter.slug === "problems-with-traditional-fiat-money" && sectionIdx === 2 ? (
                <Chapter3InteractiveLesson module="centralized_control" isTi={isTi} />
              ) : null}
              {chapter.slug === "problems-with-traditional-fiat-money" && sectionIdx === 3 ? (
                <Chapter3InteractiveLesson module="cantillon_funnel" isTi={isTi} />
              ) : null}
              {chapter.slug === "problems-with-traditional-fiat-money" && sectionIdx === 5 ? (
                <Chapter3InteractiveLesson module="crisis_bailout_2008" isTi={isTi} />
              ) : null}
              {chapter.slug === "from-crisis-to-innovation" && sectionIdx === 1 ? (
                <Chapter4InteractiveLesson module="cypherpunk_timeline" isTi={isTi} />
              ) : null}
              {chapter.slug === "from-crisis-to-innovation" && sectionIdx === 2 ? (
                <Chapter4InteractiveLesson module="timestamp_chain" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-birth-of-bitcoin" && sectionIdx === 1 ? (
                <Chapter5InteractiveLesson module="genesis_whitepaper" isTi={isTi} />
              ) : null}
              {chapter.slug === "the-birth-of-bitcoin" && sectionIdx === 2 ? (
                <>
                  <Chapter5InteractiveLesson module="p2p_vs_centralized" isTi={isTi} />
                  <Chapter5InteractiveLesson module="network_topology" isTi={isTi} />
                  <Chapter5InteractiveLesson module="three_pillars" isTi={isTi} />
                </>
              ) : null}
              {chapter.slug === "keys-and-transactions" && sectionIdx === 2 ? (
                <Chapter6InteractiveLesson module="mailbox_keys" isTi={isTi} />
              ) : null}
              {chapter.slug === "keys-and-transactions" && sectionIdx === 3 ? (
                <Chapter6InteractiveLesson module="p2p_pipeline" isTi={isTi} />
              ) : null}
              {chapter.slug === "blockchain-basics" && sectionIdx === 1 ? (
                <Chapter7InteractiveLesson module="block_formation" isTi={isTi} />
              ) : null}
              {chapter.slug === "blockchain-basics" && sectionIdx === 2 ? (
                <Chapter7InteractiveLesson module="hash_fingerprint" isTi={isTi} />
              ) : null}
              {chapter.slug === "blockchain-basics" && sectionIdx === 3 ? (
                <Chapter7InteractiveLesson module="build_chain" isTi={isTi} />
              ) : null}
              {chapter.slug === "blockchain-basics" && sectionIdx === 4 ? (
                <Chapter7InteractiveLesson module="mining_puzzle" isTi={isTi} />
              ) : null}
              {chapter.slug === "exchange-software-wallet" && sectionIdx === 0 ? (
                <Chapter8InteractiveLesson module="exchange_onramp" isTi={isTi} />
              ) : null}
              {chapter.slug === "exchange-software-wallet" && sectionIdx === 1 ? (
                <Chapter8InteractiveLesson module="seed_backup_lab" isTi={isTi} />
              ) : null}
              {chapter.slug === "exchange-software-wallet" && sectionIdx === 2 ? (
                <Chapter8InteractiveLesson module="send_receive_playground" isTi={isTi} />
              ) : null}
              {chapter.slug === "exchange-software-wallet" && sectionIdx === 3 ? (
                <Chapter8InteractiveLesson module="privacy_inspector" isTi={isTi} />
              ) : null}
              {chapter.slug === "utxos-fees-coin-control" && sectionIdx === 1 ? (
                <Chapter9InteractiveLesson module="utxo_lifecycle" isTi={isTi} />
              ) : null}
              {chapter.slug === "utxos-fees-coin-control" && sectionIdx === 2 ? (
                <>
                  <Chapter9InteractiveLesson module="fee_vbytes_lab" isTi={isTi} />
                  <Chapter9InteractiveLesson module="coin_control_cockpit" isTi={isTi} />
                </>
              ) : null}
              {chapter.slug === "utxos-fees-coin-control" && sectionIdx === 3 ? (
                <Chapter9InteractiveLesson module="consolidation_time_machine" isTi={isTi} />
              ) : null}
              {chapter.slug === "good-bitcoin-hygiene" && sectionIdx === 1 ? (
                <Chapter10InteractiveLesson module="address_verification_lab" isTi={isTi} />
              ) : null}
              {chapter.slug === "good-bitcoin-hygiene" && sectionIdx === 2 ? (
                <Chapter10InteractiveLesson module="utxo_labeling_workbench" isTi={isTi} />
              ) : null}
              {chapter.slug === "good-bitcoin-hygiene" && sectionIdx === 3 ? (
                <>
                  <Chapter10InteractiveLesson module="payment_flow_simulator" isTi={isTi} />
                  <Chapter10InteractiveLesson module="hygiene_audit_checklist" isTi={isTi} />
                </>
              ) : null}
              {chapter.slug === "hardware-signers" && sectionIdx === 1 ? (
                <Chapter11InteractiveLesson module="threat_model_sandbox" isTi={isTi} />
              ) : null}
              {chapter.slug === "hardware-signers" && sectionIdx === 2 ? (
                <Chapter11InteractiveLesson module="passphrase_vault_lab" isTi={isTi} />
              ) : null}
              {chapter.slug === "hardware-signers" && sectionIdx === 3 ? (
                <Chapter11InteractiveLesson module="psbt_signing_pipeline" isTi={isTi} />
              ) : null}
              {chapter.slug === "verify-for-yourself-block-explorers-nodes" && (section.heading.includes("12.0") || sectionIdx === 1) ? (
                <Chapter12InteractiveLesson module="block_explorer_lab" isTi={isTi} />
              ) : null}
              {chapter.slug === "verify-for-yourself-block-explorers-nodes" && (section.heading.includes("12.1") || sectionIdx === 2) ? (
                <Chapter12InteractiveLesson module="merkle_proof_visualizer" isTi={isTi} />
              ) : null}
              {chapter.slug === "verify-for-yourself-block-explorers-nodes" && (section.heading.includes("12.2") || sectionIdx === 3) ? (
                <Chapter12InteractiveLesson module="node_validator_sandbox" isTi={isTi} />
              ) : null}
              {chapter.slug === "verify-for-yourself-block-explorers-nodes" && (section.heading.includes("12.3") || sectionIdx === 4) ? (
                <Chapter12InteractiveLesson module="node_sync_calculator" isTi={isTi} />
              ) : null}
              {chapter.slug === "proof-of-work-and-block-rewards" && (section.heading.includes("13.0") || sectionIdx === 1) ? (
                <Chapter13InteractiveLesson module="pow_asymmetry" isTi={isTi} />
              ) : null}
              {chapter.slug === "proof-of-work-and-block-rewards" && (section.heading.includes("13.1") || sectionIdx === 2) ? (
                <Chapter13InteractiveLesson module="coinbase_reward_anatomy" isTi={isTi} />
              ) : null}
              {chapter.slug === "proof-of-work-and-block-rewards" && (section.heading.includes("13.2") || sectionIdx === 3) ? (
                <Chapter13InteractiveLesson module="halving_schedule_curve" isTi={isTi} />
              ) : null}
              {chapter.slug === "proof-of-work-and-block-rewards" && (section.heading.includes("13.3") || sectionIdx === 4) ? (
                <Chapter13InteractiveLesson module="subsidy_timeline_2140" isTi={isTi} />
              ) : null}
              {chapter.slug === "mining-in-practice" && (section.heading.includes("14.0") || sectionIdx === 1) ? (
                <Chapter14InteractiveLesson module="mining_cockpit" isTi={isTi} />
              ) : null}
              {chapter.slug === "mining-in-practice" && (section.heading.includes("14.1") || sectionIdx === 2) ? (
                <Chapter14InteractiveLesson module="mining_pool_simulator" isTi={isTi} />
              ) : null}
              {chapter.slug === "mining-in-practice" && (section.heading.includes("14.2") || sectionIdx === 3) ? (
                <Chapter14InteractiveLesson module="security_budget_analyzer" isTi={isTi} />
              ) : null}
              {chapter.slug === "mining-in-practice" && (section.heading.includes("14.3") || sectionIdx === 4) ? (
                <Chapter14InteractiveLesson module="asic_geopolitics_map" isTi={isTi} />
              ) : null}
              </React.Fragment>
              );
            })}
            {chapter.slug === "the-nature-of-money" ? (
              <>
                <Chapter1InteractiveLesson module="comparison" isTi={isTi} />
                <Chapter1InteractiveLesson module="trust" isTi={isTi} />
                <Chapter1InteractiveLesson module="everyday" isTi={isTi} />
                <Chapter1InteractiveLesson module="assessment" isTi={isTi} />
              </>
            ) : null}
          </div>
        </section>
        )}

        {!isWrapUpResources ? (
        <>
        {/* Assignments */}
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-950 p-3.5 sm:p-6 shadow-inner w-full min-w-0">
          <h2 className="text-base font-semibold text-zinc-100 sm:text-lg mb-4">
            {isTi ? "ዕዮ" : "Assignment"}
          </h2>
          {chapter.slug === 'the-nature-of-money' ? (
            <ChapterAssignment
              assignmentId="11111111-1111-4111-8111-111111111111"
              title={isTi ? "ዕዮ፡ \"ገንዘብ ንዓኻ  እንታይ እዩ?\"" : "Assignment: \"What Is Money to Me?\""}
              question={isTi ? "ገንዘብ ኣብ ማሕበረሰበይ እንታይ ጸገም ይፈትሕ?" : "What problem does money solve in my community?"}
              description={isTi ? "ገንዘብ ኣብ መዓልታዊ ህይወትካን ማሕበረሰብካን ብኸመይ ከም ዝሰርሕ ተረዳአ።" : "Reflect on how money functions in your daily life and community."}
              points={10}
              rewardSats={50}
            />
          ) : chapter.slug === 'the-journey-of-money' ? (
            <ChapterAssignment
              assignmentId="22222222-2222-4222-8222-222222222222"
              title={isTi ? "ዕዮ፡ ገንዘብ ኣብ ትሕቲ ጸቕጢ" : "Assignment: Money Under Pressure"}
              question={isTi ? "ኣብ ከባቢኻ ገንዘብ ክሳራ ዋጋ ከጋጥሞ ዝረኣኻዮ ኣብነት ግለጽ።" : "Write about how you saw old money fail."}
              description={isTi ? "ካብ ቤተሰብካ ወይ ሃገርካ ዝዝከሮ ናይ ዋጋ ዕዀ ወይ ምውሳኽ ዋጋ ኣብነት ኣካፍል።" : "Reflect on your experiences or observations of traditional money systems failing."}
              points={10}
              rewardSats={75}
            />
          ) : chapter.slug === 'problems-with-traditional-fiat-money' ? (
            <ChapterAssignment
              assignmentId="33333333-3333-4333-8333-333333333333"
              title={isTi ? "ዕዮ፡ ምስ ዝቕባበ ምንጽጻር" : "Assignment: Inflation Reality Check"}
              question={isTi ? "ዋጋ ሓደ ኣብ መዓልታዊ ህይወት እትጥቀመሉ ኣቕሓ ሎሚን ቅድሚ 10–20 ዓመትን ኣነጻጽር።" : "Compare the price of one everyday item (bread, sugar, fuel) today vs 10–20 years ago."}
              description={isTi ? "እዚ ምንጽጻር ዝቕባበ ንዓቕሚ ምግዛእ ብኸመይ ከም ዝጸልዎ ንምርዳእ ይሕግዝ።" : "Research and compare prices to understand inflation's impact on purchasing power."}
              points={10}
              rewardSats={75}
            />
          ) : chapter.slug === 'from-crisis-to-innovation' ? (
            <ChapterAssignment
              assignmentId="44444444-4444-4444-8444-444444444444"
              title={isTi ? "ዕዮ፡ እቲ ስርዓት እንታይ ኣፍረሶ?" : "Assignment: &quot;What Broke?&quot;"}
              question={isTi ? "ካብ ዝቕባበ፣ ዕዳ፣ ሓገዝ ባንክ ወይ ማእከላይ ቁጽጽር፡ ሓደ ጠንቂ ናይቲ ኣረጊት ስርዓት ምፍሻል ብቃልካ ኣብራህ።" : "Explain in your own words one reason the old system failed (inflation, debt, bailouts, control)."}
              description={isTi ? "ኣብ 2008 ዝነበረ ቅልውላውን ኣብ ስርዓት ፋይናንስ ዝነበሩ ጸገማትን ኣስተንትን።" : "Reflect on the failures of the traditional financial system."}
              points={10}
              rewardSats={75}
            />
          ) : chapter.slug === 'the-birth-of-bitcoin' ? (
            <ChapterAssignment
              assignmentId="55555555-5555-4555-8555-555555555555"
              title={isTi ? "ዕዮ፡ ሓደ ሓሳብ ጻዕዳ ወረቐት ብቀሊሉ ምግላጽ" : "Assignment: Whitepaper Sentence Decode"}
              question={isTi ? "እዚ ሓሳብ ብቀሊሉ ደጊምካ ጽሓፎ፡ «ንመዛኑ ዝኸውን ኤሌክትሮኒካዊ ጥረ ገንዘብ…»" : "Rewrite this sentence in plain language: &quot;A purely peer-to-peer version of electronic cash…&quot;"}
              description={isTi ? "ተክኒካዊ ሓሳባት ብቀሊል ቋንቋ ምግላጽ ተለማመድ።" : "Practice translating technical language into everyday terms."}
              points={10}
              rewardSats={100}
            />
          ) : chapter.slug === 'keys-and-transactions' ? (
            <Chapter8Assignment
              assignmentId="66666666-6666-4666-8666-666666666666"
            />
          ) : chapter.slug === 'blockchain-basics' ? (
            <ChapterAssignment
              assignmentId="77777777-7777-4777-8777-777777777777"
              title={isTi ? "ዕዮ፡ ብሎክ ምርዳእ" : "Assignment: Understanding a Block"}
              question={isTi ? "ሓደ ሰብ ኣብ ኣረጊት ብሎክ ዘሎ ትራንዛክሽን ክቕይር እንተፈቲኑ እንታይ ይፍጠር?" : "What would happen if someone tried to change a transaction in an old block?"}
              description={isTi ? "ኣብ ብሎክቸይን ኣረጊት ትራንዛክሽን ምቕያር ዘስዕቦ ሳዕቤን ኣብራህ።" : "Explain the consequences of attempting to alter a transaction in a previous block on the blockchain."}
              points={10}
              rewardSats={100}
            />
          ) : chapter.slug === 'exchange-software-wallet' ? (
            <Chapter6Assignment
              assignmentId="88888888-8888-4888-8888-888888888888"
            />
          ) : chapter.slug === 'hardware-signers' ? (
            <ChapterAssignment
              assignmentId="bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb"
              title={isTi ? "ዕዮ፡ ናይ ስግኣት ሞዴል" : "Assignment: Threat Model"}
              question={isTi ? "ሓደ ናይ ሃርድዌር ዋለት ዝከላኸሎም 3 ስግኣታት ዘርዝር።" : "List 3 threats a hardware wallet protects against."}
              description={isTi ? "ናይ ሃርድዌር ቦርሳታት ዘለዎም ናይ ድሕነት ረብሓታት ምርዳእ።" : "Understand the security benefits of hardware wallets."}
              points={10}
              rewardSats={100}
            />
          ) : chapter.slug === 'utxos-fees-coin-control' ? (
            <ChapterUTXOAssignment
              assignmentId="99999999-9999-4999-8999-999999999999"
            />
          ) : chapter.slug === 'good-bitcoin-hygiene' ? (
            <ChapterAssignment
              assignmentId="10101010-1010-4101-8101-010101010101"
              title={isTi ? "ዕዮ፡ ናይ መጻኢ ርእስኻ ምዕቃብ" : "Assignment: Protect Your Future Self"}
              question={isTi ? "ስለምንታይ ኢኻ ኣብ ነፍሲ ወከፍ ግዜ ሓድሽ ናይ መቐበሊ ኣድራሻ ክትጥቀም ዘለካ?" : "Why should you use a new receive address every time?"}
              description={isTi ? "ኣብ ነፍሲ ወከፍ እዋን ሓድሽ መቐበሊ ኣድራሻ ምጥቃም ንብሕትውናን ድሕነትን ስለምንታይ ኣገዳሲ ምዃኑ ኣስተንትን።" : "Reflect on why using a new receive address every time is important for privacy and security."}
              points={10}
              rewardSats={100}
            />
          ) : chapter.slug === 'intro-to-bitcoin-script-optional-track' ? (
            <Chapter18Assignment
              assignmentId="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
              isTi={isTi}
            />
          ) : chapter.slug === 'why-bitcoin-philosophy-adoption' ? (
            <ChapterAssignment
              assignmentId="cccccccc-cccc-4ccc-8ccc-cccccccccccc"
              title="Assignment: Code or State"
              question="What do you think of Bitcoin?"
              description="Reflect on your perspective of Bitcoin after completing the course."
              points={10}
              rewardSats={100}
            />
          ) : chapter.slug === 'verify-for-yourself-block-explorers-nodes' ? (
            <ChapterExplorerAssignment chapterSlug={chapter.slug} />
          ) : chapter.slug === 'proof-of-work-and-block-rewards' ? (
            <Chapter14HalvingPuzzle
              assignmentId="dddddddd-dddd-4ddd-8ddd-dddddddddddd"
            />
          ) : chapter.slug === 'multi-sig-collaborative-custody' ? (
            <Chapter17MultisigAssignment
              assignmentId="17171717-1717-4171-8171-717171717171"
            />
          ) : null}
        </section>
        </>
        ) : null}

        {!isWrapUpResources && !hasTigrinyaMarkdown ? (
        <>
        {/* Summary */}
        <section className="rounded-xl border border-green-400/25 bg-black/70 p-3.5 sm:p-6 w-full min-w-0">
          <h2 className="text-base font-semibold text-green-200 sm:text-lg">
            {isTi ? "ሓፈሻዊ ሓሳባት / ቀንዲ ነጥብታት" : "Summary / Key Takeaways"}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-200">
            {chapter.summary.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {/* Key terms */}
        <section className="rounded-xl border border-cyan-400/20 bg-zinc-950/70 p-3.5 sm:p-6 w-full min-w-0">
          <h2 className="text-base font-semibold text-cyan-200 sm:text-lg">
            {isTi ? "ቁልፊ ቃላት" : "Key Terms"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {chapter.keyTerms.map((term) => {
              // Find the section that mentions this term
              const termLower = term.toLowerCase();
              const relevantSection = chapter.sections.findIndex((section) => {
                const headingLower = section.heading.toLowerCase();
                const contentLower = [
                  ...(section.paragraphs || []),
                  ...(section.bullets || []),
                  ...(section.callouts?.map(c => c.content) || []),
                ].join(' ').toLowerCase();
                return headingLower.includes(termLower) || contentLower.includes(termLower);
              });
              
              const sectionId = relevantSection >= 0 
                ? `section-${relevantSection}-${chapter.sections[relevantSection].heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                : null;
              
              return sectionId ? (
                <a
                  key={term}
                  href={`#${sectionId}`}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:text-cyan-50 cursor-pointer"
                >
                  {term}
                </a>
              ) : (
                <span
                  key={term}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                >
                  {term}
                </span>
              );
            })}
          </div>
        </section>
        </>
        ) : null}

        {/* Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full pt-2">
          {previousChapter ? (
            <Link
              href={`/chapters/${previousChapter.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-purple-400/50 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-100 transition hover:bg-purple-500/20"
            >
              {isTi ? `← ዝሓለፈ፡ ምዕራፍ ${previousChapter.number}` : `← Previous: Chapter ${previousChapter.number}`}
            </Link>
          ) : (
            <Link
              href="/chapters"
              className="inline-flex items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              {isTi ? "← ናብ ምዕራፋት ተመለስ" : "← Back to Chapters"}
            </Link>
          )}
          {nextChapter ? (
            <NextChapterButton
              nextChapterSlug={nextChapter.slug}
              nextChapterNumber={nextChapter.number}
              currentChapterNumber={chapter.number}
              currentChapterSlug={chapter.slug}
              variant="bottom"
            />
          ) : (
            <DoneChapterButton chapterNumber={chapter.number} chapterSlug={chapter.slug} />
          )}
        </div>
      </div>
    </PageContainer>
    </ChapterAccessCheck>
    </AdminModeWrapper>
  );
}
