"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import { ArrowRight, HelpCircle, Mail, Phone, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SupportForm() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const s = dict.support;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success toast
    toast.success(s.successTitle, {
      description: s.successDescription,
    });

    // Redirect to success page
    router.push(`/${locale}/support/success`);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{s.title}</h1>
          <p className="text-muted-foreground text-lg">{s.subtitle}</p>
        </div>

        {/* Support Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{s.formTitle}</CardTitle>
            <CardDescription>{s.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {s.fullName} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {s.email} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Role and Category Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    {s.yourRole} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    required
                    value={formData.role}
                    onValueChange={(value) => handleChange("role", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder={s.selectRole} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{s.roles.student}</SelectItem>
                      <SelectItem value="lecturer">
                        {s.roles.lecturer}
                      </SelectItem>
                      <SelectItem value="admin">{s.roles.admin}</SelectItem>
                      <SelectItem value="other">{s.roles.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    {s.issueCategory}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    required
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder={s.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="login">
                        {s.categories.login}
                      </SelectItem>
                      <SelectItem value="enrollment">
                        {s.categories.enrollment}
                      </SelectItem>
                      <SelectItem value="grades">
                        {s.categories.grades}
                      </SelectItem>
                      <SelectItem value="schedule">
                        {s.categories.schedule}
                      </SelectItem>
                      <SelectItem value="technical">
                        {s.categories.technical}
                      </SelectItem>
                      <SelectItem value="account">
                        {s.categories.account}
                      </SelectItem>
                      <SelectItem value="other">
                        {s.categories.other}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  {s.subject} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder={s.subjectPlaceholder}
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  {s.message} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder={s.messagePlaceholder}
                  required
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="min-h-[150px] resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">{s.messageHint}</p>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-11 shadow-md hover:shadow-lg transition-all duration-200 group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">{s.submitting}</span>
                    </>
                  ) : (
                    <>
                      {s.submitRequest}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  {dict.common.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {s.needImmediate}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">+1 (555) 123-4567</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">support@lms.edu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
