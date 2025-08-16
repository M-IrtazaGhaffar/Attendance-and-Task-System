"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { adminApi, userApi } from "@/app/axiosInstances";
import { Loader2 } from "lucide-react";

export default function UserLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = Cookies.get("role") === "USER" ? userApi : adminApi;

  async function fetchLeaves() {
    setLoading(true);
    try {
      const response = await api.post("/getuserleaverequest");

      if (response.status !== 200) throw new Error("Failed to fetch leaves");

      const data = response.data;
      if (data.success && data.data) {
        setLeaves(data.data);
      } else {
        throw new Error(data.message || "No leave data found");
      }
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center w-full h-[97vh]">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        Processing...
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Leave Requests</h1>

      {loading ? (
        <p>Loading leave requests...</p>
      ) : leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Reason</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Admin Comment</th>
                <th className="p-3 border-b">Requested At</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(({ id, uuid, date, reason, status, adminComment, createdAt }) => (
                <tr key={uuid} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{id}</td>
                  <td className="p-3 border-b">{new Date(date).toLocaleDateString()}</td>
                  <td className="p-3 border-b">{reason}</td>
                  <td
                    className={`p-3 border-b font-bold ${status === "PENDING"
                      ? "text-yellow-400"
                      : status === "APPROVED"
                        ? "text-green-400"
                        : status === "REJECTED"
                          ? "text-red-400"
                          : ""
                      }`}
                  >
                    {status}
                  </td>

                  <td className="p-3 border-b">{adminComment || "N/A"}</td>
                  <td className="p-3 border-b">{new Date(createdAt).toLocaleDateString()}{" "}{new Date(createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
