"use client";

import { getClientDictionary, isLocale } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "./shadcn/button";

export function SitePolicyComponent() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const sp = dict.sitePolicy;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-6">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {sp.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {sp.subtitle}
            </p>
            <p className="text-sm text-muted-foreground">{sp.lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12 px-6 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-4xl space-y-12">
          {/* Terms of Use */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{sp.termsOfUse.title}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {sp.termsOfUse.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>

          {/* Privacy Policy */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{sp.privacy.title}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {sp.privacy.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>

          {/* Acceptable Use */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {sp.acceptableUse.title}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{sp.acceptableUse.intro}</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                {sp.acceptableUse.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{sp.acceptableUse.outro}</p>
            </div>
          </div>

          {/* LMS-Specific Policies */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{sp.lmsSpecific.title}</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {sp.lmsSpecific.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {section.title}
                  </h3>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{sp.faq.title}</h2>
            <div className="space-y-2">
              {sp.faq.items.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-border/50 bg-background px-4 py-2"
                >
                  <summary className="cursor-pointer list-none font-medium py-2 flex items-center justify-between gap-2">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-muted-foreground pt-2 pb-4 pl-0 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <p className="text-muted-foreground">
            {sp.cta.text}{" "}
            <Link
              href={`/${locale}/support`}
              className="text-primary hover:underline font-medium"
            >
              {sp.cta.supportLink}
            </Link>{" "}
            page.
          </p>
          <Link href={`/${locale}`}>
            <Button variant="outline" size="lg">
              {dict.nav.home}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
