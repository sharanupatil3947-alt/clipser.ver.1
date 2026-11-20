import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "Clipser - AI Video Repurposing & Viral Shorts Platform",
  description: "Turn long-form videos into viral vertical clips with AI face tracking, dynamic captions, and CRM synchronization with zero recurring costs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08080a] text-gray-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
