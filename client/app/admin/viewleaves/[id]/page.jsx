// app/admin/getleaverequestbyuserid/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/app/axiosInstances";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function GetLeaveRequestByUserIdPage() {
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedAction, setSelectedAction] = useState({});
    const [adminComments, setAdminComments] = useState({});
    const [updatingId, setUpdatingId] = useState(null);

    const getStatusColor = (status) => {
        if (status === "PENDING") return "text-yellow-400";
        if (status === "APPROVED") return "text-green-400";
        if (status === "REJECTED") return "text-red-400";
        return "";
    };

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const res = await adminApi.post("/getleaverequestbyid", {
                id: Number(id),
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

    const handleUpdateStatus = async (reqId) => {
        if (!selectedAction[reqId]) {
            toast.error("Please select an action first");
            return;
        }
        setUpdatingId(reqId);
        try {
            const endpoint =
                selectedAction[reqId] === "APPROVED"
                    ? "/approveleaverequest"
                    : "/rejectleaverequest";

            const res = await adminApi.post(endpoint, {
                id: String(reqId),
                adminComment: adminComments[reqId] || "",
            });

            if (res.data.success) {
                toast.success(res.data.message || "Leave request updated successfully");
                setLeaveRequests((prev) =>
                    prev.map((req) =>
                        req.id === reqId
                            ? {
                                ...req,
                                status: selectedAction[reqId],
                                adminComment: adminComments[reqId] || "",
                            }
                            : req
                    )
                );
                setSelectedAction((prev) => ({ ...prev, [reqId]: "" }));
                setAdminComments((prev) => ({ ...prev, [reqId]: "" }));
            } else {
                toast.error(res.data.message || "Failed to update leave request");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating leave request");
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        if (id) fetchLeaveRequests();
    }, [id]);

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">
                Leave Requests for ID: {id}
            </h1>

            {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading leave requests...
                </div>
            ) : leaveRequests.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {leaveRequests.map((leaveRequest) => (
                        <div
                            key={leaveRequest.id}
                            className="space-y-2"
                        >
                            <p className="flex justify-between">
                                <strong>ID:</strong> {leaveRequest.id}
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>UUID:</strong> {leaveRequest.uuid}
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>User Name:</strong> {leaveRequest.user.name}
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>Email:</strong> {leaveRequest.user.email}
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>Date:</strong>{" "}
                                {new Date(leaveRequest.date).toLocaleDateString()}
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>Reason:</strong> {leaveRequest.reason}
                            </p>
                            <Separator />
                            <p className={`flex justify-between`}>
                                <strong>Status:</strong>{" "}
                                <strong className={getStatusColor(leaveRequest.status)}>
                                    {leaveRequest.status}
                                </strong>
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>Admin Comment:</strong>{" "}
                                {leaveRequest.adminComment || "N/A"}
                            </p>
                            <Separator />
                            <p className="flex justify-between">
                                <strong>Created At:</strong>{" "}
                                {new Date(leaveRequest.createdAt).toLocaleString()}
                            </p>

                            {leaveRequest.status === "PENDING" && (
                                <div className="mt-4 space-y-3">
                                    <Select
                                        onValueChange={(value) =>
                                            setSelectedAction((prev) => ({
                                                ...prev,
                                                [leaveRequest.id]: value,
                                            }))
                                        }
                                        value={selectedAction[leaveRequest.id] || ""}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="APPROVED">Approve</SelectItem>
                                            <SelectItem value="REJECTED">Reject</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea
                                        placeholder="Write admin comment..."
                                        value={adminComments[leaveRequest.id] || ""}
                                        onChange={(e) =>
                                            setAdminComments((prev) => ({
                                                ...prev,
                                                [leaveRequest.id]: e.target.value,
                                            }))
                                        }
                                    />

                                    <Button
                                        onClick={() => handleUpdateStatus(leaveRequest.id)}
                                        disabled={updatingId === leaveRequest.id}
                                    >
                                        {updatingId === leaveRequest.id && (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        )}
                                        Submit
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No leave requests found.</p>
            )}
        </div>
    );
}
