import { motion } from "framer-motion";
import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  rippleColor?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
}

export function RippleButton({
  children,
  className = "",
  rippleColor = "rgba(255,255,255,0.45)",
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const el = btnRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const id = ++rippleId.current;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRipples((prev) => [...prev, { x, y, id }]);
        window.setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
      onClick?.(e);
    },
    [onClick],
  );

  return (
    <motion.button
      ref={btnRef}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full"
          style={{
            left: r.x,
            top: r.y,
            backgroundColor: rippleColor,
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
