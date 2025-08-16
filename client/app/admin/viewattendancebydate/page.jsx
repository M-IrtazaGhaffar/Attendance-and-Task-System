// app/admin/viewattendancebydate/page.jsx
"use client";

import { useState } from "react";
import { adminApi } from "@/app/axiosInstances";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function ViewAttendanceByDatePage() {
  const [date, setDate] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [absentList, setAbsentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    try {
      setLoading(true);
      const formattedDate = format(date, "yyyy-MM-dd");

      // Fetch all attendance records
      const [attendanceRes, absentRes] = await Promise.all([
        adminApi.post("/getallattendancebydate", { date: formattedDate }),
        adminApi.post("/getallabsentattendancebydate", { date: formattedDate }),
      ]);

      if (attendanceRes.data.success) {
        setAttendance(attendanceRes.data.data || []);
      } else {
        toast.error(attendanceRes.data.message || "Failed to fetch attendance");
      }

      if (absentRes.data.success) {
        setAbsentList(absentRes.data.data || []);
      } else {
        toast.error(absentRes.data.message || "Failed to fetch absent list");
      }

      toast.success("Records retrieved successfully");
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "PRESENT") return "text-green-400";
    if (status === "LEAVE") return "text-yellow-400";
    if (status === "ABSENT") return "text-red-400";
    return "";
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">View Attendance by Date</h1>

      <div className="flex gap-4 mb-6">
        {/* DatePicker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button onClick={fetchData} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Search
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading records...
        </div>
      ) : (
        <>
          {/* All Attendance Records */}
          <h2 className="text-lg font-semibold mb-2">Attendance Records</h2>
          {attendance.length > 0 ? (
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">User ID</th>
                  <th className="p-2 text-left">User Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
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
                    <td className="p-2">{record.user.email}</td>
                    <td className="p-2">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mb-6">No attendance records found for this date.</p>
          )}

          {/* Absent Records */}
          <h2 className="text-lg font-semibold mb-2">Absent Users</h2>
          {absentList.length > 0 ? (
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {absentList.map((record) => (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{record.id}</td>
                    <td className="p-2 text-red-400 font-bold">{record.name}</td>
                    <td className="p-2">{record.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No absent records found for this date.</p>
          )}
        </>
      )}
    </div>
  );
}
