import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="dark h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
