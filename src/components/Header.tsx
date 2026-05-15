import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function UkFlag() {
  return (
    <svg viewBox="0 0 60 30" className="h-3.5 w-7 rounded-sm shadow-sm" aria-hidden>
      <clipPath id="uk-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#uk-s)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 glass safe-top"
    >
      <motion.div
        className="mx-auto flex max-w-5xl items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green shadow-card">
            <span className="text-sm font-bold text-brand-orange">ST</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            Singano
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl glass-card shadow-card transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 rounded-xl glass-card px-2.5 py-2 shadow-card transition-shadow hover:shadow-md"
            aria-label="Change language to English"
          >
            <UkFlag />
            <span className="hidden text-xs font-medium text-slate-600 dark:text-slate-300 sm:inline">
              EN
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.header>
  );
}
