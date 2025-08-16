"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/app/axiosInstances";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AttendanceDetailPage() {
    const { id } = useParams();
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAttendance = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const res = await adminApi.post("/getattendancebyid", { id: parseInt(id) });

            if (res.data.success && res.data.data) {
                setAttendance(res.data.data);
                toast.success(res.data.message || "Attendance record retrieved");
            } else {
                setAttendance(null);
                toast.error(res.data.message || "No attendance record found");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while fetching attendance record");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 h-full">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading attendance...
            </div>
        );
    }

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
            <div className="flex items-center gap-6 mb-4">
                <h1 className="text-2xl font-bold">Attendance Detail</h1>
                <Button onClick={fetchAttendance} disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Refresh
                </Button>
            </div>

            {attendance ? (
                <div className="space-y-2">
                    <p className="flex gap-10 items-center justify-between" ><strong>ID:</strong> {attendance.id}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>UUID:</strong> {attendance.uuid}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>Date:</strong> {new Date(attendance.date).toLocaleDateString()}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>Status:</strong> <strong className={getStatusColor(attendance.status)}> {attendance.status} </strong></p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>User ID:</strong> {attendance.user.id}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>User UUID:</strong> {attendance.user.uuid}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>User Name:</strong> {attendance.user.name}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>Created At:</strong> {new Date(attendance.createdAt).toLocaleString()}</p>
                    <Separator />
                    <p className="flex gap-10 items-center justify-between" ><strong>Updated At:</strong> {new Date(attendance.updatedAt).toLocaleString()}</p>
                </div>
            ) : (
                <p className="text-gray-500">No attendance record found.</p>
            )}
        </div>
    );
}
