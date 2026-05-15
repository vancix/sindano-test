import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useToast } from "../context/ToastContext";
import { RippleButton } from "./ui/RippleButton";

export function InstallPrompt() {
  const { canInstall, install, dismiss } = useInstallPrompt();
  const { showToast } = useToast();

  const handleInstall = async () => {
    const ok = await install();
    if (ok) showToast("Sindano Test installed!", "success");
  };

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-[55] mx-auto max-w-md"
        >
          <div className="flex items-center gap-3 rounded-2xl glass-card p-4 shadow-lg ring-1 ring-brand-green/20">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green text-brand-orange"
            >
              <span className="text-sm font-bold">ST</span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Install Sindano Test
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add to home screen for quick access
              </p>
            </div>
            <RippleButton
              onClick={() => void handleInstall()}
              className="shrink-0 rounded-xl bg-brand-orange px-3 py-2 text-xs font-bold text-slate-900"
            >
              <Download className="h-4 w-4" />
            </RippleButton>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-lg p-1 text-slate-400"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
