"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import Link from "next/link";
import { useParams } from "next/navigation";

export function AboutComponent() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const a = dict.about;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-6">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              {a.version}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {a.title} <br className="hidden md:block" />
              <span className="text-primary">{a.titleBrand}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {a.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">{a.missionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {a.missionBody}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {a.coreFeaturesTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {a.coreFeaturesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {a.features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 sm:py-20 px-6 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {a.techStackTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {a.techStackSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {a.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="px-5 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 sm:py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {a.whyChooseTitle}
            </h2>
          </div>

          <div className="space-y-8">
            {a.benefits.map((benefit) => (
              <div key={benefit.title} className="space-y-3">
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-border/50 bg-transparent">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">{a.ctaTitle}</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                {a.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href={`/${locale}/sign-in`}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                  >
                    {dict.nav.signIn}
                  </Button>
                </Link>
                <Link href={`/${locale}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 hover:bg-accent/50 transition-all duration-200"
                  >
                    {dict.nav.home}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
