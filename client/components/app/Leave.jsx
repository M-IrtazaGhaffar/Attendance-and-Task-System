import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Cookies from 'js-cookie'

function Leave() {
  const role = Cookies.get('role') === "USER" ? 'user' : 'admin'
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Have an Emergency! Need a Leave!</p>
      <div className='flex gap-2'>
        <Link href={`/${role}/leave`}>
        <Button variant='destructive'>
          Immediately Ask for Leave
        </Button>
      </Link>
      <Link href={`/${role}/leaverequest`}>
        <Button variant='destructive'>
          View Leaves
        </Button>
      </Link>
      </div>
    </div>
  )
}

export default Leave