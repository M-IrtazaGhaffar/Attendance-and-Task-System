// app/admin/viewleaverequests/page.jsx
"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/app/axiosInstances";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ViewLeaveRequestsPage() {
    const router = useRouter()
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    if (status === "PENDING") return "text-yellow-400";
    if (status === "APPROVED") return "text-green-400";
    if (status === "REJECTED") return "text-red-400";
    return "";
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.post("/getallleaverequests");

      if (res.data.success) {
        setLeaveRequests(res.data.data || []);
        toast.success("Leave requests retrieved successfully");
      } else {
        toast.error(res.data.message || "Failed to retrieve leave requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while fetching leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading leave requests...
        </div>
      ) : leaveRequests.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id} className="border-t hover:bg-gray-50" onClick={()=> { router.push(`/admin/viewleaves/${request.id}`)}}>
                <td className="p-2">{request.id}</td>
                <td className="p-2">{request.user.name}</td>
                <td className="p-2">
                  {new Date(request.date).toLocaleDateString()}
                </td>
                <td
                  className={`p-2 font-bold ${getStatusColor(request.status)}`}
                >
                  {request.status}
                </td>
                <td className="p-2">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No leave requests found.</p>
      )}
    </div>
  );
}
