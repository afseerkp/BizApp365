import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { duration, ease, viewportOnce } from '../../lib/motion';

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number };

/** Fades content up once when it scrolls into view. Static under reduced motion. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
