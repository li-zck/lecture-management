"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  GraduationCap,
  LayoutGrid,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef } from "react";

const featureIcons = [GraduationCap, BookOpen, Shield];

const benefitIcons = [Clock, LayoutGrid, BarChart3, Calendar, FileText, Bell];

const statIcons = [Users, BookOpen, LayoutGrid, Zap];
const statKeys = [
  "activeStudents",
  "courses",
  "departments",
  "uptime",
] as const;

const studentFeatureIcons = [BookOpen, Award, Calendar, Download];
const lecturerFeatureIcons = [Users, TrendingUp, Calendar, FileText];

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Homepage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const h = dict.home;

  const stats = statKeys.map((key, i) => ({
    label: h.stats[key],
    icon: statIcons[i],
  }));

  return (
    <div className="bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-background" />
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-80 h-80 bg-emerald-500/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="w-full px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium shadow-sm">
                <motion.span
                  className="relative flex h-2 w-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </motion.span>
                {h.badge}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {h.titleLine1}
              <span className="mt-1 block text-primary">{h.titleLine2}</span>
            </motion.h1>

            <motion.p
              className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href={`/${locale}/sign-in`}>
                <Button
                  size="lg"
                  className="h-12 px-8 text-base gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {h.getStarted}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base hover:bg-accent/50 transition-all duration-200"
                >
                  {h.learnMore}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {h.trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="text-center space-y-2">
                  <stat.icon className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {h.featuresSection.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {h.featuresSection.subtitle}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3">
            {h.features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="group relative h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-muted mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Features Section */}
      <section className="py-16 sm:py-20 bg-muted/30 px-6">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                {h.studentSection.badge}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {h.studentSection.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {h.studentSection.subtitle}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {h.studentFeatures.map((feature, index) => {
              const Icon = studentFeatureIcons[index];
              return (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 hover:border-primary/50">
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lecturer Features Section */}
      <section className="py-16 sm:py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                {h.lecturerSection.badge}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {h.lecturerSection.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {h.lecturerSection.subtitle}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {h.lecturerFeatures.map((feature, index) => {
              const Icon = lecturerFeatureIcons[index];
              return (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 hover:border-primary/50">
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-muted/30 px-6">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {h.benefitsSection.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {h.benefitsSection.subtitle}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {h.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <AnimatedSection key={benefit.title} delay={index * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection>
            <Card className="relative isolate overflow-hidden border-border/50 bg-transparent">
              <CardContent className="p-8 text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {h.cta.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  {h.cta.subtitle}
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Link href={`/${locale}/sign-in`}>
                    <Button
                      size="lg"
                      className="h-12 px-8 text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      {dict.nav.signIn}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/about`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-8 text-base hover:bg-accent/50 transition-all duration-200"
                    >
                      {h.learnMore}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
