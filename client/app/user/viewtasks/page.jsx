'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, Loader2 } from "lucide-react";
import { userApi } from "@/app/axiosInstances";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Cookies from "js-cookie";

export default function GetTasks() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = Cookies.get('role') === 'USER' ? 'user' : 'admin'

  const fetchTasks = async () => {
    try {
      const res = await userApi.post("/gettasks");
      if (res.data && res.data.data) {
        setEvents(res.data.data);
      } else {
        toast.error("No tasks found");
      }
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        Processing...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] w-full">
        No tasks to show
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <p>Here are all of your tasks assigned to you.</p>
      <ScrollArea className="h-[750px] w-full p-4 border rounded-2xl shadow-2xl">
      <div className="flex flex-col gap-6 p-4 w-full">
        {events.map((event, i) => (
          <Link href={`/${role}/viewtasks/${event.id}`}  key={event.uuid || event.id || i} className="flex gap-4 w-full">
            {/* Timeline marker */}
            <div className="flex flex-col items-center flex-shrink-0">
              <Circle className="w-4 h-4 text-primary" />
              {i !== events.length - 1 && (
                <div className="flex-1 w-px bg-muted mt-1" />
              )}
            </div>
            {/* Timeline card */}
            <Card className="flex-1 w-full">
              <CardContent className="p-4 space-y-1">
                <p className="text-xs text-muted-foreground">ID: {event.id}</p>
                <p className="text-xs text-muted-foreground break-all">UUID: {event.uuid}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm">{event.description}</p>
                <p className="text-sm">Due Date ({event.dueDate.split('T')[0]})</p>
                <p className={`text-sm font-bold ${event.status === 'PENDING' ? 'text-yellow-400' : event.status === 'APPROVED' ? 'text-green-400' : event.status === 'REJECTED' ? 'text-red-400' : ''}`}>{event.status}</p>
                <p className="text-xs text-muted-foreground">Admin Comment: {event.adminComment || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Submit Comment: {event.submitComment || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Submited At: {event.submittedAt || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Created At: {new Date(event.createdAt).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Updated At: {new Date(event.updatedAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </ScrollArea>
    </div>
  );
}
