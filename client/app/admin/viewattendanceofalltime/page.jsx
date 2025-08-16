// app/admin/attendance/all-time/page.jsx
"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AllTimeAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    try {
      setLoading(true);
      const res = await adminApi.post("/getattendanceofalltime");

      if (res.data.success && res.data.data?.length > 0) {
        setRecords(res.data.data);
        toast.success(res.data.message || "Attendance records retrieved");
      } else {
        setRecords([]);
        toast.error(res.data.message || "No attendance records found");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching attendance records");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "text-green-400";
      case "ABSENT":
        return "text-red-400";
      case "LEAVE":
        return "text-yellow-400";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">All-Time Attendance Records</h1>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      ) : records.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">User Name</th>
              <th className="p-2 text-left">User UUID</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{rec.id}</td>
                <td className="p-2">{rec.user?.name || "N/A"}</td>
                <td className="p-2">{rec.user?.uuid || "N/A"}</td>
                <td className="p-2">
                  {new Date(rec.date).toLocaleDateString()}
                </td>
                <td
                  className={`p-2 font-semibold ${getStatusColor(rec.status)}`}
                >
                  {rec.status}
                </td>
                <td className="p-2">
                  {new Date(rec.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  {new Date(rec.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No attendance records found.</p>
      )}

      <Separator className="mt-6" />
    </div>
  );
}
