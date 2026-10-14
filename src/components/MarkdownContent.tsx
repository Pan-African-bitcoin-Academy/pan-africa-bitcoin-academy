'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          <h1 className="mb-4 text-3xl font-bold text-zinc-50" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="mb-3 mt-6 text-2xl font-semibold text-zinc-50" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="mb-2 mt-4 text-xl font-semibold text-zinc-50" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 text-base leading-relaxed text-zinc-300" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-300" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="mb-4 ml-6 list-decimal space-y-2 text-zinc-300" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-base leading-relaxed" {...props} />
        ),
        strong: ({ node, className, ...props }) => (
          <strong
            className={className === 'article-highlight' ? 'font-medium text-[#F97602]' : 'font-semibold text-zinc-100'}
            {...props}
          />
        ),
        em: ({ node, ...props }) => (
          <em className="italic text-zinc-200" {...props} />
        ),
        code: ({ node, inline, ...props }: any) => {
          if (inline) {
            return (
              <code
                className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-cyan-300"
                {...props}
              />
            );
          }
          return (
            <code
              className="block overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-200"
              {...props}
            />
          );
        },
        pre: ({ node, ...props }) => (
          <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-cyan-400 underline transition hover:text-cyan-300"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="my-4 border-l-4 border-cyan-500/50 pl-4 italic text-zinc-400"
            {...props}
          />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-8 border-zinc-700" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
