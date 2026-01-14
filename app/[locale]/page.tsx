import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { HomeClient } from "./HomeClient";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Header appName={t("appName")} location={t("location")} locale={locale} />
      <HomeClient />
    </main>
  );
}
