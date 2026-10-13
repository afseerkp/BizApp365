import type { ReactNode } from 'react';
import { Container } from './Container';
import { Accent, SectionHeading } from './SectionHeading';

/** Standard header for inner pages: aurora backdrop + kinetic headline. */
export function PageHero({ eyebrow, title, accent, subtitle, children }: { eyebrow: string; title: string; accent?: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 sm:pt-44 pb-16 sm:pb-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-grid mask-radial opacity-60" />
        <div className="absolute -top-40 start-1/4 w-[36rem] h-[36rem] blob text-brand-500/20" />
        <div className="absolute -top-20 end-[10%] w-[28rem] h-[28rem] blob text-violet-500/15" />
      </div>
      <Container className="relative">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={
            <>
              {title} {accent && <Accent>{accent}</Accent>}
            </>
          }
          subtitle={subtitle}
        />
        {children}
      </Container>
    </section>
  );
}
