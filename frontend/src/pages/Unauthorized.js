import { useAuth } from "../utils/authContext";

const UnauthorizedPage = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-red-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-red-700 mb-2">Access Denied (403)</h1>
      <p className="text-gray-600 text-center">
        You are authenticated as <span className="font-semibold">{useAuth().user.role}</span>, but you do not have permission to view this page.
      </p>
      <a href="/home" className="mt-6 text-indigo-600 hover:underline">Go to Home</a>
    </div>
);

export default UnauthorizedPage;