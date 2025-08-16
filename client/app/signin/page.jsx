"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi } from "../axiosInstances";

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authApi.post("/signin", form);

            const data = res.data;

            toast.success("Login successful");
            Cookies.set("token", data.data.token, { expires: 7 });
            Cookies.set("role", data.data.role, { expires: 7 });
            Cookies.set("id", data.data.id, { expires: 7 });
            Cookies.set("name", data.data.name, { expires: 7 });
            Cookies.set("email", data.data.email, { expires: 7 });

            if (data.data.role === "ADMIN") router.push("/admin/");
            if (data.data.role === "USER") router.push("/user/");
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Invalid credentials");
            } else {
                toast.error("Failed to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg border border-gray-300 bg-white">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center">
                        <Lock className="w-12 h-12 text-gray-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Attendance System Login
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Sign in to access your dashboard
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={form.password} onChange={handleChange} required />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3 py-4">
                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                        <p className="text-sm text-center text-gray-500">
                            Don’t have an account?{" "}
                            <Link href="/signup" className="text-black hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
