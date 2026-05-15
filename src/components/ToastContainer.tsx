import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToast, type ToastType } from "../context/ToastContext";

const icons: Record<ToastType, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: XCircle,
};

const styles: Record<ToastType, string> = {
  info: "border-brand-green/30 bg-white/95 dark:bg-slate-800/95",
  success: "border-emerald-400/40 bg-emerald-50/95 dark:bg-emerald-950/90",
  error: "border-red-400/40 bg-red-50/95 dark:bg-red-950/90",
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-[max(3.5rem,env(safe-area-inset-top))] z-[100] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl ${styles[toast.type]}`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  toast.type === "success"
                    ? "text-emerald-600"
                    : toast.type === "error"
                      ? "text-red-600"
                      : "text-brand-green"
                }`}
              />
              <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
