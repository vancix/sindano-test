export interface EmergencyAction {
  id: string;
  number: string;
  toastLabel: string;
}

export interface ServiceAction {
  id: string;
  ussd?: string;
  plainNumber?: string;
  toastLabel: string;
  type: "ussd" | "number" | "modal";
}

export const emergencyActions: Record<string, EmergencyAction> = {
  fire: { id: "fire", number: "114", toastLabel: "Fire & Rescue" },
  ambulance: { id: "ambulance", number: "115", toastLabel: "Ambulance" },
  police: { id: "police", number: "112", toastLabel: "Police" },
  "anti-corruption": {
    id: "anti-corruption",
    number: "113",
    toastLabel: "Anti-Corruption",
  },
  "anti-drugs": { id: "anti-drugs", number: "119", toastLabel: "Anti-Drugs" },
  tanesco: { id: "tanesco", number: "180", toastLabel: "TANESCO" },
};

export const serviceActions: Record<string, ServiceAction> = {
  "customer-care": {
    id: "customer-care",
    plainNumber: "100",
    toastLabel: "Customer Care",
    type: "number",
  },
  airtime: {
    id: "airtime",
    ussd: "*102#",
    toastLabel: "Airtime Balance",
    type: "ussd",
  },
  data: {
    id: "data",
    ussd: "*102#",
    toastLabel: "Data Balance",
    type: "ussd",
  },
  bundles: {
    id: "bundles",
    ussd: "*149*01#",
    toastLabel: "Bundles",
    type: "ussd",
  },
  mpesa: {
    id: "mpesa",
    ussd: "*150*00#",
    toastLabel: "M-Pesa",
    type: "ussd",
  },
  registration: {
    id: "registration",
    ussd: "*106#",
    toastLabel: "Registration Status",
    type: "ussd",
  },
  nida: {
    id: "nida",
    ussd: "*106#",
    toastLabel: "NIDA Number",
    type: "ussd",
  },
  operator: {
    id: "operator",
    toastLabel: "Which Operator",
    type: "modal",
  },
};
