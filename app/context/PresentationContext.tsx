"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from "react";

// 1. Define the Shape of your Data
interface ProspectInfo {
  title1: string;
  firstName1: string;
  lastName1: string;
  title2: string;
  firstName2: string;
  lastName2: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  householdSize: number;
}

interface WaterTestResults {
  tds: string;
  hardness: string;
  ph: string;
  chlorine: string;
  iron: string;      // Added
  nitrates: string;  // Added
}

// NEW: Financial Inputs for Savings Calculations
interface FinancialInputs {
  weeklyGroceryBill: number;
  productPercentage: number;
  monthlyBottledWaterCost: number;
}

interface PresentationState {
  waterSource: "Well Water" | "City Water";
  prospectInfo: ProspectInfo;
  waterTestResults: WaterTestResults;
  waterCostPreferences: {
    buysBottled: boolean;
  };
  financialInputs: FinancialInputs; // Added to State
}

// 2. Initial State
const initialState: PresentationState = {
  waterSource: "City Water",
  prospectInfo: {
    title1: "",
    firstName1: "",
    lastName1: "",
    title2: "",
    firstName2: "",
    lastName2: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    householdSize: 1,
  },
  waterTestResults: {
    tds: "",
    hardness: "",
    ph: "",
    chlorine: "",
  },
  waterCostPreferences: {
    buysBottled: false,
  },
  financialInputs: {
    weeklyGroceryBill: 0,
    productPercentage: 0.15, // Defaulting to 15% as per your slide logic
    monthlyBottledWaterCost: 0,
  },
};

// 3. Reducer Logic
type Action =
  | { type: "UPDATE_SOURCE"; payload: "Well Water" | "City Water" }
  | { type: "UPDATE_PROSPECT"; payload: Partial<ProspectInfo> }
  | { type: "UPDATE_COST_PREFS"; payload: Partial<{ buysBottled: boolean }> }
  | { type: "UPDATE_TEST"; payload: Partial<WaterTestResults> }
  | { type: "UPDATE_FINANCIAL"; payload: Partial<FinancialInputs> }; // Added Action

function presentationReducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case "UPDATE_SOURCE":
      return { ...state, waterSource: action.payload };
    case "UPDATE_PROSPECT":
      return { 
        ...state, 
        prospectInfo: { ...state.prospectInfo, ...action.payload } 
      };
    case "UPDATE_TEST":
      return { 
        ...state, 
        waterTestResults: { ...state.waterTestResults, ...action.payload } 
      };
    case "UPDATE_COST_PREFS":
      return { 
        ...state, 
        waterCostPreferences: { ...state.waterCostPreferences, ...action.payload } 
      };
    case "UPDATE_FINANCIAL":
      return {
        ...state,
        financialInputs: { ...state.financialInputs, ...action.payload }
      };
    default:
      return state;
  }
}

// 4. Context & Provider Setup
const PresentationContext = createContext<{
  state: PresentationState;
  updateState: (section: keyof PresentationState, data: any) => void;
} | undefined>(undefined);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState);

  const updateState = useCallback((section: keyof PresentationState, data: any) => {
    if (section === "waterSource") dispatch({ type: "UPDATE_SOURCE", payload: data });
    if (section === "prospectInfo") dispatch({ type: "UPDATE_PROSPECT", payload: data });
    if (section === "waterTestResults") dispatch({ type: "UPDATE_TEST", payload: data });
    if (section === "waterCostPreferences") dispatch({ type: "UPDATE_COST_PREFS", payload: data });
    if (section === "financialInputs") dispatch({ type: "UPDATE_FINANCIAL", payload: data }); // Added Dispatch
  }, []);

  const value = useMemo(() => ({ state, updateState }), [state, updateState]);

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return context;
}