"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProspectModal({ 
  prospect, 
  isOpen, 
  onClose 
}: { 
  prospect: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({ ...prospect });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/prospects/${prospect.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
      } else {
        alert("Failed to update prospect.");
      }
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">Edit Prospect Info</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">First Name (Primary)</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.first_name1} 
              onChange={(e) => setFormData({...formData, first_name1: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Last Name (Primary)</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.last_name1} 
              onChange={(e) => setFormData({...formData, last_name1: e.target.value})} 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
            <input 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-gray-600 font-bold uppercase tracking-wider hover:text-gray-900"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isSaving ? "Saving..." : "Update Record"}
          </button>
        </div>
      </div>
    </div>
  );
}