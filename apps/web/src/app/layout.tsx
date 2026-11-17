import type { Metadata } from 'next';
import './globals.css';
import NavigationProgressBar from '@/components/NavigationProgressBar';

export const metadata: Metadata = {
  title: 'Greenwood Academy | Executive Principal Suite',
  description: 'Unified School Management ERP — Executive Principal & Administrative Operations Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <NavigationProgressBar />
        {children}
      </body>
    </html>
  );
}
