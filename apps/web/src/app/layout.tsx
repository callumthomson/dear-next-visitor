import type { Metadata } from 'next';
import { bodyFont, handFont } from '@/fonts';
import './globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Dear Next Visitor...',
  description: 'Transient messages for strangers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html
        lang="en"
        className={`bg-zinc-700 ${handFont.variable} ${bodyFont.variable}`}
      >
        <body>{children}</body>
      </html>
    </Providers>
  );
}
