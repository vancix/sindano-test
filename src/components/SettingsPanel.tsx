import { motion } from "framer-motion";
import { Download, Moon, Sun } from "lucide-react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { RippleButton } from "./ui/RippleButton";

export function SettingsPanel() {
  const { isDark, toggleTheme } = useTheme();
  const { canInstall, install, isInstalled } = useInstallPrompt();
  const { showToast } = useToast();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 sm:px-6"
    >
      <div className="mx-auto max-w-5xl space-y-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 sm:text-lg">
          Settings
        </h2>

        <div className="space-y-3 rounded-3xl glass-card p-4 shadow-card">
          <RippleButton
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <span className="font-medium text-slate-800 dark:text-slate-100">
              Dark mode
            </span>
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </RippleButton>

          {(canInstall || isInstalled) && (
            <RippleButton
              onClick={async () => {
                if (isInstalled) {
                  showToast("App already installed", "info");
                  return;
                }
                const ok = await install();
                if (ok) showToast("Sindano Test installed!", "success");
              }}
              disabled={isInstalled}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left hover:bg-slate-50 disabled:opacity-60 dark:hover:bg-slate-700/50"
            >
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {isInstalled ? "Installed on device" : "Install app"}
              </span>
              <Download className="h-5 w-5 text-brand-green" />
            </RippleButton>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Sindano Test v1.0 — Made for Tanzania 🇹🇿
        </p>
      </div>
    </motion.section>
  );
}
