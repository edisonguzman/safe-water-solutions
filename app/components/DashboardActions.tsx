"use client";

import { Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import SendEmailButton from "./SendEmailButton";

export default function DashboardActions({ prospect, allProspects }: { prospect?: any, allProspects?: any[] }) {
  const router = useRouter();

  const handleDelete = async () => {
  if (!confirm(`Delete ${prospect.first_name1}'s record?`)) return;
  const res = await fetch(`/api/prospects/${prospect.id}`, { method: "DELETE" });
  
  if (res.ok) {
    // If you're on the detail page, send them back to the list
    // If you're on the dashboard list, refresh it
    router.refresh(); 
  } else {
    alert("Could not delete record. You may not have permission.");
  }
};

  const downloadCSV = () => {
    if (!allProspects) return;
    const headers = "Date,Name,Email,City,State,Water Source\n";
    const rows = allProspects.map(p => 
      `${new Date(p.created_at).toLocaleDateString()},${p.first_name1} ${p.last_name1},${p.email},${p.city},${p.state},${p.water_source}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Safe-Water-Leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!prospect) {
    return (
      <button onClick={downloadCSV} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold border border-gray-300 transition-all">
        <Download size={18} /> Export CSV
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <SendEmailButton prospect={prospect} />
      <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );
}