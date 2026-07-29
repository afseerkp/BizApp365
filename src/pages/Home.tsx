import { lazy, Suspense } from 'react';
import Hero from '../components/ui/Hero';
import CTASection from '../components/ui/CTASection';

const Highlights = lazy(() => import('./Highlights'));
const Features = lazy(() => import('./Features'));
const TechStack = lazy(() => import('./TechStack'));
const Testimonials = lazy(() => import('./Testimonials'));

const SectionLoader = () => <div className="min-h-[40vh]" aria-hidden />;

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <div id="highlights-section"><Highlights /></div>
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <div id="features-section"><Features /></div>
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <div id="tech-section"><TechStack /></div>
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <div id="testimonials-section"><Testimonials /></div>
      </Suspense>
      <CTASection />
    </div>
  );
};

export default Home;
