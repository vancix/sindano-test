import { AnimatePresence, motion } from "framer-motion";
import { Phone, Search, X } from "lucide-react";
import { useCallback, useState } from "react";
import { vibrate } from "../hooks/useVibration";
import {
  detectOperator,
  isValidTzMobile,
  type OperatorName,
} from "../utils/operator";
import { RippleButton } from "./ui/RippleButton";

interface OperatorModalProps {
  open: boolean;
  onClose: () => void;
}

const operatorColors: Record<OperatorName, string> = {
  Vodacom: "from-red-600 to-red-700",
  Airtel: "from-red-500 to-orange-600",
  Tigo: "from-blue-600 to-blue-700",
  Halotel: "from-orange-500 to-amber-600",
  TTCL: "from-sky-600 to-sky-700",
  Unknown: "from-slate-500 to-slate-600",
};

export function OperatorModal({ open, onClose }: OperatorModalProps) {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<OperatorName | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(() => {
    vibrate(10);
    if (!isValidTzMobile(phone)) {
      setError("Enter a valid Tanzanian number (e.g. 0712345678)");
      setResult(null);
      return;
    }
    setError(null);
    const { operator } = detectOperator(phone);
    setResult(operator);
  }, [phone]);

  const reset = useCallback(() => {
    setPhone("");
    setResult(null);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="operator-title"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto max-w-lg rounded-t-3xl glass p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-[min(100%-2rem,24rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
          >
            <motion.div className="mb-4 flex items-center justify-between">
              <h3
                id="operator-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Which Operator?
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Enter your phone number to detect Vodacom, Airtel, Tigo, Halotel,
              or TTCL.
            </p>

            <div className="relative mb-4">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setResult(null);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && check()}
                className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3.5 pl-12 pr-4 text-base font-medium outline-none ring-brand-green/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800/90 dark:text-white"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-3 text-sm font-medium text-red-600 dark:text-red-400"
              >
                {error}
              </motion.p>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-4 rounded-2xl bg-gradient-to-r ${operatorColors[result]} p-4 text-center text-white shadow-lg`}
              >
                <p className="text-xs font-medium uppercase tracking-wider opacity-90">
                  Your operator
                </p>
                <p className="mt-1 text-2xl font-bold">{result}</p>
              </motion.div>
            )}

            <RippleButton
              onClick={check}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green py-3.5 font-semibold text-white shadow-md hover:bg-brand-green-light"
            >
              <Search className="h-5 w-5" />
              Check Operator
            </RippleButton>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
