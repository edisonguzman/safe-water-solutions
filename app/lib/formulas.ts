// app/lib/formulas.ts

export const WEEKS_PER_MONTH = 4; 
export const DAILY_MISC_SAVINGS_PER_PERSON = 0.75; 

export const calculateMonthlySavings = (state: any) => {
  const weeklyGrocery = state.financialInputs?.weeklyGroceryBill || 0;
  const weeklyBottled = state.financialInputs?.weeklyBottledWaterCost || 0;
  const monthlyFilter = state.financialInputs?.monthlyFilterCost || 0;
  const householdSize = state.prospectInfo?.householdSize || 0;

  // Use the percentage selected on Slide 3, or default to 15%
  const productPercentage = state.financialInputs?.productPercentage || 0.15;

  // 1. Soaps & Cleansers (Using the Dynamic Percentage)
  const soap = weeklyGrocery * productPercentage * WEEKS_PER_MONTH;

  // 2. Water & Filters
  const water = (weeklyBottled * WEEKS_PER_MONTH) + monthlyFilter;

  // 3. Daily Misc
  const daily = householdSize * DAILY_MISC_SAVINGS_PER_PERSON * 30;

  // Total for Summary Slide (Soap + Water)
  const total = soap + water; 

  return { soap, water, daily, total, productPercentage };
};