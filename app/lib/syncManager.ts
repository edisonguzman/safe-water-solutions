export async function flushOfflineLeads() {
  const offlineLeads = JSON.parse(localStorage.getItem("offline_leads") || "[]");
  
  if (offlineLeads.length === 0) return { synced: 0 };

  let syncedCount = 0;
  const remainingLeads = [];

  for (const lead of offlineLeads) {
    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      if (response.ok) {
        syncedCount++;
        // Trigger email for the newly created prospect
        const data = await response.json();
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prospectId: data.prospectId }),
        });
      } else {
        remainingLeads.push(lead);
      }
    } catch (error) {
      remainingLeads.push(lead);
    }
  }

  localStorage.setItem("offline_leads", JSON.stringify(remainingLeads));
  return { synced: syncedCount };
}