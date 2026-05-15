import { motion } from "framer-motion";
import { Home, ScanLine, Settings, Zap } from "lucide-react";

export type NavTab = "home" | "services" | "scan" | "settings";

interface BottomNavProps {
  active: NavTab;
  onNavigate: (tab: NavTab) => void;
  onScan: () => void;
}

const tabs: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "services", label: "Services", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({ active, onNavigate, onScan }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom border-t border-white/20 dark:border-slate-700/50">
      <motion.div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              whileTap={{ scale: 0.92 }}
              className="flex min-w-[4rem] flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "text-brand-green dark:text-brand-orange" : "text-slate-400"}`}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-brand-green dark:text-brand-orange" : "text-slate-500"}`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          onClick={onScan}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange shadow-fab"
          aria-label="Scan voucher"
        >
          <ScanLine className="h-6 w-6 text-slate-900" strokeWidth={2.25} />
        </motion.button>

        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              whileTap={{ scale: 0.92 }}
              className="flex min-w-[4rem] flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "text-brand-green dark:text-brand-orange" : "text-slate-400"}`}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-brand-green dark:text-brand-orange" : "text-slate-500"}`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </nav>
  );
}
