"use client";

import { useState } from "react";

export default function SendEmailButton({ prospect }: { prospect: any }) {
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    if (!prospect.email) return alert("No email address for this prospect.");
    
    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect }),
      });
      
      if (res.ok) alert("Email sent successfully!");
      else alert("Failed to send email.");
    } catch (err) {
      alert("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={sendEmail}
      disabled={loading}
      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send Email"}
    </button>
  );
}