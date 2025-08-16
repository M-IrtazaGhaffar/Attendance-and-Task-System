// app/allusers/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminApi } from "@/app/axiosInstances";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await adminApi.post("/getuserbyid", { id });

      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
        toast.error(res.data?.message || "User not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user details");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-gray-500">
        No user was found with ID {id}.
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between gap-10">
        <div>
          <h1 className="text-2xl font-bold mb-2">User Details</h1>
          <p className="text-gray-600 mb-4 w-96">
            This page displays detailed information about the selected user, including their profile data,
            contact details, and account metadata.
          </p>
        </div>
        {
          user.image ?
            <div className="w-72 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white">
              <Image
                src={user.image}
                alt={user.name}
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            </div>
            : <Image
              src="/user.png" // Put your image in the public folder: /public/welcome.png
              alt="Image"
              width={200}
              height={200}

              priority
            />
        }
      </div>
      <div className="space-y-2 pt-4">
        <p className="flex justify-between gap-10"><strong>ID:</strong> {user.id}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>UUID:</strong> {user.uuid}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Name:</strong> {user.name}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Email:</strong> {user.email}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Role:</strong> {user.role}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Address:</strong> {user.address}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Phone:</strong> {user.phone}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        <Separator />
        <p className="flex justify-between gap-10"><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
        <Separator />
      </div>
    </div>
  );
}
