"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { adminApi, userApi } from "@/app/axiosInstances";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function RequestLeavePage() {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const api = Cookies.get("role") === "USER" ? userApi : adminApi;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/requestleave", {
        reason,
        date: format(date, "yyyy-MM-dd"),
      });

      // Note: Axios response does not have .ok, so check status instead
      if (response.status !== 200) throw new Error("Failed to submit leave request");

      toast.success("Leave request submitted successfully!");
      setReason("");
      setDate(undefined);
    } catch (error) {
      toast.error(error.response.data.message || "Some Error Occured");
    } finally {
      setLoading(false);
    }
  }

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
      <h1 className="text-2xl font-semibold mb-6">Request Leave</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="date">Date of Leave</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`w-full border border-input rounded-md px-3 py-2 text-left ${
                  !date ? "text-muted-foreground" : ""
                }`}
              >
                {date ? format(date, "PPP") : "Select date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for leave"
            required
            className="h-36 resize-none"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}
