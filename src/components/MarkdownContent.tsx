'use client';

import React from 'react';

interface MarkdownContentProps {
  content: string;
  highlightTerms?: readonly string[];
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  // Split content into paragraphs
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, pIndex) => {
        const text = paragraph.trim();
        if (!text) return null;

        // Render headings if any
        if (text.startsWith('### ')) {
          return (
            <h3 key={pIndex} className="text-xl font-semibold text-zinc-100 mt-6 mb-2">
              {text.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (text.startsWith('## ')) {
          return (
            <h2 key={pIndex} className="text-2xl font-bold text-zinc-50 mt-8 mb-3">
              {text.replace(/^##\s+/, '')}
            </h2>
          );
        }
        if (text.startsWith('# ')) {
          return (
            <h1 key={pIndex} className="text-3xl font-extrabold text-white mt-10 mb-4">
              {text.replace(/^#\s+/, '')}
            </h1>
          );
        }

        // Render bullet lists
        if (text.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = text.split('\n').map(line => line.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={pIndex} className="list-disc list-inside space-y-1 my-2 text-zinc-300">
              {items.map((item, iIndex) => (
                <li key={iIndex}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={pIndex} className="text-base sm:text-lg leading-relaxed text-zinc-300">
            {text}
          </p>
        );
      })}
    </div>
  );
}

export default MarkdownContent;
