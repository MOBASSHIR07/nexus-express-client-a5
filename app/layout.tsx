import { Outfit } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "sonner";
import { Metadata } from "next";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Nexus Express | Fast & Reliable Logistics",
  description: "Experience the next level of delivery with Nexus Express. Fast, secure, and reliable logistics solutions for your business and personal needs.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body  className={`${outfit.className} antialiased`} suppressHydrationWarning>
        {children}
           <Toaster
          position="top-center"
          richColors
          theme="dark"
        />
      </body>
    </html>
  );
}