"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function SendEmailButton({ prospect }: { prospect: any }) {
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    if (!prospect?.email) return alert("No email address for this prospect.");
    
    setLoading(true);
    
    // 1. Calculations for the email template
    const weeklyGrocery = Number(prospect.weekly_grocery_bill) || 0;
    const productPct = Number(prospect.product_percentage) || 0.15;
    const weeklyBottled = Number(prospect.weekly_bottled_water_cost) || 0;
    const monthlyFilter = Number(prospect.monthly_filter_cost) || 0;

    const monthlySavings = ((weeklyGrocery * productPct) * 4 * 0.75) + 
                           ((weeklyBottled * 4) + monthlyFilter);

    const savingsData = {
      monthly: monthlySavings,
      yearly: monthlySavings * 12
    };

    try {
      // 2. Map Database (snake_case) to Template (camelCase)
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          state: { 
            prospectInfo: {
              ...prospect,
              firstName1: prospect.first_name1, // Map these specifically
              firstName2: prospect.first_name2,
              address: prospect.address,
              city: prospect.city,
              state: prospect.state,
              email: prospect.email
            }, 
            waterTestResults: {
              hardness: prospect.hardness,
              tds: prospect.tds,
              ph: prospect.ph,
              chlorine: prospect.chlorine,
              iron: prospect.iron,
              nitrates: prospect.nitrates
            },
            waterSource: prospect.water_source || "City Water"
          }, 
          savings: savingsData 
        }),
      });
      
      if (res.ok) {
        alert(`Email sent successfully to ${prospect.first_name1}!`);
      } else {
        const errorData = await res.json();
        console.error("Email API Error:", errorData);
        alert("Failed to send email. Check API logs.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={sendEmail}
      disabled={loading}
      className="w-full bg-white border-2 border-blue-900 text-blue-900 py-4 rounded-2xl font-black uppercase hover:bg-blue-50 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <Mail size={20} />
      {loading ? "Sending..." : `Resend Email to ${prospect?.first_name1 || 'Customer'}`}
    </button>
  );
}