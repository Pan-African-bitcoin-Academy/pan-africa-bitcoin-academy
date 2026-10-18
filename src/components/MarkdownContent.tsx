'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ZoomableImage } from '@/components/ZoomableImage';

interface MarkdownContentProps {
  content: string;
  highlightTerms?: readonly string[];
}

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  data?: {
    hProperties?: {
      className?: string | string[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

function highlightArticleTerms(terms: readonly string[]) {
  const sortedTerms = [...new Set(terms)].sort((left, right) => right.length - left.length);

  return () => (tree: MarkdownNode) => {
    const highlighted = new Set<string>();

    const textContent = (node: MarkdownNode): string =>
      node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(textContent).join('');

    const visit = (nodes: MarkdownNode[]): MarkdownNode[] =>
      nodes.flatMap((node) => {
        if (node.type === 'heading' || node.type === 'inlineCode' || node.type === 'code') {
          return [node];
        }

        if (node.type === 'strong') {
          const content = textContent(node);
          const term = sortedTerms.find((candidate) => !highlighted.has(candidate) && content.includes(candidate));

          if (term) {
            highlighted.add(term);
            return [{
              ...node,
              data: {
                ...node.data,
                hProperties: {
                  ...node.data?.hProperties,
                  className: 'article-highlight',
                },
              },
            }];
          }
        }

        if (node.type === 'text' && typeof node.value === 'string') {
          const parts: MarkdownNode[] = [];
          let cursor = 0;

          while (cursor < node.value.length) {
            let matchIndex = -1;
            let matchTerm = '';

            for (const term of sortedTerms) {
              if (highlighted.has(term)) continue;
              const index = node.value.indexOf(term, cursor);
              if (index >= 0 && (matchIndex < 0 || index < matchIndex)) {
                matchIndex = index;
                matchTerm = term;
              }
            }

            if (matchIndex < 0) break;
            if (matchIndex > cursor) parts.push({ type: 'text', value: node.value.slice(cursor, matchIndex) });
            parts.push({
              type: 'strong',
              data: { hProperties: { className: 'article-highlight' } },
              children: [{ type: 'text', value: matchTerm }],
            });
            highlighted.add(matchTerm);
            cursor = matchIndex + matchTerm.length;
          }

          if (parts.length === 0) return [node];
          if (cursor < node.value.length) parts.push({ type: 'text', value: node.value.slice(cursor) });
          return parts;
        }

        return node.children ? [{ ...node, children: visit(node.children) }] : [node];
      });

    tree.children = visit(tree.children ?? []);
  };
}

export function MarkdownContent({ content, highlightTerms = [] }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={highlightTerms.length ? [remarkGfm, highlightArticleTerms(highlightTerms)] : [remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="mb-4 text-3xl font-bold text-amber-200 transition-colors duration-200 hover:text-amber-100" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="mb-4 mt-8 text-2xl font-bold text-amber-200 border-b border-stone-800 pb-2 transition-all duration-300 hover:border-amber-500/40 hover:text-amber-100" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="group mb-3 mt-7 text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2.5 transition-all duration-300 hover:text-amber-200 hover:translate-x-1 before:content-[''] before:w-1.5 before:h-5 before:bg-gradient-to-b before:from-amber-400 before:to-orange-500 before:rounded-full before:shrink-0 before:transition-all before:duration-300 group-hover:before:h-6 group-hover:before:shadow-[0_0_8px_rgba(251,191,36,0.6)]" {...props} />
        ),
        p: ({ node, children, ...props }: any) => {
          const imageNodes = node?.children?.filter(
            (child: any) => child.tagName === 'img' || (child.type === 'element' && child.tagName === 'img')
          ) ?? [];
          if (imageNodes.length > 1) {
            return (
              <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                {children}
              </div>
            );
          }
          if (imageNodes.length === 1) {
            return <div className="my-6">{children}</div>;
          }
          return (
            <p className="mb-4 text-stone-300 leading-relaxed text-base sm:text-lg transition-colors duration-200 hover:text-stone-200" {...props}>
              {children}
            </p>
          );
        },
        img: ({ src, alt }: any) => {
          if (!src) return null;
          return (
            <div className="hover-lift-card rounded-2xl border border-amber-900/30 bg-stone-950/80 p-3 sm:p-4 shadow-xl hover:border-amber-500/40 hover:shadow-[0_12px_36px_rgba(245,158,11,0.12)]">
              <div className="relative overflow-hidden rounded-xl border border-stone-800">
                <ZoomableImage
                  src={src}
                  alt={alt || ''}
                  caption={alt || undefined}
                  thumbnailClassName="max-h-[420px] sm:max-h-[480px] w-full object-contain bg-black/60 transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </div>
          );
        },
        ul: ({ node, ...props }) => (
          <ul className="mb-5 ml-4 list-disc space-y-2 text-stone-300 marker:text-amber-400" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="mb-5 ml-4 list-decimal space-y-2 text-stone-300 marker:text-amber-400 font-medium" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="leading-relaxed text-sm sm:text-base text-stone-300" {...props} />
        ),
        strong: ({ node, className, ...props }) => {
          if (className === 'article-highlight') {
            return (
              <strong
                className="font-semibold text-amber-400 transition-colors duration-200 hover:text-amber-300 hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                {...props}
              />
            );
          }
          return <strong className="font-semibold text-stone-100" {...props} />;
        },
        em: ({ node, ...props }) => (
          <em className="italic text-amber-200/90 transition-colors duration-200 hover:text-amber-100" {...props} />
        ),
        code: ({ node, inline, ...props }: any) => {
          if (inline) {
            return (
              <code
                className="rounded border border-amber-500/20 bg-stone-900 px-1.5 py-0.5 text-xs sm:text-sm font-mono text-amber-300 transition-all duration-200 hover:border-amber-400/40 hover:bg-stone-800"
                {...props}
              />
            );
          }
          return (
            <code
              className="block overflow-x-auto rounded-xl border border-stone-800 bg-stone-950 p-4 text-xs sm:text-sm font-mono text-stone-200"
              {...props}
            />
          );
        },
        pre: ({ node, ...props }) => (
          <pre className="mb-5 overflow-x-auto rounded-xl border border-stone-800 bg-stone-950 p-4 transition-all duration-300 hover:border-stone-700" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-amber-400 underline decoration-amber-500/40 underline-offset-4 transition hover:text-amber-300 hover:decoration-amber-400"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="my-6 rounded-r-2xl border-l-4 border-amber-400 bg-gradient-to-r from-amber-500/10 via-stone-900/30 to-transparent p-4 sm:p-5 text-stone-200 italic shadow-sm transition-all duration-300 hover:border-amber-300 hover:from-amber-500/15"
            {...props}
          />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-8 border-stone-800" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
