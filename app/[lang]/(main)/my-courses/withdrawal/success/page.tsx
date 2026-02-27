"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { ArrowLeft, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";

export default function WithdrawalSuccessPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const t = dict.withdrawalRequest;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-6">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-border/50 shadow-lg overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">
                {t.successTitle}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.successDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href={localePath("dashboard")} className="flex-1">
                <Button
                  variant="default"
                  className="w-full h-11 shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {dict.nav.dashboard}
                </Button>
              </Link>
              <Link href={localePath("my-courses")} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-11 transition-all duration-200 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {t.backToMyCourses}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
