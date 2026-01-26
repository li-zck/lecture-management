"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
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
import { useRef } from "react";

const features = [
  {
    icon: GraduationCap,
    title: "Student Portal",
    description:
      "Access schedules, track grades, enroll in courses, and manage your academic journey in one place.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    icon: BookOpen,
    title: "Lecturer Dashboard",
    description:
      "Manage courses, record attendance, input grades, and communicate effectively with students.",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  {
    icon: Shield,
    title: "Admin Control",
    description:
      "Full system oversight with user management, semester configuration, and comprehensive reporting.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Real-time Updates",
    description:
      "Instant synchronization across all users and devices for seamless collaboration.",
  },
  {
    icon: LayoutGrid,
    title: "Intuitive Interface",
    description:
      "Clean, modern design that makes navigation effortless for everyone.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive insights into academic performance and trends.",
  },
  {
    icon: Calendar,
    title: "Schedule Management",
    description:
      "Efficient coordination of classes, exams, and academic events.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Upload, share, and download course materials securely.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay informed with real-time updates and reminders.",
  },
];

const stats = [
  { value: "500+", label: "Active Students", icon: Users },
  { value: "50+", label: "Courses", icon: BookOpen },
  { value: "10+", label: "Departments", icon: LayoutGrid },
  { value: "99.9%", label: "Uptime", icon: Zap },
];

const studentFeatures = [
  {
    icon: BookOpen,
    title: "Course Enrollment",
    description:
      "Browse and enroll in available courses with real-time updates.",
  },
  {
    icon: Award,
    title: "Grade Tracking",
    description:
      "Monitor your academic performance across all enrolled courses.",
  },
  {
    icon: Calendar,
    title: "Weekly Schedule",
    description:
      "View your personalized class schedule with location and time details.",
  },
  {
    icon: Download,
    title: "Course Materials",
    description:
      "Access and download lecture notes, assignments, and resources.",
  },
];

const lecturerFeatures = [
  {
    icon: Users,
    title: "Student Management",
    description:
      "View enrolled students and track their progress in your courses.",
  },
  {
    icon: TrendingUp,
    title: "Grade Input",
    description:
      "Record and update student grades with multiple assessment types.",
  },
  {
    icon: Calendar,
    title: "Course Scheduling",
    description: "Manage your teaching schedule and classroom assignments.",
  },
  {
    icon: FileText,
    title: "Resource Sharing",
    description: "Upload and share course materials with your students.",
  },
];

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
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
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
                  Academic Management Platform
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Modern Lecture
                <span className="block h-16 mt-1 bg-gradient-to-r from-primary via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                  Management System
                </span>
              </motion.h1>

              <motion.p
                className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A comprehensive platform designed to streamline academic
                operations. Connect students, lecturers, and administrators
                through an intuitive, unified experience.
              </motion.p>

              <motion.div
                className="mt-6 flex flex-wrap items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base hover:bg-accent/50 transition-all duration-200"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {[
                  "Secure & Reliable",
                  "Easy Integration",
                  "24/7 Availability",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
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
                    <stat.icon className="h-8 w-8 mx-auto text-primary" />
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
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
                  Designed for Every Role
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tailored experiences for students, lecturers, and
                  administrators with role-specific tools and interfaces.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="group relative h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className={`h-7 w-7 ${feature.color}`} />
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
              ))}
            </div>
          </div>
        </section>

        {/* Student Features Section */}
        <section className="py-16 sm:py-20 bg-muted/30 px-6">
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  For Students
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Empower Your Learning Journey
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Access everything you need to succeed academically in one
                  centralized platform.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 md:grid-cols-2">
              {studentFeatures.map((feature, index) => (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 hover:border-blue-500/50">
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
              ))}
            </div>
          </div>
        </section>

        {/* Lecturer Features Section */}
        <section className="py-16 sm:py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  For Lecturers
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Streamline Your Teaching
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Powerful tools to manage courses, track student progress, and
                  enhance the learning experience.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 md:grid-cols-2">
              {lecturerFeatures.map((feature, index) => (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 hover:border-violet-500/50">
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                          <feature.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
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
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 bg-muted/30 px-6">
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Built for Modern Education
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our platform combines powerful features with an intuitive
                  design to enhance the educational experience for everyone.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={benefit.title} delay={index * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <benefit.icon className="h-6 w-6" />
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
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection>
              <Card className="relative isolate overflow-hidden border-border/50">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
                <CardContent className="p-8 text-center space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-bold">
                    Ready to Get Started?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Join our platform and experience a streamlined approach to
                    academic management.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Link href="/sign-in">
                      <Button
                        size="lg"
                        className="h-12 px-8 text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 text-base hover:bg-accent/50 transition-all duration-200"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </div>
  );
}
