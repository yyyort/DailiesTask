import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function PinnedNotesSkeleton() {
  return (
    <div
        className='flex flex-row gap-4 p-4 overflow-auto'
    >
        <Skeleton className="h-[350px] w-[200px]" />
        <Skeleton className="h-[350px] w-[200px]" />
        <Skeleton className="h-[350px] w-[200px]" />
    </div>
  )
}
