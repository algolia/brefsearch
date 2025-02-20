import type { Metadata } from 'next';

import './globals.css';

import localFont from 'next/font/local';

// Font files can be colocated inside of `pages`
const brefFont = localFont({
  src: './fonts/ITC_Lubalin_Graph_Book_Regular.otf',
});

export const metadata: Metadata = {
  title: 'Bref Search',
  description: "Bref. J'ai cherché dans les épisodes",
};

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
