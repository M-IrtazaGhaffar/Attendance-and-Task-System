"use client";

import MarkAttendance from '@/components/app/MarkAttendance'
import React from 'react'
import GetTasks from "@/components/app/GetTasks";
import Leave from "@/components/app/Leave";

function page() {
  return (
    <div className="mt-8 text-gray-500 flex flex-col gap-8 w-full h-full">
      <MarkAttendance />
      <Leave />
      <GetTasks />
    </div>
  )
}

export default page