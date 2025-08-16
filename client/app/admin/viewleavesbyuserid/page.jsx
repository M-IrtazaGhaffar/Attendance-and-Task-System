// app/admin/getleaverequestbyuserid/page.jsx
"use client";

import { useState } from "react";
import { adminApi } from "@/app/axiosInstances";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GetLeaveRequestByUserIdPage() {
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);

    const getStatusColor = (status) => {
        if (status === "PENDING") return "text-yellow-400";
        if (status === "APPROVED") return "text-green-400";
        if (status === "REJECTED") return "text-red-400";
        return "";
    };

    const fetchLeaveRequests = async () => {
        if (!userId.trim()) {
            toast.error("Please enter a User ID");
            return;
        }

        try {
            setLoading(true);
            const res = await adminApi.post("/getleaverequestbyuserid", {
                userId: Number(userId),
            });

            if (res.data.success) {
                setLeaveRequests(res.data.data || []);
                toast.success(res.data.message || "Leave requests retrieved successfully");
            } else {
                setLeaveRequests([]);
                toast.error(res.data.message || "No leave requests found");
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred while fetching leave requests");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Get Leave Requests by User ID</h1>

            {/* Input Section */}
            <div className="flex gap-2 mb-6">
                <input
                    type="number"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-48"
                />
                <Button onClick={fetchLeaveRequests} disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Search
                </Button>
            </div>

            {/* Results Table */}
            {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading leave requests...
                </div>
            ) : leaveRequests.length > 0 ? (
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">User</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Reason</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Admin Comment</th>
                            <th className="p-2 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map((req) => (
                            <tr key={req.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{req.id}</td>
                                <td className="p-2">{req.user.name}</td>
                                <td className="p-2">{req.user.email}</td>
                                <td className="p-2">
                                    {new Date(req.date).toLocaleDateString()}
                                </td>
                                <td className="p-2">{req.reason}</td>
                                <td className={`p-2 font-bold ${getStatusColor(req.status)}`}>
                                    {req.status}
                                </td>
                                <td className="p-2">{req.adminComment || "N/A"}</td>
                                <td className="p-2">
                                    {new Date(req.createdAt).toLocaleString()}
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
