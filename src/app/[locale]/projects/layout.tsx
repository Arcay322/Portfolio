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
    title: t("projects_title"),
    description: t("projects_description"),
    ...buildPageMetadata(locale, "/projects"),
  };
}

export default function ProjectsLayout({ children }: Props) {
  return <>{children}</>;
}
