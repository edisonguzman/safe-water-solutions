import { SignOutButton } from "@clerk/nextjs";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-10 border border-gray-100">
        
        {/* Inline SVG so we don't need an external file */}
        <div className="mb-6 flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <svg 
              className="w-12 h-12 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-3a9 9 0 11-18 0 9 9 0 0118 0zM12 9V5a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z" 
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Pending Approval
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thanks for joining **Safe Water CMS**. To maintain project security, an administrator must manually verify your account before you can access the sales presentation.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 font-medium">
            Please notify your manager that you have registered.
          </div>

          <SignOutButton>
            <button className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 font-medium transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
        Safe Water CMS © 2026
      </p>
    </div>
  );
}