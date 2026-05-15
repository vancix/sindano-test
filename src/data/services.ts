import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  BadgeCheck,
  CircleDollarSign,
  FireExtinguisher,
  Gift,
  Globe,
  Headphones,
  IdCard,
  Leaf,
  Lightbulb,
  Radio,
  Shield,
  Signal,
  Wallet,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const emergencyItems: ServiceItem[] = [
  { id: "fire", label: "Fire & Rescue", icon: FireExtinguisher },
  { id: "ambulance", label: "Ambulance", icon: Ambulance },
  { id: "police", label: "Police", icon: Shield },
  { id: "anti-corruption", label: "Anti-Corruption", icon: CircleDollarSign },
  { id: "anti-drugs", label: "Anti-Drugs", icon: Leaf },
  { id: "tanesco", label: "TANESCO", icon: Lightbulb },
];

export const serviceItems: ServiceItem[] = [
  { id: "customer-care", label: "Customer Care", icon: Headphones },
  { id: "airtime", label: "Airtime Balance", icon: Signal },
  { id: "data", label: "Data Balance", icon: Globe },
  { id: "bundles", label: "Bundles", icon: Gift },
  { id: "mpesa", label: "M-Pesa", icon: Wallet },
  { id: "registration", label: "Registration Status", icon: BadgeCheck },
  { id: "nida", label: "NIDA Number", icon: IdCard },
  { id: "operator", label: "Which Operator", icon: Radio },
];

export const scanSteps = [
  "Initializing camera…",
  "Detecting voucher code…",
  "Validating with operator…",
  "Applying airtime…",
];
