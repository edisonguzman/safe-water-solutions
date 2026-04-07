// app/lib/formulas.ts

export const WEEKS_PER_MONTH = 4; 
export const SOAP_SAVINGS_PERCENT = 0.15;
export const DAILY_MISC_SAVINGS_PER_PERSON = 0.75; 

export const calculateMonthlySavings = (state: any) => {
  const weeklyGrocery = state.financialInputs?.weeklyGroceryBill || 0;
  const weeklyBottled = state.financialInputs?.weeklyBottledWaterCost || 0;
  const monthlyFilter = state.financialInputs?.monthlyFilterCost || 0;
  const householdSize = state.prospectInfo?.householdSize || 0;

  // 1. Soaps & Cleansers
  const soap = weeklyGrocery * SOAP_SAVINGS_PERCENT * WEEKS_PER_MONTH;

  // 2. Water & Filters
  const water = (weeklyBottled * WEEKS_PER_MONTH) + monthlyFilter;

  // 3. Daily Misc (Keep for potential reference, but exclude from total if desired)
  const daily = householdSize * DAILY_MISC_SAVINGS_PER_PERSON * 30;

  // UPDATED: Total only includes the two categories you want to show
  const total = soap + water; 

  return { soap, water, daily, total };
};