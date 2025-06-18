import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-screen min-w-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </>
  );
}
