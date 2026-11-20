"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadModal } from "@/components/UploadModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080a] text-gray-100 flex flex-col">
      <Navbar onOpenUpload={() => setUploadOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {children}
      </main>
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
