import type { Metadata } from "next";
import { ChapterDetailClient } from "./ChapterDetailClient";
import { getChapterBySlug } from "@/content/chaptersContent";

type ChapterPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return {
      title: 'Chapter Not Found',
    };
  }

  return {
    title: `Chapter ${chapter.number}: ${chapter.title}`,
    description: chapter.hook || `Learn about ${chapter.title} in the PanAfrican Bitcoin Academy curriculum.`,
    alternates: {
      canonical: `/chapters/${slug}`,
    },
    openGraph: {
      title: `Chapter ${chapter.number}: ${chapter.title}`,
      description: chapter.hook || `Learn about ${chapter.title} in the PanAfrican Bitcoin Academy curriculum.`,
      url: `/chapters/${slug}`,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  return <ChapterDetailClient slug={slug} />;
}
