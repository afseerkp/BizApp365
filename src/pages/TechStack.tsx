import { useLanguage } from '../i18n/LanguageContext';
import { PageHero } from '../components/ds/PageHero';
import Seo from '../components/seo/Seo';
import Security from '../components/home/Security';
import FinalCta from '../components/home/FinalCta';

const TechStack = () => {
  const { tm } = useLanguage();
  const x = tm.techx;
  return (
    <div>
      <Seo title={x.seoTitle} description={x.seoDescription} canonical="https://bizapp365.com/tech/" />
      <PageHero eyebrow={x.eyebrow} title={x.title} accent={x.accent} subtitle={tm.tech.subtitle} />
      <Security showCta={false} />
      <FinalCta />
    </div>
  );
};

export default TechStack;
