import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { AdBanner } from "./components/AdBanner";
import { BottomNav, type NavTab } from "./components/BottomNav";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { InstallPrompt } from "./components/InstallPrompt";
import { OperatorModal } from "./components/OperatorModal";
import { ScanFab } from "./components/ScanFab";
import { ScanModal } from "./components/ScanModal";
import { ServiceGrid } from "./components/ServiceGrid";
import { SettingsPanel } from "./components/SettingsPanel";
import { ToastContainer } from "./components/ToastContainer";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { emergencyItems, serviceItems } from "./data/services";

function AppContent() {
  const [scanOpen, setScanOpen] = useState(false);
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [fabLoading, setFabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  const openScan = useCallback(() => {
    setFabLoading(true);
    window.setTimeout(() => {
      setScanOpen(true);
      setFabLoading(false);
    }, 400);
  }, []);

  const closeScan = useCallback(() => {
    setScanOpen(false);
    setFabLoading(false);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleNavigate = useCallback(
    (tab: NavTab) => {
      setActiveTab(tab);
      if (tab === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (tab === "services") {
        scrollTo("services");
      }
    },
    [scrollTo],
  );

  return (
    <motion.div className="min-h-dvh pb-28">
      <Header />
      <main className="mx-auto max-w-5xl space-y-8 py-6 sm:space-y-10 sm:py-8">
        {(activeTab === "home" || activeTab === "services") && (
          <>
            <HeroBanner />
            <ServiceGrid
              title="Emergency"
              items={emergencyItems}
              variant="emergency"
              delay={0.15}
            />
            <ServiceGrid
              title="Services"
              items={serviceItems}
              variant="services"
              delay={0.25}
              onOperatorClick={() => setOperatorOpen(true)}
            />
          </>
        )}
        {activeTab === "settings" && <SettingsPanel />}
      </main>

      <ScanFab onClick={openScan} isLoading={fabLoading} />
      <BottomNav
        active={activeTab}
        onNavigate={handleNavigate}
        onScan={openScan}
      />
      <AdBanner />
      <InstallPrompt />
      <ToastContainer />
      <ScanModal open={scanOpen} onClose={closeScan} />
      <OperatorModal
        open={operatorOpen}
        onClose={() => setOperatorOpen(false)}
      />
    </motion.div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
