import type { Metadata } from 'next';
import React from 'react';

import './globals.css';

import localFont from 'next/font/local';

// Font files can be colocated inside of `pages`
const brefFont = localFont({
  src: './fonts/ITC_Lubalin_Graph_Book_Regular.otf',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brefsearch.com'),
  title: 'Bref Search',
  description: "Bref. J'ai cherché dans les épisodes",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Bref Search',
    description: "Bref. J'ai cherché dans les épisodes",
    images: [
      {
        url: '/overview.png',
        width: 1920,
        height: 1200,
        alt: 'Bref Search Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bref Search',
    description: "Bref. J'ai cherché dans les épisodes",
    images: ['/overview.png'],
  },
};

/**
 * Root layout component for the Next.js application.
 * Sets up the HTML structure, fonts, and global styles for all pages.
 * @param {object} props - The component props
 * @param {React.ReactNode} props.children - The page content to render within the layout
 * @returns {React.ReactElement} The root HTML structure with fonts and styling applied
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${brefFont.className} antialiased`}>{children}</body>
    </html>
  );
}
