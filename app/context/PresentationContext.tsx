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
  appearance: string[]; // e.g., ['Clear', 'Sediment']
  pipeSize: string;     // e.g., '3/4"', '1"'
  pipeType: string;     // e.g., 'Copper', 'Pex'
  wellPumpDeliveryRate: string; // GPM
}

export interface FinancialInputs {
  weeklyBottledWaterCost: number;
  monthlyFilterCost: number;
  weeklyGroceryBill: number;
}

// Define the shape of our entire presentation state
interface PresentationState {
  waterSource: WaterSourceType;
  prospectInfo: ProspectInfo;
  waterTestResults: WaterTestResults;
  financialInputs: FinancialInputs;
}

// Define the shape of the context, including the update function
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
    date: new Date().toISOString().split('T')[0], // Defaults to today
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

// --- Context Initialization ---

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

// --- Provider Component ---

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PresentationState>(initialState);

  // A dynamic function to update any section of the state
  const updateState = <K extends keyof PresentationState>(
    section: K,
    data: any
  ) => {
  const updateState = <K extends keyof PresentationState>(
    section: K,
    data: any
  ) => {
    // We change "setPresentationState" to "setState" here:
    setState((prevState) => {
      const currentSection = prevState[section];

      // If the section is an object, we spread it. 
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prevState,
          [section]: {
            ...currentSection,
            ...data,
          },
        };
      }

      // Fallback for non-object fields (like waterSource)
      return {
        ...prevState,
        [section]: data,
      };
    });
  };

  // Useful for resetting the form after a presentation is emailed and completed
  const resetState = () => {
    setState(initialState);
  };

  return (
    <PresentationContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </PresentationContext.Provider>
  );
};

// --- Custom Hook for Easy Access ---

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return context;
};