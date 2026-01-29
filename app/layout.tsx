import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CaseQuery – Supreme Court of Canada Research',
  description: 'AI-powered research for Supreme Court of Canada decisions. Instant analysis of SCC holdings, dissents, Charter applications, and precedential value.',
  openGraph: {
    title: 'CaseQuery – Supreme Court of Canada Research',
    description: 'AI-powered research for Supreme Court of Canada decisions. Instant analysis of SCC holdings, dissents, Charter applications, and precedential value.',
    type: 'website',
    locale: 'en_CA',
    siteName: 'CaseQuery',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1c1917',
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
