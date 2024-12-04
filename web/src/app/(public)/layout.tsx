import Navbar from '@/components/navbar/navbar';
import React from 'react'

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}
