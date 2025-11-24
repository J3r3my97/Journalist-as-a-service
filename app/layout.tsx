import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journalist as a Service",
  description: "AI-powered news curation platform - your personal newsroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
