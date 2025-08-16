// app/admin/getallusers/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/app/axiosInstances";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GetAllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await adminApi.post("/getallusers");

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch users");
      }

      setUsers(res.data.data || []);
      toast.success("Users retrieved successfully.");
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && users.length === 0) {
    return (
      <div className="flex gap-2 items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        Processing...
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <div className="mb-4">
        <Button onClick={fetchUsers} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Refreshing
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {users.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">UUID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-5 cursor-pointer" onClick={() => router.push(`/admin/allusers/${u.id}`)}>
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.uuid}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
