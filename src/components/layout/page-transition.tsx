'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';
import { useContext, useRef } from 'react';

function FrozenRouter(props: { children: React.ReactNode }) {
  /**
   * eslint-disable-next-line @typescript-eslint/ban-ts-comment
   * @ts-expect-error
   */
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  /**
   * eslint-disable-next-line @typescript-eslint/ban-ts-comment
   * @ts-expect-error
   */
  return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>;
}
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        variants={{
          exitState: { opacity: 0, x: 100 },
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};