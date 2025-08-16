'use client';

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CheckCircle, ClipboardCheck, Loader2, RefreshCw } from "lucide-react";
import { adminApi, userApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function MarkAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const api = Cookies.get("role") === "ADMIN" ? adminApi : userApi;

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.post("/markattendance");
      setAttendance(res.data.data);
      toast.success("Attendance marked successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAttendanceToday = async () => {
    setLoading(true);
    try {
      const res = await api.post("/getattendancetoday");
      setAttendance(res.data.data);
      if (res.data.success) {
        toast.success("Fetched attendance for today successfully");
      }
    } catch (error) {
      toast.error("Failed to fetch attendance for today");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAttendanceToday();
  }, []);

  const refreshPage = () => {
    setAttendance([]);
    handleGetAttendanceToday();
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Mark Attendance for today</p>
      <div className="flex gap-2 items-center">
        <Button
          type="button"
          size="lg"
          className="w-fit"
          disabled={loading || attendance.length > 0}
          onClick={handleMarkAttendance}
        >
          {loading ? (
            <div className="flex gap-2 items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              Processing...
            </div>
          ) : attendance.length > 0 ? (
            <div className="flex gap-2 items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
              Attendance Marked
            </div>
          ) : (
            <div className="flex gap-2 items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-white" />
              Mark Attendance
            </div>
          )}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={refreshPage}
          disabled={loading}
          className="flex items-center gap-2"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </Button>
      </div>
    </div>
  );
}

export default MarkAttendance;
