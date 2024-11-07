import { type Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Simple and efficient task management application',
  authors: [
    {
      name: 'Yefrosynii Kolenko',
      url: 'https://www.yefro.dev',
    },
  ],
  creator: 'Yefrosynii Kolenko',
  publisher: 'Yefrosynii Kolenko',
  keywords: [
    'task manager',
    'project management',
    'productivity',
    'organization',
  ],
  metadataBase: new URL('https://tasks.yefro.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tasks.yefro.dev',
    title: 'Task Manager',
    description: 'Simple and efficient task management application',
    siteName: 'Task Manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Manager',
    description: 'Simple and efficient task management application',
    creator: '@efroostrf',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'antialiased')}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
