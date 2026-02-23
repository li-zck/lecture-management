"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Button } from "@/components/ui/shadcn/button";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function AdminSignUpPage() {
    const router = useRouter();
    const locale = useLocale();
    const localePath = useLocalePath();
    const dict = getClientDictionary(locale);
    const { login } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        username: z.string().min(3, dict.admin.signUp.usernameMin),
        password: z.string().min(6, dict.admin.signUp.passwordMin),
        confirmPassword: z.string().min(1, dict.admin.signUp.confirmRequired),
    }).refine((data) => data.password === data.confirmPassword, {
        message: dict.admin.signUp.passwordsDontMatch,
        path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await authApi.adminSignUp(values);
      login(response.accessToken);
      toast.success(dict.admin.signUp.success);
      router.push(localePath("admin"));
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 500;

      const messages: Record<number, string> = {
        400: dict.admin.signUp.checkInfo,
        409: dict.admin.signUp.usernameExists,
        422: dict.admin.signUp.invalidRegistration,
      };

      toast.error(messages[status] || err.message || dict.admin.signUp.failed);
    } finally {
      setIsLoading(false);
    }
  }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">{dict.admin.signUp.title}</CardTitle>
                    <CardDescription className="text-center">
                        {dict.admin.signUp.subtitle}
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
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dict.admin.signUp.confirmPassword}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {dict.admin.signUp.createAccount}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        {dict.admin.signUp.alreadyHave}{" "}
                        <Link href={localePath("admin/sign-in")} className="text-primary hover:underline">
                            {dict.admin.signUp.signIn}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
