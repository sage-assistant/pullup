import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'PULLUP',
  description: 'AI builds a personalized guilt trip website to get your friend off the couch. Takes 6 minutes.',
  openGraph: {
    title: 'PULLUP',
    description: 'AI builds a personalized guilt trip website to get your friend off the couch. Takes 6 minutes.',
    type: 'website',
    siteName: 'PULLUP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PULLUP',
    description: 'AI builds a personalized guilt trip website to get your friend off the couch.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-black antialiased">{children}</body>
    </html>
  );
}
