import { motion } from "framer-motion";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useToast } from "../context/ToastContext";
import { RippleButton } from "./ui/RippleButton";

export function AdBanner() {
  const { canInstall, install, isInstalled } = useInstallPrompt();
  const { showToast } = useToast();

  if (isInstalled) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 hidden glass safe-bottom sm:block"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6">
        <motion.div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green shadow-card">
          <span className="text-sm font-bold text-brand-orange">ST</span>
        </motion.div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            Sindano Test
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            Install for offline access & faster scans
          </p>
        </div>

        {canInstall && (
          <RippleButton
            onClick={async () => {
              const ok = await install();
              if (ok) showToast("App installed successfully!", "success");
            }}
            className="shrink-0 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-green-light"
          >
            Install
          </RippleButton>
        )}
      </div>
    </motion.aside>
  );
}
