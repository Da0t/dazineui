import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dazineui",
  description: "Motion and 3D primitive library for AI-assisted web development"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
