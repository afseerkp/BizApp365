/** Formats form values as "Label: value" lines for mailto / WhatsApp bodies. */
export function buildMessage(v: Record<string, string>, labels: Record<string, string>) {
  return Object.entries(v)
    .filter(([, val]) => val)
    .map(([k, val]) => `${labels[k] ?? k}: ${val}`)
    .join('\n');
}
