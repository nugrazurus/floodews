import { Sidebar } from "@/components";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FloodEWS",
  description: "Flood Early Warning System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
          <Sidebar> 
          {children}
          </Sidebar>
      </body>
    </html>
  );
}
