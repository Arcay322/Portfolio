import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { KeyboardNavigationProvider } from "@/hooks/useKeyboardNavigation";
import { PrefetchRoutes, IMPORTANT_ROUTES } from "@/hooks/usePrefetch";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeadline = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: ["desarrollador full-stack", "React", "Next.js", "Node.js", "TypeScript", "portafolio", "full-stack developer", "portfolio"],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://arcay.dev",
      images: [
        {
          url: "https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png",
          width: 1200,
          height: 630,
          alt: t('ogImageAlt'),
        },
      ],
      siteName: "Arnie Calderon",
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: "summary_large_image",
      creator: "@arcaydev",
      title: t('title'),
      description: t('description'),
      images: ["https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png"],
    },
    metadataBase: new URL("https://arcay.dev"),
    alternates: {
      canonical: "https://arcay.dev",
      languages: {
        'es': '/',
        'en': '/en',
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validar que el locale es válido
  if (!locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  const messages = await getMessages();
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeadline.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <KeyboardNavigationProvider enableShortcuts={true}>
              <SmoothScroll />
              <CustomCursor />
              <ParticlesBackground />
              <GoogleAnalytics />
              <WebVitalsReporter />
              <ServiceWorkerRegistrar />
              <ServiceWorkerRegistrar />
              {/* PrefetchRoutes removed to avoid redundant preloading warnings - Next.js handles viewport prefetching natively */}
              {/* <PrefetchRoutes
                routes={IMPORTANT_ROUTES}
                delay={2000}
                onHover={true}
                onIdle={true}
              /> */}
              <div className="relative flex min-h-dvh flex-col">
                <Header />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </div>
              <ScrollToTop />
              <Toaster />
            </KeyboardNavigationProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
