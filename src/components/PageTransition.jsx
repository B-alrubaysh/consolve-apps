import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -16, scale: 1.01 },
};

const pageTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}