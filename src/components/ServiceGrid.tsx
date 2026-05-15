import { motion } from "framer-motion";
import { useCallback } from "react";
import { emergencyActions, serviceActions } from "../data/actions";
import type { ServiceItem } from "../data/services";
import { useToast } from "../context/ToastContext";
import { vibrate } from "../hooks/useVibration";
import { dial } from "../utils/dial";
import { RippleButton } from "./ui/RippleButton";

interface ServiceGridProps {
  title: string;
  items: ServiceItem[];
  variant: "emergency" | "services";
  delay?: number;
  onOperatorClick?: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function ServiceGrid({
  title,
  items,
  variant,
  delay = 0,
  onOperatorClick,
}: ServiceGridProps) {
  const { showToast } = useToast();

  const handlePress = useCallback(
    (serviceId: string) => {
      vibrate(12);

      if (variant === "emergency") {
        const action = emergencyActions[serviceId];
        if (!action) return;
        showToast(`Calling ${action.toastLabel}...`);
        dial(action.number);
        return;
      }

      const action = serviceActions[serviceId];
      if (!action) return;

      if (action.type === "modal") {
        showToast("Opening operator checker…");
        onOperatorClick?.();
        return;
      }

      if (action.type === "number" && action.plainNumber) {
        showToast(`Calling ${action.toastLabel}...`);
        dial(action.plainNumber);
        return;
      }

      if (action.type === "ussd" && action.ussd) {
        showToast(`Opening ${action.toastLabel}...`);
        dial(action.ussd);
      }
    },
    [variant, showToast, onOperatorClick],
  );

  return (
    <motion.section
      id={variant === "emergency" ? "emergency" : "services"}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      className="px-4 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100 sm:text-lg">
          {title}
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6 lg:gap-5"
        >
          {items.map((service) => {
            const Icon = service.icon;
            const isEmergency = variant === "emergency";
            return (
              <motion.div key={service.id} variants={itemVariant}>
                <RippleButton
                  onClick={() => handlePress(service.id)}
                  rippleColor={
                    isEmergency
                      ? "rgba(239,68,68,0.25)"
                      : "rgba(45,90,39,0.2)"
                  }
                  className="group flex w-full flex-col items-center gap-2 rounded-2xl p-3 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 active:scale-[0.98] sm:p-4"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl glass-card shadow-card transition-all duration-300 group-hover:shadow-lg group-hover:ring-2 sm:h-16 sm:w-16 ${
                      isEmergency
                        ? "group-hover:ring-red-400/30"
                        : "group-hover:ring-brand-green/25 dark:group-hover:ring-brand-orange/25"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 transition-colors sm:h-7 sm:w-7 ${
                        isEmergency
                          ? "text-red-600 group-hover:text-red-700 dark:text-red-400"
                          : "text-slate-600 group-hover:text-brand-green dark:text-slate-300 dark:group-hover:text-brand-orange"
                      }`}
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="text-center text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-400 sm:text-xs">
                    {service.label}
                  </span>
                </RippleButton>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
