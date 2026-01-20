import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/shadcn/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Empowering Academic Excellence
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Streamline your educational journey with our comprehensive lecture management system.
                  Seamlessly connect students, lecturers, and administrators in one unified platform.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/sign-in">
                    <Button size="lg" className="px-8">Get Started</Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="px-8">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto aspect-video w-full max-w-[600px] lg:max-w-none rounded-xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-all duration-500">
                <Image
                  src="/hero.png"
                  alt="Education Technology"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Tailored for Every Role
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our platform provides specialized tools and interfaces for every member of your academic institution.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Student Card */}
              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <GraduationCap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>For Students</CardTitle>
                  <CardDescription>
                    Manage your learning path with ease.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• View class schedules and locations</p>
                  <p>• Track grades and academic progress</p>
                  <p>• Access course materials and resources</p>
                  <p>• Easy enrollment process</p>
                </CardContent>
              </Card>

              {/* Lecturer Card */}
              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>For Lecturers</CardTitle>
                  <CardDescription>
                    Focus on teaching, not administration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Manage courses and syllabi</p>
                  <p>• Input grades and attendance</p>
                  <p>• Communicate with students</p>
                  <p>• View teaching schedules</p>
                </CardContent>
              </Card>

              {/* Admin Card */}
              <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>For Administrators</CardTitle>
                  <CardDescription>
                    Complete control over the system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Manage users and roles</p>
                  <p>• Configure academic semesters</p>
                  <p>• Oversee scheduling and resources</p>
                  <p>• Generate reports and analytics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 Lecture Management System. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
