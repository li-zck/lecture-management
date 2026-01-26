import { GraduationCap } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const footerLinks = [
    {
      href: "/about",
      label: "About",
    },
    {
      href: "#features",
      label: "Features",
    },
    {
      href: "/support",
      label: "Support",
    },
    {
      href: "/privacy",
      label: "Privacy",
    },
  ];

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="w-full py-8 px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">LMS</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2024 Lecture Management System
          </p>
        </div>
      </div>
    </footer>
  );
};
