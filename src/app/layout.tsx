import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'PULLUP',
  description: 'AI-generated guilt trip websites that get your friends out tonight.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
