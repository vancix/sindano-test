import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";
import { RippleButton } from "./ui/RippleButton";

interface ScanFabProps {
  onClick: () => void;
  isLoading: boolean;
}

export function ScanFab({ onClick, isLoading }: ScanFabProps) {
  return (
    <motion.div
      className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-50 sm:right-6 md:hidden"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.5 }}
    >
      <RippleButton
        onClick={onClick}
        disabled={isLoading}
        rippleColor="rgba(0,0,0,0.15)"
        className="flex items-center gap-2.5 rounded-full bg-brand-orange px-5 py-3.5 font-semibold text-slate-900 shadow-fab transition-shadow hover:bg-brand-orange-hover disabled:cursor-wait disabled:opacity-90"
        aria-label="Scan voucher"
      >
        {isLoading ? (
          <motion.span
            className="h-5 w-5 rounded-full border-2 border-slate-900/30 border-t-slate-900"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <ScanLine className="h-5 w-5" strokeWidth={2.25} />
        )}
        <span className="text-sm">
          {isLoading ? "Opening…" : "Scan Voucher"}
        </span>
      </RippleButton>
    </motion.div>
  );
}
