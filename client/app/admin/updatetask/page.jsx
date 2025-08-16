"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { adminApi } from "@/app/axiosInstances";

export default function UpdateTask() {
    const [taskId, setTaskId] = useState("");
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);

    // users
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const [userId, setUserId] = useState("");

    // Fetch Task by ID
    const fetchTask = async () => {
        if (!taskId.trim()) return toast.error("Please enter a Task ID");
        setLoading(true);
        try {
            const res = await adminApi.post(`/gettaskbyid`, { id: taskId });
            const t = res.data?.data;

            if (t.length === 0) {
                toast.error("No Task was found!")
            } else {
                setTask(t);
                setTitle(t.title || "");
                setDescription(t.description || "");
                setDueDate(t.dueDate ? new Date(t.dueDate) : null);
                setUserId(String(t.userId || ""));
            }
        } catch (err) {
            toast.error("Task not found!");
        } finally {
            setLoading(false);
        }
    };

    // Update Task
    const updateTask = async (e) => {
        e.preventDefault();
        if (!task) return toast.error("No task loaded to update");

        try {
            await adminApi.post(`/updatetask`, {
                id: taskId,
                title,
                description,
                dueDate,
                userId,
            });

            toast.success("Task updated successfully!");
        } catch (err) {
            toast.error("Failed to update task!");
        }
    };

    // Fetch users for dropdown
    useEffect(() => {
        const getUsers = async () => {
            setLoadingUsers(true);
            try {
                // use same endpoint as CreateTaskPage
                const res = await adminApi.post(`/getallusers`);
                setUsers(res.data?.data || []);
            } catch {
                toast.error("Failed to fetch users");
            } finally {
                setLoadingUsers(false);
            }
        };
        getUsers();
    }, []);

    return (
        <div className="p-4 space-y-6 w-full">
            {/* Step 1: Enter Task ID */}
            <div className="mb-4 flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter Task ID"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                />
                <Button onClick={fetchTask} disabled={loading}>
                    {loading ? "Fetching..." : "Fetch Task"}
                </Button>
            </div>

            {/* Step 2: Show update form if task is loaded */}
            {task && (
                <form onSubmit={updateTask} className="w-full space-y-4 mt-10">
                    <h1 className="text-2xl font-bold">Update Task</h1>
                    <p className="text-sm text-slate-600">You can Update Task after getting the detail here.</p>

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
                            className="h-52 resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm">Due Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={`w-full border rounded-md px-3 py-2 text-left ${!dueDate ? "text-muted-foreground" : ""
                                        }`}
                                >
                                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate || undefined}
                                    onSelect={setDueDate}
                                    disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
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

                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...
                            </>
                        ) : (
                            "Update Task"
                        )}
                    </Button>
                </form>
            )}
        </div>
    );
}
