import { motion } from "framer-motion";

const directionVariants = {
  up:    { hidden: { opacity: 0, y: 40 },    visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -40 },   visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -50 },   visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 },    visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  const variant = directionVariants[direction] || directionVariants.up;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variant}
      transition={{
        duration: 0.75,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}