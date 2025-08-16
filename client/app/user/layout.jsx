"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { adminApi, userApi } from "../axiosInstances";
import Image from "next/image";
import { FileStack, Handshake, Hash, LayoutDashboard, ListTodo, Loader2, LogOut, Mail, MapPin, Phone, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function layout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const api = Cookies.get("role") === "ADMIN" ? adminApi : userApi;

    const handleSignOut = async () => {
        try {
            Cookies.remove("token")
            Cookies.remove("role");
            Cookies.remove("id");
            Cookies.remove("name");
            Cookies.remove("email");
            toast.success("Signed out successfully");
            router.push('/signin');
        } catch (error) {
            toast.error("Failed to sign out");
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.post("/getUser");
                setUser(res.data.data);
            } catch (error) {
                toast.error("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex gap-2 items-center justify-center w-full h-[97vh]">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                Processing...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                No user data found
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 gap-6">
            {/* LEFT SIDEBAR - Small Profile Card */}
            <div className="w-[300px] flex-shrink-0">
                <Card className="shadow-xl border-0 bg-white relative overflow-hidden">
                    <CardHeader className="flex flex-col items-center space-y-4 p-4 relative z-10">
                        {/* Profile Image */}
                        <div className="relative">
                            {
                                user.image ?
                                    <div className="h-full rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white">
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

                        {/* User Name + Role */}
                        <div className="flex items-center text-center gap-2">
                            <CardTitle className="text-lg font-bold text-gray-900">
                                {user.name}
                            </CardTitle>
                            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {user.role}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 px-4 pb-4">
                        {/* UUID */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                <Hash className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">ID</p>
                                <p className="text-gray-900 font-medium">{user.id}</p>
                            </div>
                        </div>

                        {/* UUID */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                <Handshake className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">UUID</p>
                                <p className="text-gray-900 font-medium">{user.uuid}</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                <Mail className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
                                <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                <MapPin className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</p>
                                <p className="text-gray-900 font-medium leading-relaxed">{user.address}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                <Phone className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                                <p className="text-gray-900 font-medium">{user.phone}</p>
                            </div>
                        </div>
                    </CardContent>

                </Card>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                            <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
                            <p className="text-sm text-gray-500">Here’s what’s happening today</p>
                        </div>
                    </div>
                    <Button onClick={handleSignOut}><LogOut /> Sign Out</Button>
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed">
                    This is your user dashboard. Soon you’ll see charts, attendance logs, and other features here.
                </p>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <Link href='/user/'>
                        <Button className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md">
                            <LayoutDashboard />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href='/user/viewattendance'>
                        <Button className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md">
                            <FileStack />
                            View Attendance
                        </Button>
                    </Link>
                    <Link href='/user/viewtasks'>
                        <Button className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md">
                            <ListTodo />
                            View Tasks
                        </Button>
                    </Link>
                    <Link href='/user/settings'>
                        <Button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors border border-gray-200">
                            <Settings />
                            Settings
                        </Button>
                    </Link>
                </div>

                <div className="mt-6 flex gap-3">
                    {children}
                </div>

            </div>

        </div>
    );
}
