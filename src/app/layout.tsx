import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Wowdemy",
  description: "Learning management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClerkProvider>
        <html lang='en'>
          <body className='antialiased'>
            <Toaster />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
