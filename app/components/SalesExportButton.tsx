"use client";
import { Download } from "lucide-react";

export default function SalesExportButton({ data }: { data: any[] }) {
  const downloadCSV = () => {
    const headers = ["Sale Date", "Lead Source", "Last Name", "Sale Price", "Amount Funded", "Status", "Grade", "EQ Type"];
    const rows = data.map(s => [
      s.sale_date, s.lead_source, s.last_name1, s.sale_price, s.amount_funded, s.sale_status, s.letter_grade, s.eq_type
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Sales_Report_${new Date().toLocaleDateString()}.csv`);
    link.click();
  };

  return (
    <button onClick={downloadCSV} className="bg-white border border-slate-200 p-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-xs font-bold text-slate-600">
      <Download size={16} /> Export CSV
    </button>
  );
}