'use client';

import React, { useEffect, useState } from "react";
import { adminApi, userApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function UpdateUserPage() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const api = Cookies.get("role") === "USER" ? userApi : adminApi
                const res = await api.post("/getUser");
                if (res.data && res.data.data) {
                    const { name, phone, address, image } = res.data.data;
                    setForm({ name: name || "", phone: phone || "", address: address || "", image: image || "" });
                    setImagePreview(image || "");
                }
            } catch {
                toast.error("Failed to fetch user data");
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setForm({ ...form, image: "" });
            setImagePreview("");
            return;
        }
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size should be less than 10MB");
            return;
        }
        // Check file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setForm({ ...form, image: base64String });
            setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const api = Cookies.get("role") === "USER" ? userApi : adminApi
            const res = await api.post("/update", form);
            if (res.data.success) {
                router.refresh(); // refresh the whole app/page after update
                toast(
                    <span style={{ color: 'black', fontWeight: 'bold' }}>
                        User updated successfully
                    </span>
                    ,
                    {
                        description: (
                            <span style={{ color: 'black' }}>
                                Please refresh the page to see changes
                            </span>
                        ),
                        position: 'top-center',
                        duration: 3000,
                    }
                );


            } else {
                toast.error(res.data.message || "Failed to update user");
            }
        } catch {
            toast.error("Error updating user");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex gap-2 items-center justify-center w-full h-[97vh]">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                Processing...
            </div>
        );
    }

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="bg-transparent border border-gray-300"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        type="text"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="bg-transparent border border-gray-300"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        type="text"
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="bg-transparent border border-gray-300"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Profile Image</Label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="mt-2 w-24 h-24 rounded-lg object-cover border border-gray-300"
                        />
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Profile"}
                </Button>
            </form>
        </div>
    );
}
