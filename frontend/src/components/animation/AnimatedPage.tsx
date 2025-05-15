import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 100 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -100 },
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5, // reduced duration for smoother animation
}

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="h-full w-full will-change-transform"
  >
    {children}
  </motion.div>
)
