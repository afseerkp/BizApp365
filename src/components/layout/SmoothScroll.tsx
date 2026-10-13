import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Lenis smooth scrolling (skipped for reduced motion and touch devices) + route scroll management. */
export default function SmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (hash) {
      // wait for the lazily-loaded page to render its anchors
      let tries = 0;
      const find = () => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          if (lenis) lenis.scrollTo(top, { duration: 1.1 });
          else window.scrollTo({ top, behavior: 'smooth' });
        } else if (tries++ < 40) {
          setTimeout(find, 60);
        }
      };
      find();
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
