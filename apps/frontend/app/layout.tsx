import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LearnAcademy — Master Coding the Modern Way",
  description:
    "Learn coding with expertly crafted courses, modules, and hands-on lessons. From free fundamentals to Pro exclusives and Ultra gems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
