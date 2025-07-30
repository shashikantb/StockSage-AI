import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import './globals.css';

export const metadata: Metadata = {
  title: 'StockSage AI',
  description: 'AI-powered stock analysis for informed decisions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen bg-background")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
