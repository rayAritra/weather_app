import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wind Generation — UK',
  description: 'Monitor wind power forecasts against actual generation in the UK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
