import { lazy, Suspense } from 'react';
import Hero from '../components/home/Hero';
import Strip from '../components/home/Strip';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../i18n/LanguageContext';

const Problem = lazy(() => import('../components/home/Problem'));
const Story = lazy(() => import('../components/home/Story'));
const ModuleBento = lazy(() => import('../components/home/ModuleBento'));
const PlatformsSection = lazy(() => import('../components/home/PlatformsSection'));
const FieldSection = lazy(() => import('../components/home/FieldSection'));
const Compliance = lazy(() => import('../components/home/Compliance'));
const Industries = lazy(() => import('../components/home/Industries'));
const Metrics = lazy(() => import('../components/home/Metrics'));
const Security = lazy(() => import('../components/home/Security'));
const Faq = lazy(() => import('../components/home/Faq'));
const FinalCta = lazy(() => import('../components/home/FinalCta'));

const SectionLoader = () => <div className="min-h-[60vh]" aria-hidden />;

const Home = () => {
  const { tm } = useLanguage();
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tm.home.faq.items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="w-full">
      <Seo title={tm.home.seoTitle} description={tm.home.seoDescription} canonical="https://bizapp365.com/" jsonLd={faqLd} />
      <Hero />
      <Strip />
      <Suspense fallback={<SectionLoader />}>
        <Problem />
        <Story />
        <ModuleBento />
        <PlatformsSection />
        <FieldSection />
        <Compliance />
        <Industries />
        <Metrics />
        <Security />
        <Faq />
        <FinalCta />
      </Suspense>
    </div>
  );
};

export default Home;
