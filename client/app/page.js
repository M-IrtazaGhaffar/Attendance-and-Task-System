import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Page() {
  return (
    <div className='text-center w-full h-[97vh] flex flex-col gap-10 items-center justify-center p-6'>
      
      {/* Title */}
      <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>
        Welcome to <br /> <span className='font-extrabold text-6xl'>Attendance & Task App</span>
      </h1>

      {/* Description */}
      <p className='text-lg md:text-xl max-w-xl text-gray-600 leading-relaxed'>
        Manage your daily tasks, track attendance effortlessly, and stay organized.
        Whether you’re a teacher, student, or admin — we’ve got you covered.
      </p>

      {/* Buttons */}
      <div className='flex flex-col sm:flex-row gap-6 mt-4'>
        <Link href='/signin'>
          <Button
            className='px-6 py-3 text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200'
          >
            Have an Account
          </Button>
        </Link>
        <Link href='/signup'>
          <Button
            variant='outline'
            className='px-6 py-3 text-lg border-2 hover:bg-blue-50 hover:scale-105 transition-all duration-200'
          >
            Not Registered
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Page
