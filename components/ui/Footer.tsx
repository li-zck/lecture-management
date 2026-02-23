"use client";

import { getClientDictionary, isLocale, useLocalePath } from "@/lib/i18n";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const Footer = () => {
  const localePath = useLocalePath();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const footerLinks = [
    { href: "/about", label: dict.nav.about },
    { href: "/site-policy", label: dict.nav.sitePolicy },
    { href: "/support", label: dict.nav.support },
  ];

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:gap-6 md:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">LMS</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href)}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
