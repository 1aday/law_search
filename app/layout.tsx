import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CaseQuery – Supreme Court Research',
  description: 'Ask questions about Supreme Court cases and get instant insights on holdings, dissents, and precedents.',
  openGraph: {
    title: 'CaseQuery – Supreme Court Research',
    description: 'Ask questions about Supreme Court cases and get instant insights on holdings, dissents, and precedents.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CaseQuery',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#dc2626',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {assistantId ? children : <Warnings />}
      </body>
    </html>
  );
}
