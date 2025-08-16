'use client'
import { adminApi, userApi } from '@/app/axiosInstances';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function page() {
    const { id } = useParams()
    const [Loading, setLoading] = useState(true)
    const [Data, setData] = useState([])
    const [Comment, setComment] = useState('')

    const getTaskbyId = async () => {
        try {
            setLoading(true)
            const res = await adminApi.post('/gettaskbyid', {
                id: id
            })
            setData(res.data.data)
            toast.success(res.data.message)
        } catch (error) {
            toast.error("Some Error Occured")
        } finally {
            setLoading(false)
        }
    }

    const approveTask = async () => {
        try {
            const res = await adminApi.post('/approvetask', {
                taskId: id,
                adminComment: Comment
            })
            if (res?.status == 200) {
                toast.success(res?.data?.message)
                setComment('')
            }
        } catch (error) {
            toast.error(error?.response?.message)
        }
    }

    const rejectTask = async () => {
        try {
            const res = await adminApi.post('/rejecttask', {
                taskId: id,
                adminComment: Comment
            })
            if (res?.status == 200) {
                toast.success(res?.data?.message)
                setComment('')
            }
        } catch (error) {
            toast.error(error?.response?.message)
        }
    }

    useEffect(() => {
        getTaskbyId()
    }, [])

    if (Loading) return <div className="flex gap-2 items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        Processing...
    </div>

    return (
        <div className="w-full">
            <div className="flex-1 w-full space-y-4">
                <div className="p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">ID: {Data.id}</p>
                    <p className="text-xs text-muted-foreground break-all">UUID: {Data.uuid}</p>
                    <p className="text-sm text-muted-foreground">{Data.date}</p>
                    <br />
                    <h3 className="text-lg font-semibold">{Data.title}</h3>
                    <p className="text-sm">{Data.description}</p>
                    <br />
                    <p className="text-sm">Due Date ({Data.dueDate.split('T')[0]})</p>
                    <br />
                    <p className={`text-sm font-bold ${Data.status === 'PENDING' ? 'text-yellow-400' : Data.status === 'APPROVED' ? 'text-green-400' : Data.status === 'REJECTED' ? 'text-red-400' : ''}`}>{Data.status}</p>
                    <p className="text-xs text-muted-foreground">Admin Comment: {Data.adminComment || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Submit Comment: {Data.submitComment || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Submited At: {Data.submittedAt ? new Date(Data.submittedAt).toLocaleString() : 'N/A'}</p>
                    <br />
                    <p className="text-xs text-muted-foreground">Created At: {new Date(Data.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Updated At: {new Date(Data.updatedAt).toLocaleString()}</p>
                </div>
                <Textarea className='h-52 resize-none' value={Comment} onChange={(e) => { setComment(e.target.value) }} />
                <div className='flex gap-2'>
                    <Button className='text-white cursor-pointer hover:bg-green-800 bg-green-700' onClick={approveTask}>Approve Task</Button>
                    <Button className='text-white cursor-pointer hover:bg-red-800 bg-red-700' onClick={rejectTask}>Reject Task</Button>
                </div>
            </div>
        </div>
    )
}

export default page