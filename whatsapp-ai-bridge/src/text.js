// Helpers for turning model output into WhatsApp-friendly messages.

/** WhatsApp's hard limit is 4096 characters per text message; stay a little under it. */
export const WHATSAPP_MAX_CHARS = 4000;

/** Converts common Markdown into WhatsApp's formatting syntax. */
export function toWhatsAppFormat(text) {
  return (
    text
      // Code fences: WhatsApp uses ``` too, but drop the language tag.
      .replace(/```[a-zA-Z0-9_-]+\n/g, '```\n')
      // Headings -> bold line.
      .replace(/^#{1,6}\s+(.+)$/gm, '*$1*')
      // **bold** / __bold__ -> *bold*
      .replace(/\*\*(.+?)\*\*/g, '*$1*')
      .replace(/__(.+?)__/g, '*$1*')
      // ~~strike~~ -> ~strike~
      .replace(/~~(.+?)~~/g, '~$1~')
      // [label](url) -> label (url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1 ($2)')
      // "* item" bullets -> "- item" (a leading * would read as bold in WhatsApp)
      .replace(/^(\s*)\*\s+/gm, '$1- ')
      .trim()
  );
}

/** Splits long text into chunks under `max`, preferring paragraph, then line, then word boundaries. */
export function splitMessage(text, max = WHATSAPP_MAX_CHARS) {
  const chunks = [];
  let rest = text.trim();
  while (rest.length > max) {
    const window = rest.slice(0, max);
    let cut = window.lastIndexOf('\n\n');
    if (cut < max * 0.5) cut = window.lastIndexOf('\n');
    if (cut < max * 0.5) cut = window.lastIndexOf(' ');
    if (cut <= 0) cut = max;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}
