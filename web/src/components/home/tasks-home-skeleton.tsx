import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function TasksHomeSkeleton() {
  return (
    <div className='flex flex-col gap-2'>
        <Skeleton className='h-[50px] w-[300px]' />
        <Skeleton className='h-[50px] w-[300px]' />
        <Skeleton className='h-[50px] w-[300px]' />
    </div>
  )
}
