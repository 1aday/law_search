import { Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
import type { Metadata } from 'next'

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CaseQuery AI – Supreme Court Research Reimagined',
  description: 'Interrogate precedent. Uncover holdings. Navigate the law with precision.',
  openGraph: {
    title: 'CaseQuery AI – Supreme Court Research Reimagined',
    description: 'Interrogate precedent. Uncover holdings. Navigate the law with precision.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CaseQuery AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CaseQuery AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaseQuery AI – Supreme Court Research Reimagined',
    description: 'Interrogate precedent. Uncover holdings. Navigate the law with precision.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${ibmMono.variable}`}>
      <body>
        {assistantId ? children : <Warnings />}
      </body>
    </html>
  );
}
