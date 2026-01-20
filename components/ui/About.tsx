"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";

const features = [
  {
    icon: "📚",
    title: "Course Management",
    description: "Easily manage courses, semesters, and curriculum with our intuitive interface.",
  },
  {
    icon: "👨‍🎓",
    title: "Student Portal",
    description: "Students can view their courses, grades, schedules, and enroll in new classes.",
  },
  {
    icon: "👩‍🏫",
    title: "Lecturer Dashboard",
    description: "Lecturers can manage their courses, view student rosters, and input grades.",
  },
  {
    icon: "📊",
    title: "Grade Management",
    description: "Comprehensive grading system supporting multiple grade types and final grades.",
  },
  {
    icon: "📅",
    title: "Schedule Management",
    description: "View and manage weekly schedules with location and time information.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    description: "Role-based access control with secure JWT authentication.",
  },
];

const stats = [
  { label: "Active Users", value: "500+", icon: "👥" },
  { label: "Courses", value: "50+", icon: "📖" },
  { label: "Departments", value: "10+", icon: "🏛️" },
  { label: "Uptime", value: "99.9%", icon: "⚡" },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "TailwindCSS",
  "TypeScript",
  "JWT Auth",
];

export function AboutComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Version 1.0
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Lecture Management System
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform for managing academic courses, students, lecturers,
              and grades. Built with modern technologies for seamless education management.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <a
                href="/sign-in"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg"
              >
                Get Started
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 border border-border rounded-full font-medium hover:bg-muted transition-all"
              >
                View Source
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <span className="text-4xl">{stat.icon}</span>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your educational institution efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur"
              >
                <CardHeader>
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
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
      <section className="py-20 px-6 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with Modern Tech
            </h2>
            <p className="text-muted-foreground">
              Powered by the latest and greatest technologies.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="px-6 py-2 text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Join our platform today and experience seamless academic management.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/sign-in"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                >
                  Sign In Now
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50 text-center text-muted-foreground text-sm">
        <p>© 2024 Lecture Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
