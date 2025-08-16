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
    const [SubmitData, setSubmitData] = useState('')
    const router = useRouter()

    const getTaskbyId = async () => {
        try {
            setLoading(true)
            const api = Cookies.get('role') === 'USER' ? userApi : adminApi
            const res = await api.post('/gettaskbyidanduserid', {
                id: id
            })
            const x = res.data.data;
            Data.push(x[0])

            if (Data.length === 0) {
                toast.success("Please don't view others tasks!")
                try {
                    // Cookies.remove("token")
                    // Cookies.remove("role");
                    // Cookies.remove("id");
                    // Cookies.remove("name");
                    // Cookies.remove("email");
                    // toast.success("Signed out successfully");
                    // router.push('/signin');
                } catch (error) {
                    toast.error("Failed to sign out");
                }
            }
            else toast.success(res.data.message)
        } catch (error) {
            toast.error("Some Error Occured")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const api = Cookies.get('role') === 'USER' ? userApi : adminApi
            const res = await api.post('/submittask', {
                taskId: id,
                submitComment: SubmitData
            })
            setData(res.data.data)
            toast.success(res.data.message)
        } catch (error) {
            toast.error("Some Error Occured")
        } finally {
            setLoading(false)
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
        <div className="space-y-10 w-full">
            <div className="flex-1 w-full">
                <div className="p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">ID: {Data[0].id}</p>
                    <p className="text-xs text-muted-foreground break-all">UUID: {Data[0].uuid}</p>
                    <p className="text-sm text-muted-foreground">{Data[0].date}</p>
                    <br />
                    <h3 className="text-lg font-semibold">{Data[0].title}</h3>
                    <p className="text-sm">{Data[0].description}</p>
                    <br />
                    <p className="text-sm">Due Date ({Data[0].dueDate.split('T')[0]})</p>
                    <br />
                    <p className={`text-sm font-bold ${Data[0].status === 'PENDING' ? 'text-yellow-400' : Data.status === 'APPROVED' ? 'text-green-400' : Data.status === 'REJECTED' ? 'text-red-400' : ''}`}>{Data[0].status}</p>
                    <p className="text-xs text-muted-foreground">Admin Comment: {Data[0].adminComment || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Submit Comment: {Data[0].submitComment || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Submited At: {Data[0].submittedAt ? new Date(Data.submittedAt).toLocaleString() : 'N/A'}</p>
                    <br />
                    <p className="text-xs text-muted-foreground">Created At: {new Date(Data[0].createdAt).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Updated At: {new Date(Data[0].updatedAt).toLocaleString()}</p>
                </div>
            </div>
            <form className='space-y-1'>
                <Textarea value={SubmitData} onChange={(e) => { setSubmitData(e.target.value) }} type='text' placeholder="Please describe your task and workflow." className={'h-72 resize-none'} />
                <div className='flex gap-1 '>
                    <Button onClick={handleSubmit}>Submit Task</Button>
                    <Button onClick={() => { setSubmitData('') }}>Reset</Button>
                </div>
            </form>
        </div>
    )
}

export default page