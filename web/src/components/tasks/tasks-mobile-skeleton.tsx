import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function TasksMobileSkeleton() {
  return (
    <div className='grid gap-3'>
        <Skeleton className='w-[300px] h-[100px]'/>
        <Skeleton className='w-[300px] h-[100px]'/>
        <Skeleton className='w-[300px] h-[100px]'/>
    </div>
  )
}
