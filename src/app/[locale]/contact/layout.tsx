import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("contact_title"),
    description: t("contact_description"),
    ...buildPageMetadata(locale, "/contact"),
  };
}

export default function ContactLayout({ children }: Props) {
  return <>{children}</>;
}
