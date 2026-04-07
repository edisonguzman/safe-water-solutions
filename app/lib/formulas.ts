// app/lib/formulas.ts

export const WEEKS_PER_MONTH = 4; 
export const DAILY_MISC_SAVINGS_PER_PERSON = 0.75; 

export const calculateMonthlySavings = (state: any) => {
  const weeklyGrocery = state.financialInputs?.weeklyGroceryBill || 0;
  const weeklyBottled = state.financialInputs?.weeklyBottledWaterCost || 0;
  const monthlyFilter = state.financialInputs?.monthlyFilterCost || 0;
  const householdSize = state.prospectInfo?.householdSize || 0;
  const productPercentage = state.financialInputs?.productPercentage || 0.15;

  // 1. Cleaning Products
  const soap = weeklyGrocery * productPercentage * WEEKS_PER_MONTH;

  // 2. Bottled Water & Filters
  const water = (weeklyBottled * WEEKS_PER_MONTH) + monthlyFilter;

  // 3. Household Water (The restored variable)
  const householdWater = householdSize * DAILY_MISC_SAVINGS_PER_PERSON * 30;

  // Final Sum including all three
  const total = soap + water + householdWater; 

  return { soap, water, householdWater, total, productPercentage };
};