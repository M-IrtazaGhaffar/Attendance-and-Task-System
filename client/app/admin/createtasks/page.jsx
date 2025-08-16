'use client';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function CreateTaskPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const res = await adminApi.post("/getallusers");
                setUsers(res.data.data);
            } catch (error) {
                toast.error("Failed to fetch users");
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await adminApi.post("/createtask", {
                title,
                description,
                dueDate,
                userId
            });
            toast.success(res.data.message);
            setTitle("");
            setDescription("");
            setDueDate("");
            setUserId("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex w-full items-center justify-center p-6">
            <form
                onSubmit={handleCreateTask}
                className="w-full space-y-4"
            >
                <h1 className="text-2xl font-bold">Create Task</h1>

                <div>
                    <label className="block text-sm">Title</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Description</label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        className="resize-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Due Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={`w-full border border-input rounded-md px-3 py-2 text-left ${!dueDate ? "text-muted-foreground" : ""
                                    }`}
                            >
                                {dueDate ? format(dueDate, "PPP") : "Select date"}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={setDueDate}
                                disabled={(dueDate) => dueDate < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="max-w-xs">
                    <label className="block text-sm">Assign to User</label>
                    {loadingUsers ? (
                        <p className="text-sm text-gray-500">Loading users...</p>
                    ) : (
                        <Select value={userId} onValueChange={setUserId}>
                            <SelectTrigger className="w-[250px]">
                                {/* Only display ID here */}
                                <SelectValue placeholder="Select a user">
                                    {userId && `ID (${userId})`}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        <div className="flex flex-col w-full">
                                            <strong>ID ({user.id})</strong>
                                            <strong>ROLE ({user.role})</strong>
                                            <p>{user.name}</p>
                                            <p>{user.email}</p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-fit"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...
                        </>
                    ) : (
                        "Create Task"
                    )}
                </Button>

            </form>
        </main>
    );
}
