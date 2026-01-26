"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import Link from "next/link";

const features = [
  {
    title: "Course Management",
    description:
      "Comprehensive course administration tools for managing curriculum, schedules, and academic programs across departments.",
  },
  {
    title: "Student Portal",
    description:
      "Integrated platform for students to access course materials, track academic progress, and manage enrollments.",
  },
  {
    title: "Lecturer Dashboard",
    description:
      "Professional interface for instructors to manage courses, monitor student performance, and maintain academic records.",
  },
  {
    title: "Grade Management",
    description:
      "Advanced grading system supporting multiple assessment types, weighted calculations, and comprehensive reporting.",
  },
  {
    title: "Schedule Management",
    description:
      "Intelligent scheduling system with conflict detection, resource allocation, and real-time availability tracking.",
  },
  {
    title: "Secure Authentication",
    description:
      "Enterprise-grade security with role-based access control, encrypted communications, and audit logging.",
  },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "NestJS",
  "PostgreSQL",
  "Prisma ORM",
  "TailwindCSS",
  "TypeScript",
  "JWT Authentication",
];

export function AboutComponent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Version 1.0.0
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              About the <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                Lecture Management System
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive platform designed to streamline academic
              operations, connecting students, lecturers, and administrators
              through an intuitive, unified experience.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              To modernize academic management by providing institutions with
              powerful, user-friendly tools that enhance educational delivery,
              improve administrative efficiency, and support student success
              through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to support every aspect of academic
              administration and learning management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
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
              Technology Stack
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern, industry-standard technologies to ensure
              performance, scalability, and maintainability.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
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
              Why Choose Our Platform
            </h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">
                Streamlined Administration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Reduce administrative overhead with automated workflows,
                centralized data management, and intelligent reporting tools
                that save time and minimize errors.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Enhanced Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Foster better communication between students, lecturers, and
                administrators through integrated messaging, notifications, and
                shared resources.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Data-Driven Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Make informed decisions with comprehensive analytics and
                reporting capabilities that provide visibility into academic
                performance and operational metrics.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Scalable Solution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our architecture is designed to grow with your institution,
                supporting everything from small departments to large
                universities with thousands of users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-background">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                Join educational institutions already using our platform to
                transform their academic management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 hover:bg-accent/50 transition-all duration-200"
                  >
                    Learn More
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
