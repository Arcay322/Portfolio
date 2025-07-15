import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeadline = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "Arnie Calderon - Portafolio",
  description: "Portafolio profesional de un desarrollador full-stack con experiencia en la creación de aplicaciones web modernas y eficientes.",
  keywords: ["desarrollador full-stack", "React", "Next.js", "Node.js", "TypeScript", "portafolio"],
  openGraph: {
    title: "Arnie Calderon - Portafolio",
    description: "Portafolio profesional de un desarrollador full-stack.",
    url: "https://arcay.dev",
    images: [
      {
        url: "https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png",
        width: 1200,
        height: 630,
        alt: "Vista previa del portafolio de Arnie Calderon",
      },
    ],
    siteName: "Arnie Calderon",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@arcaydev",
    title: "Arnie Calderon - Portafolio",
    description: "Portafolio profesional de un desarrollador full-stack.",
    images: ["https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png"],
  },
  metadataBase: new URL("https://arcay.dev"),
  alternates: {
    canonical: "https://arcay.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeadline.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
