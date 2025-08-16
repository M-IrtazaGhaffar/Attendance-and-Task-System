// app/admin/viewattendancetoday/page.jsx
"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/app/axiosInstances";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function ViewAttendanceTodayPage() {
  const [attendance, setAttendance] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      const [presentRes, absentRes] = await Promise.all([
        adminApi.post("/getallattendancetoday"),
        adminApi.post("/getallabsentattendancetoday"),
      ]);

      if (presentRes.data.success) {
        setAttendance(presentRes.data.data || []);
        toast.success(presentRes.data.message || "Attendance retrieved successfully");
      } else {
        toast.error(presentRes.data.message || "Failed to fetch attendance");
      }

      if (absentRes.data.success) {
        setAbsent(absentRes.data.data || []);
      } else {
        toast.error(absentRes.data.message || "Failed to fetch absent records");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "text-green-400";
      case "ABSENT":
        return "text-red-400";
      case "LEAVE":
        return "text-yellow-400";
      default:
        return "";
    }
  };

  const renderPresentTable = (records) => (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl font-bold mb-2">Present / Leave Records</h2>
      {records.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">User ID</th>
              <th className="p-2 text-left">User Name</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{record.id}</td>
                <td className={`p-2 font-bold ${getStatusColor(record.status)}`}>
                  {record.status}
                </td>
                <td className="p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="p-2">{record.user.id}</td>
                <td className="p-2">{record.user.name}</td>
                <td className="p-2">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No attendance records found for today.</p>
      )}
    </div>
  );

  const renderAbsentTable = (records) => (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl font-bold mb-2">Absent Records</h2>
      {records.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{record.id}</td>
                <td className="p-2">{record.name}</td>
                <td className="p-2 text-red-400 font-bold">ABSENT</td>
                <td className="p-2">{record.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No absent records for today.</p>
      )}
    </div>
  );

  return (
    <div className="p-6 w-full">
      <div className="flex gap-4 items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Today's Attendance</h1>
        <Button onClick={fetchAttendanceData} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading attendance records...
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {renderPresentTable(attendance)}
          <Separator orientation="vertical" className="hidden md:block" />
          {renderAbsentTable(absent)}
        </div>
      )}
    </div>
  );
}
