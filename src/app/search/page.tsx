import { Suspense } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { SearchResults } from '@/components/SearchResults';

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  return (
    <PageContainer
      title="Search"
      subtitle={query ? `Results for "${query}"` : 'Search chapters and blog posts'}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      }>
        <SearchResults query={query} />
      </Suspense>
    </PageContainer>
  );
}
