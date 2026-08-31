import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const TOKEN =
  /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function trimTrailingPunctuation(value: string): { core: string; trailing: string } {
  const match = value.match(/^(.*?)([).,;:]+)$/);
  if (!match) return { core: value, trailing: '' };
  return { core: match[1], trailing: match[2] };
}

function internalPath(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'bizapp365.com' || parsed.hostname === 'www.bizapp365.com') {
      return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/';
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function renderRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    const raw = match[0];
    const { core, trailing } = trimTrailingPunctuation(raw);

    if (core.includes('@') && !core.startsWith('http')) {
      nodes.push(
        <a key={`email-${key++}`} href={`mailto:${core}`}>
          {core}
        </a>,
      );
    } else {
      const path = internalPath(core);
      if (path) {
        nodes.push(
          <Link key={`int-${key++}`} to={path}>
            {core}
          </Link>,
        );
      } else {
        nodes.push(
          <a key={`ext-${key++}`} href={core} target="_blank" rel="noopener noreferrer">
            {core}
          </a>,
        );
      }
    }

    if (trailing) nodes.push(trailing);
    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
