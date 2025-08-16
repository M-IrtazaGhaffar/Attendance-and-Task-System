"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "../axiosInstances";

export default function SignUpPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setForm({ ...form, image: "" });
            setImagePreview("");
            return;
        }
        // Check file size (limit to 5MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size should be less than 10MB");
            return;
        }
        // Check file type
        if (!file.type.startsWith('image/')) {
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
            const res = await authApi.post("/signup", form);

            if (res.status === 200) {
                toast.success("Account created successfully!");
                setForm({
                    name: "",
                    email: "",
                    password: "",
                    address: "",
                    phone: "",
                    image: ""
                });
                setImagePreview("");
                router.push("/signin");
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Failed to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-lg shadow-lg border border-gray-300 bg-white">
                <CardHeader className="text-center space-y-2 mt-4">
                    <div className="flex justify-center">
                        <UserPlus className="w-12 h-12" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Create an Account
                    </CardTitle>
                    <CardDescription>
                        Sign up to start using the Attendance System
                    </CardDescription>
                </CardHeader>

                <div onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                            <Input
                                id="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                            <Input
                                id="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-gray-700 font-medium">Profile Image (Must be Lower then 10MB)</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className=""
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3 p-6">
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing up...
                                </span>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                        <p className="text-sm text-center text-gray-500">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-black hover:text-gray-700 hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
}