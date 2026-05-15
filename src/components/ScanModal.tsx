import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Flashlight,
  FlashlightOff,
  Phone,
  RefreshCw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createWorker, type Worker } from "tesseract.js";
import { useToast } from "../context/ToastContext";
import { vibrate } from "../hooks/useVibration";
import { dialRecharge } from "../utils/dial";
import { extractVoucherCode, formatVoucherDisplay } from "../utils/voucher";
import { RippleButton } from "./ui/RippleButton";

type ScanPhase = "camera" | "processing" | "success" | "error";

interface ScanModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScanModal({ open, onClose }: ScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const scanningRef = useRef(false);

  const [phase, setPhase] = useState<ScanPhase>("camera");
  const phaseRef = useRef<ScanPhase>("camera");
  phaseRef.current = phase;
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [ocrReady, setOcrReady] = useState(false);
  const [statusText, setStatusText] = useState("Point camera at voucher numbers");
  const { showToast } = useToast();

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const terminateWorker = useCallback(async () => {
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setPhase("camera");
    setError(null);
    setVoucherCode(null);
    setTorchOn(false);
    setStatusText("Point camera at voucher numbers");
    scanningRef.current = false;
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    void terminateWorker();
    reset();
    onClose();
  }, [onClose, reset, stopCamera, terminateWorker]);

  const captureAndScan = useCallback(async () => {
    if (scanningRef.current || phaseRef.current !== "camera") return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const worker = workerRef.current;
    if (!video || !canvas || !worker || video.readyState < 2) return;

    scanningRef.current = true;
    setStatusText("Scanning…");

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) {
      scanningRef.current = false;
      return;
    }

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      scanningRef.current = false;
      return;
    }

    const cropW = w * 0.85;
    const cropH = h * 0.35;
    const sx = (w - cropW) / 2;
    const sy = (h - cropH) / 2;
    ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

    try {
      const {
        data: { text },
      } = await worker.recognize(canvas);
      const code = extractVoucherCode(text);
      if (code) {
        vibrate([20, 40, 20]);
        setVoucherCode(code);
        setPhase("success");
        stopCamera();
        showToast(`Voucher detected: ${formatVoucherDisplay(code)}`, "success");
        window.setTimeout(() => {
          showToast("Dialing recharge USSD…", "info");
          dialRecharge(code);
        }, 1200);
      }
    } catch {
      /* continue scanning */
    } finally {
      scanningRef.current = false;
      if (phaseRef.current === "camera")
        setStatusText("Point camera at voucher numbers");
    }
  }, [showToast, stopCamera]);

  const startCamera = useCallback(async () => {
    setError(null);
    setPhase("camera");
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setPhase("error");
      setError(
        "Camera access denied. Allow camera permission and try again.",
      );
    }
  }, []);

  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const next = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: next } as MediaTrackConstraintSet],
      });
      setTorchOn(next);
      vibrate(8);
    } catch {
      showToast("Flashlight not supported on this device", "error");
    }
  }, [torchOn, showToast]);

  const retry = useCallback(() => {
    reset();
    void startCamera();
  }, [reset, startCamera]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const init = async () => {
      try {
        const worker = await createWorker("eng");
        if (cancelled) {
          await worker.terminate();
          return;
        }
        await worker.setParameters({
          tessedit_char_whitelist: "0123456789 ",
        });
        workerRef.current = worker;
        setOcrReady(true);
        await startCamera();
      } catch {
        if (!cancelled) {
          setPhase("error");
          setError("Failed to load OCR engine. Check your connection.");
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      stopCamera();
      void terminateWorker();
    };
  }, [open, startCamera, stopCamera, terminateWorker]);

  useEffect(() => {
    if (!open || phase !== "camera" || !ocrReady) return;

    scanIntervalRef.current = window.setInterval(() => {
      void captureAndScan();
    }, 1800);

    return () => {
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [open, phase, ocrReady, captureAndScan]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scan-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 z-[70] flex flex-col bg-black text-white"
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <h3 id="scan-title" className="text-lg font-bold">
                {phase === "success" ? "Voucher Scanned" : "Scan Voucher"}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl bg-white/10 p-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden">
              {phase === "camera" && (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  <motion.div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="relative h-28 w-[min(90%,20rem)] rounded-2xl border-2 border-brand-orange shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                      animate={{
                        boxShadow: [
                          "0 0 0 9999px rgba(0,0,0,0.45), 0 0 20px rgba(243,198,119,0.3)",
                          "0 0 0 9999px rgba(0,0,0,0.45), 0 0 40px rgba(243,198,119,0.6)",
                          "0 0 0 9999px rgba(0,0,0,0.45), 0 0 20px rgba(243,198,119,0.3)",
                        ],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute left-2 right-2 h-0.5 bg-brand-orange"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </motion.div>

                  <div className="absolute bottom-24 left-0 right-0 text-center">
                    <p className="text-sm font-medium text-white/90">
                      {statusText}
                    </p>
                    {!ocrReady && (
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="mt-1 text-xs text-white/60"
                      >
                        Loading OCR…
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => void toggleTorch()}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-8 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md"
                    aria-label={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
                  >
                    {torchOn ? (
                      <FlashlightOff className="h-5 w-5" />
                    ) : (
                      <Flashlight className="h-5 w-5" />
                    )}
                  </motion.button>
                </>
              )}

              {phase === "success" && voucherCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center gap-6 px-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <CheckCircle2 className="h-24 w-24 text-emerald-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm text-white/70">Voucher code</p>
                    <p className="mt-2 font-mono text-2xl font-bold tracking-wider">
                      {formatVoucherDisplay(voucherCode)}
                    </p>
                    <p className="mt-3 text-xs text-white/50">
                      Dialing *104*{voucherCode.replace(/\D/g, "")}#
                    </p>
                  </div>
                  <RippleButton
                    onClick={() => dialRecharge(voucherCode)}
                    className="flex items-center gap-2 rounded-2xl bg-brand-green px-6 py-3 font-semibold"
                  >
                    <Phone className="h-5 w-5" />
                    Dial Again
                  </RippleButton>
                </motion.div>
              )}

              {phase === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center"
                >
                  <AlertCircle className="h-16 w-16 text-red-400" />
                  <p className="text-sm text-white/80">{error}</p>
                  <RippleButton
                    onClick={retry}
                    className="flex items-center gap-2 rounded-2xl bg-brand-orange px-6 py-3 font-semibold text-slate-900"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Retry Scan
                  </RippleButton>
                </motion.div>
              )}
            </div>

            {phase === "success" && (
              <div className="border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <RippleButton
                  onClick={handleClose}
                  className="w-full rounded-2xl bg-white/10 py-3 font-semibold"
                >
                  Done
                </RippleButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
