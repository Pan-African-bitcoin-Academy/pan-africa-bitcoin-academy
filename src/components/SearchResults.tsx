'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResultItem {
  id?: string | number;
  title: string;
  type: string;
  url: string;
  description?: string;
  excerpt?: string;
}

export function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((data) => {
        if (isMounted) {
          setResults(data.results || []);
        }
      })
      .catch((err) => {
        console.error('Search fetch error:', err);
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  if (!query) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-400">
        Enter a keyword above to search through chapters and articles.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-400">
        No results found for &ldquo;{query}&rdquo;.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, idx) => (
        <Link
          key={result.id || idx}
          href={result.url}
          className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 transition hover:border-cyan-400/50 hover:bg-zinc-900/50"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
              {result.type}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-100">{result.title}</h3>
          {(result.description || result.excerpt) && (
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
              {result.description || result.excerpt}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

export default SearchResults;
