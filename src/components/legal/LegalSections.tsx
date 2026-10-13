import type { LegalSection } from '../../content/legalTypes';
import { renderRichText } from '../../utils/richText';

function Paragraphs({ texts }: { texts?: string[] }) {
  if (!texts?.length) return null;
  return (
    <>
      {texts.map((paragraph) => (
        <p key={paragraph.slice(0, 80)}>{renderRichText(paragraph)}</p>
      ))}
    </>
  );
}

function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul>
      {items.map((item) => (
        <li key={item.slice(0, 80)}>{renderRichText(item)}</li>
      ))}
    </ul>
  );
}

export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          <Paragraphs texts={section.paragraphs} />
          {section.links && (
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <Bullets items={section.bullets} />
          {section.table && (
            <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-xl border border-line">
              <table className="w-full min-w-[40rem] text-sm text-start border-collapse">
                {section.table.caption && (
                  <caption className="caption-top text-start px-4 py-3 text-fg-subtle">
                    {section.table.caption}
                  </caption>
                )}
                <thead>
                  <tr className="bg-surface-2">
                    {section.table.headers.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-3 py-2 font-semibold text-fg border-b border-line whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row[0]} className="align-top even:bg-surface-2/60">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${row[0]}-${cellIndex}`}
                          className="px-3 py-2 border-b border-line"
                        >
                          {cellIndex === 0 ? <strong className="text-fg">{cell}</strong> : renderRichText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Paragraphs texts={section.paragraphsAfter} />
          <Bullets items={section.bulletsAfter} />
        </section>
      ))}
    </>
  );
}
