import { Loader2 } from 'lucide-react'
import React from 'react'

function loading() {
    return (
        <div className="flex gap-2 items-center justify-center w-full h-[100vh]">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            Processing...
        </div>
    )
}

export default loading