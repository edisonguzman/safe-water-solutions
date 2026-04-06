"use client";
import React, { useState } from "react";
import { Save } from "lucide-react";

export default function SalesRow({ prospect }: { prospect: any }) {
  const [data, setData] = useState(prospect);
  const [loading, setLoading] = useState(false);

  const sources = ["EDDM","Email","FB/Insta advertising","HomeShows","Google Business Profile","Inhouse calls","Lawn Signs","Lead Trees","HD Lead trees","L Lead trees","Lead Trees other location","Postcards","PPC Ads","Rack cards","Referral","Social Organic","Vehicle lettering","Website","Workshops","WTA","Other"];
  const finances = ["Preferred Credit", "Synchrony", "Check", "Cash", "Credit Card", "Other"];
  const statuses = ["Funded", "Canceled", "Not Qualified", "Other"];

  // AUTO-FORMULA: Percentage calculation
  const percentage = data.sale_price > 0 
    ? ((data.amount_funded / data.sale_price) * 100).toFixed(1) 
    : "0.0";

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sales/update/${prospect.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) alert("Data saved for " + data.last_name1);
    } catch (err) {
      alert("Save failed. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        <div className="font-black text-slate-900 text-sm truncate w-32">{data.last_name1}, {data.first_name1}</div>
      </td>
      
      <td className="px-2 py-3">
        <select name="lead_source" value={data.lead_source || ""} onChange={handleChange} className="text-[10px] border rounded p-1 w-full font-bold uppercase">
          <option value="">Source...</option>
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>

      <td className="px-2 py-3">
        <input type="date" name="sale_date" value={data.sale_date ? new Date(data.sale_date).toISOString().split('T')[0] : ""} onChange={handleChange} className="text-[10px] border rounded p-1 w-full" />
      </td>

      <td className="px-2 py-3">
        <input type="number" name="sale_price" value={data.sale_price || ""} onChange={handleChange} placeholder="$" className="text-xs border rounded p-1 w-24 font-bold" />
      </td>

      <td className="px-2 py-3">
        <select name="finance_company" value={data.finance_company || ""} onChange={handleChange} className="text-[10px] border rounded p-1 w-full">
          <option value="">Finance...</option>
          {finances.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </td>

      <td className="px-2 py-3">
        <input type="number" name="amount_funded" value={data.amount_funded || ""} onChange={handleChange} placeholder="$" className="text-xs border rounded p-1 w-24 font-bold text-blue-600" />
      </td>

      <td className="px-2 py-3 text-xs font-black text-blue-600">{percentage}%</td>

      <td className="px-2 py-3">
        <input type="date" name="install_date" value={data.install_date ? new Date(data.install_date).toISOString().split('T')[0] : ""} onChange={handleChange} className="text-[10px] border rounded p-1 w-full" />
      </td>

      <td className="px-2 py-3">
        <select name="sale_status" value={data.sale_status || "Pending"} onChange={handleChange} className="text-[10px] border rounded p-1 w-full font-black uppercase">
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>

      <td className="px-2 py-3"><input type="number" name="sws_paid" value={data.sws_paid || ""} onChange={handleChange} className="text-xs border rounded p-1 w-20" /></td>
      <td className="px-2 py-3"><input type="number" name="rep_paid" value={data.rep_paid || ""} onChange={handleChange} className="text-xs border rounded p-1 w-20" /></td>
      <td className="px-2 py-3"><input type="text" name="letter_grade" value={data.letter_grade || ""} onChange={handleChange} className="text-xs border rounded p-1 w-10 text-center font-black" /></td>
      <td className="px-2 py-3"><input type="text" name="eq_type" value={data.eq_type || ""} onChange={handleChange} className="text-xs border rounded p-1 w-24" /></td>

      <td className="px-2 py-3 text-center">
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Save size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </td>
    </tr>
  );
}