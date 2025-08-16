// app/admin/attendance/by-user/page.jsx
"use client";

import { useState } from "react";
import { adminApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AttendanceByUserPage() {
  const [userId, setUserId] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    if (!userId) {
      toast.error("Please enter a user ID");
      return;
    }

    try {
      setLoading(true);
      const res = await adminApi.post("/getattendancebyuserid", {
        userId: parseInt(userId),
      });

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
      <h1 className="text-2xl font-bold mb-4">Get Attendance by User ID</h1>

      <div className="flex items-center gap-2 mb-4">
        <Input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button onClick={fetchAttendance} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Search
        </Button>
      </div>

      {records.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">UUID</th>
              <th className="p-2 text-left">User ID</th>
              <th className="p-2 text-left">User Name</th>
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
                <td className="p-2">{rec.uuid}</td>
                <td className="p-2">{rec.user?.id || "N/A"}</td>
                <td className="p-2">{rec.user?.name || "N/A"}</td>
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
        !loading && (
          <p className="text-gray-500">No attendance records found.</p>
        )
      )}
    </div>
  );
}
