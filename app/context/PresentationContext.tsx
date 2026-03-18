"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Type Definitions ---

export type WaterSourceType = "Well Water" | "City Water" | null;

export interface ProspectInfo {
  partner1Name: string;
  partner2Name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  date: string;
  householdSize: number;
}

export interface WaterTestResults {
  tds: string;
  hardness: string;
  ph: string;
  chlorine: string;
  ironFerrous: string;
  ironFerric: string;
  hydrogenSulfide: string;
  appearance: string[];
  pipeSize: string;
  pipeType: string;
  wellPumpDeliveryRate: string;
}

export interface FinancialInputs {
  weeklyBottledWaterCost: number;
  monthlyFilterCost: number;
  weeklyGroceryBill: number;
}

interface PresentationState {
  waterSource: WaterSourceType;
  prospectInfo: ProspectInfo;
  waterTestResults: WaterTestResults;
  financialInputs: FinancialInputs;
}

interface PresentationContextType {
  state: PresentationState;
  updateState: (section: keyof PresentationState, data: any) => void;
  resetState: () => void;
}

// --- Initial Empty State ---

const initialState: PresentationState = {
  waterSource: null,
  prospectInfo: {
    partner1Name: "",
    partner2Name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split('T')[0],
    householdSize: 1,
  },
  waterTestResults: {
    tds: "",
    hardness: "",
    ph: "",
    chlorine: "",
    ironFerrous: "",
    ironFerric: "",
    hydrogenSulfide: "",
    appearance: [],
    pipeSize: "",
    pipeType: "",
    wellPumpDeliveryRate: "",
  },
  financialInputs: {
    weeklyBottledWaterCost: 0,
    monthlyFilterCost: 0,
    weeklyGroceryBill: 0,
  },
};

// --- Context ---

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

// --- Provider Component ---

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PresentationState>(initialState);

  const updateState = <K extends keyof PresentationState>(
    section: K,
    data: any
  ) => {
    setState((prevState) => {
      const currentSection = prevState[section];

      if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
        return {
          ...prevState,
          [section]: {
            ...currentSection,
            ...data,
          },
        };
      }

      return {
        ...prevState,
        [section]: data,
      };
    });
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <PresentationContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </PresentationContext.Provider>
  );
};

// --- Custom Hook ---

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return context;
};