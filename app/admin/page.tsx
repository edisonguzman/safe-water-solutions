import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sql } from "@/app/lib/db";
import { Users, Droplets, TrendingUp, DollarSign, ShieldCheck, UserCog, ShieldAlert } from "lucide-react";

export default async function AdminDashboard() {
  const client = await clerkClient();
  
  // 1. Fetch Clerk Users
  const response = await client.users.getUserList();
  const users = response.data;

  // 2. Fetch Neon Analytics
  const statsResult = await sql`
    SELECT 
      COUNT(*) as total_prospects,
      COUNT(DISTINCT sales_rep_id) as active_reps,
      AVG(NULLIF(hardness, '')::numeric) as avg_hardness,
      SUM(((NULLIF(weekly_grocery_bill, 0) * 4 * NULLIF(product_percentage, 0) * 0.75) + NULLIF(monthly_bottled_water_cost, 0))) as total_savings
    FROM prospects
  `;
  const stats = statsResult[0];

  // Server Action for Clerk Approval
  async function toggleApproval(userId: string, currentStatus: boolean) {
    "use server";
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { approved: !currentStatus },
    });
    revalidatePath("/admin");
  }

  // Server Action for Role Management
  async function toggleRole(userId: string, currentRole: string) {
    "use server";
    const client = await clerkClient();
    const newRole = currentRole === "admin" ? "user" : "admin";
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: newRole },
    });
    revalidatePath("/admin");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 bg-slate-50 min-h-screen">
      
      {/* SECTION 1: EXECUTIVE OVERVIEW */}
      <header>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Executive Overview</h1>
        <p className="text-slate-500 font-medium">System-wide performance and water quality metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reports" 
          value={stats.total_prospects || 0} 
          icon={<Droplets className="text-blue-600" />} 
        />
        <StatCard 
          title="Active Sales Reps" 
          value={stats.active_reps || 0} 
          icon={<Users className="text-purple-600" />} 
        />
        <StatCard 
          title="Avg. Hardness" 
          value={`${Math.round(stats.avg_hardness || 0)} GPG`} 
          icon={<TrendingUp className="text-orange-600" />} 
        />
        <StatCard 
          title="Total Savings Found" 
          value={`$${Math.round(stats.total_savings || 0).toLocaleString()}`} 
          icon={<DollarSign className="text-green-600" />} 
          subtitle="Projected Monthly"
        />
      </div>

      {/* SECTION 2: USER MANAGEMENT */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <ShieldCheck className="text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">User Access Management</h2>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">User</th>
                <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isApproved = !!user.publicMetadata.approved;
                const isAdmin = user.publicMetadata.role === "admin";
                const email = user.emailAddresses[0]?.emailAddress;
                
                return (
                  <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-slate-500">{email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <span className="flex items-center gap-1 w-fit px-3 py-1 text-[10px] font-black uppercase bg-purple-100 text-purple-700 rounded-full">
                          <ShieldAlert size={12} /> Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 w-fit px-3 py-1 text-[10px] font-black uppercase bg-slate-100 text-slate-600 rounded-full">
                          <UserCog size={12} /> Sales Rep
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isApproved ? (
                        <span className="px-3 py-1 text-xs font-black uppercase bg-green-100 text-green-700 rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-black uppercase bg-amber-100 text-amber-700 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Role Toggle */}
                        <form action={toggleRole.bind(null, user.id, isAdmin ? "admin" : "user")}>
                          <button
                            type="submit"
                            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all"
                          >
                            {isAdmin ? "Demote to Rep" : "Promote to Admin"}
                          </button>
                        </form>

                        {/* Approval Toggle */}
                        <form action={toggleApproval.bind(null, user.id, isApproved)}>
                          <button
                            type="submit"
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              isApproved 
                                ? "bg-white text-red-600 border border-red-200 hover:bg-red-50" 
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isApproved ? "Revoke Access" : "Approve Rep"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// Internal Helper Component
function StatCard({ title, value, icon, subtitle }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col">
      <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-4">{icon}</div>
      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{title}</h3>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      {subtitle && <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-tighter">{subtitle}</p>}
    </div>
  );
}