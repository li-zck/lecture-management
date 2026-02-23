"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Wordmark } from "@/components/ui";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { authApi } from "@/lib/api/auth";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminSignInPage() {
  const router = useRouter();
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const { login } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await authApi.adminSignIn(values);
      login(response.accessToken);
      toast.success(dict.admin.signIn.success);
      router.push(localePath("admin"));
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 500;

      const messages: Record<number, string> = {
        400: dict.admin.signIn.checkCredentials,
        401: dict.admin.signIn.invalidCredentials,
        403: dict.admin.signIn.accountDisabled,
        429: dict.admin.signIn.tooManyAttempts,
      };

      toast.error(messages[status] || err.message || dict.admin.signIn.failed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 gap-4">
      <Wordmark />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {dict.admin.signIn.title}
          </CardTitle>
          <CardDescription className="text-center">
            {dict.admin.signIn.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.admin.signIn.username}</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.admin.signIn.password}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dict.admin.signIn.signIn}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {dict.admin.signIn.noAccount}{" "}
            <Link
              href={localePath("admin/sign-up")}
              className="link-in-text text-foreground font-semibold hover:text-primary"
            >
              {dict.admin.signIn.signUp}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
