'use client';

import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { adminApi, userApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const api = Cookies.get("role") === "ADMIN" ? adminApi : userApi;

  const handleGetAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.post("/getattendance");
      setAttendance(res.data.data);
      if (res.data.success) {
        toast.success("Fetched attendance records successfully");
      }
    } catch (error) {
      toast.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAttendance();
  }, []);

  const refreshPage = () => {
    setAttendance([]);
    handleGetAttendance();
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header + Refresh */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Attendance Records</p>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshPage}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Table */}
      <Table className='min-w-full'>
        <TableCaption>List of all attendance records.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User UUID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.length > 0 ? (
            attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.user.uuid}</TableCell>
                <TableCell>{record.user.name}</TableCell>
                <TableCell className={`font-bold ${record.status === "PRESENT"
                    ? "text-green-600"
                    : record.status === "ABSENT"
                      ? "text-red-600"
                      : record.status === "LEAVE"
                        ? "text-yellow-600"
                        : ""
                  }`}>
                  {record.status}
                </TableCell>
                <TableCell>
                  {new Date(record.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No attendance records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AttendancePage;
