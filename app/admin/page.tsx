import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function AdminDashboard() {
  const client = await clerkClient();
  
  // Fetch all users from your Clerk instance
  const response = await client.users.getUserList();
  const users = response.data;

  // Server Action to handle the approval toggle
  async function toggleApproval(userId: string, currentStatus: boolean) {
    "use server";
    const client = await clerkClient();
    
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        approved: !currentStatus,
      },
    });
    
    // Refresh the page to show updated status
    revalidatePath("/admin");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">User Management</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const isApproved = !!user.publicMetadata.approved;
              const email = user.emailAddresses[0]?.emailAddress;
              
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{email}</td>
                  <td className="px-6 py-4">
                    {isApproved ? (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={toggleApproval.bind(null, user.id, isApproved)}>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          isApproved 
                            ? "bg-red-50 text-red-600 hover:bg-red-100" 
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isApproved ? "Revoke Access" : "Approve User"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}