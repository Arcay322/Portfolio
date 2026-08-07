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
    title: t("about_title"),
    description: t("about_description"),
    ...buildPageMetadata(locale, "/about"),
  };
}

export default function AboutLayout({ children }: Props) {
  return <>{children}</>;
}
