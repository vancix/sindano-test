import { motion } from "framer-motion";
import { HeroIllustration } from "./HeroIllustration";

export function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="px-4 sm:px-6"
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green via-[#356b2e] to-[#1e3d1a] p-6 shadow-soft sm:p-8">
        <motion.div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-orange/20 blur-xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <motion.div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md flex-1">
            <motion.h2
              className="text-2xl font-bold leading-tight text-white sm:text-3xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Airtime, One Scan Away!
            </motion.h2>
            <motion.p
              className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              No more typing. Simply scan your airtime card and get loaded
            </motion.p>
          </div>

          <motion.div
            className="flex shrink-0 justify-center sm:w-36"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: "spring" }}
          >
            <HeroIllustration />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
