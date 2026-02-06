import { SetHtmlLang } from "@/components/ui/SetHtmlLang";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  return (
    <>
      <SetHtmlLang lang={lang} />
      {children}
    </>
  );
}
