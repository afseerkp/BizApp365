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
            <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[40rem] text-sm text-start border-collapse">
                {section.table.caption && (
                  <caption className="caption-top text-start px-4 py-3 text-slate-500 dark:text-slate-400">
                    {section.table.caption}
                  </caption>
                )}
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60">
                    {section.table.headers.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-3 py-2 font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row[0]} className="align-top even:bg-slate-50/80 dark:even:bg-slate-900/40">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${row[0]}-${cellIndex}`}
                          className="px-3 py-2 border-b border-slate-200 dark:border-slate-700"
                        >
                          {cellIndex === 0 ? <strong className="text-slate-900 dark:text-white">{cell}</strong> : renderRichText(cell)}
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
