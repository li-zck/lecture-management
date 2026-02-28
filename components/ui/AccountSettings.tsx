"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { useUserProfile } from "@/components/ui/hooks/use-user-profile";
import {
  useLecturerWebhooks,
  useStudentWebhooks,
} from "@/components/ui/hooks/use-user-webhooks";
import { SettingsWebhooksSection } from "@/components/ui/SettingsWebhooksSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { getErrorInfo } from "@/lib/api/error";
import { lecturerApi } from "@/lib/api/lecturer";
import {
  profileUpdateRequestApi,
  type ProfileChangeCooldownStatus,
} from "@/lib/api/profile-update-request";
import { studentApi } from "@/lib/api/student";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Settings,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function AccountSettings() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const st = dict.settings;
  const signIn = dict.signIn;
  const {
    profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useUserProfile();

  const studentWebhooks = useStudentWebhooks();
  const lecturerWebhooks = useLecturerWebhooks();

  const { logout } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [passwordConfirmDialogOpen, setPasswordConfirmDialogOpen] =
    useState(false);
  const [pendingPasswordValues, setPendingPasswordValues] = useState<z.infer<
    typeof immediateSchema
  > | null>(null);
  const [pendingRequestValues, setPendingRequestValues] = useState<z.infer<
    typeof profileRequestSchema
  > | null>(null);
  const [cooldownStatus, setCooldownStatus] =
    useState<ProfileChangeCooldownStatus | null>(null);
  const profileRequestSchema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          gender: z
            .union([z.enum(["male", "female"]), z.literal("")])
            .optional(),
          birthDate: z.string().optional(),
          citizenId: z.string().optional(),
        })
        .refine(
          (data) =>
            !!data.fullName?.trim() ||
            !!data.phone?.trim() ||
            !!data.address?.trim() ||
            data.gender === "male" ||
            data.gender === "female" ||
            !!data.birthDate?.trim() ||
            !!data.citizenId?.trim(),
          { message: st.requestEmptyError, path: ["fullName"] },
        )
        .refine(
          (data) => !data.fullName?.trim() || data.fullName.trim().length >= 2,
          { message: st.validationFullNameMin, path: ["fullName"] },
        )
        .refine(
          (data) =>
            !data.fullName?.trim() || data.fullName.trim().length <= 100,
          { message: st.validationFullNameMax, path: ["fullName"] },
        )
        .refine(
          (data) =>
            !data.phone?.trim() ||
            /^\+?[\d\s\-()]{8,20}$/.test(data.phone.trim()),
          { message: st.validationPhoneInvalid, path: ["phone"] },
        )
        .refine(
          (data) =>
            !data.address?.trim() ||
            (data.address.trim().length >= 5 &&
              data.address.trim().length <= 500),
          { message: st.validationAddressMin, path: ["address"] },
        )
        .refine(
          (data) => {
            if (!data.birthDate?.trim()) return true;
            const d = new Date(data.birthDate);
            if (Number.isNaN(d.getTime())) return false;
            const now = new Date();
            if (d > now) return false;
            return (
              d.getFullYear() >= 1900 && d.getFullYear() <= now.getFullYear()
            );
          },
          { message: st.validationBirthDateInvalid, path: ["birthDate"] },
        )
        .refine(
          (data) =>
            !data.citizenId?.trim() || /^\d{9,12}$/.test(data.citizenId.trim()),
          { message: st.validationCitizenIdInvalid, path: ["citizenId"] },
        ),
    [
      st.requestEmptyError,
      st.validationFullNameMin,
      st.validationFullNameMax,
      st.validationPhoneInvalid,
      st.validationAddressMin,
      st.validationBirthDateInvalid,
      st.validationCitizenIdInvalid,
    ],
  );

  const requestForm = useForm<z.infer<typeof profileRequestSchema>>({
    resolver: zodResolver(profileRequestSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      gender: "",
      birthDate: "",
      citizenId: "",
    },
  });

  const immediateSchema = useMemo(
    () =>
      z
        .object({
          username: z.string().optional(),
          oldPassword: z.string().optional(),
          newPassword: z.string().optional(),
          confirmPassword: z.string().optional(),
        })
        .refine(
          (data) =>
            !data.newPassword?.trim() || (data.oldPassword ?? "").trim() !== "",
          { message: st.passwordOldRequired, path: ["oldPassword"] },
        )
        .refine(
          (data) =>
            !data.newPassword?.trim() || (data.newPassword?.length ?? 0) >= 6,
          { message: st.passwordTooShort, path: ["newPassword"] },
        )
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: dict.admin.students.passwordsDontMatch,
          path: ["confirmPassword"],
        }),
    [
      st.passwordOldRequired,
      st.passwordTooShort,
      dict.admin.students.passwordsDontMatch,
    ],
  );

  const immediateForm = useForm<z.infer<typeof immediateSchema>>({
    resolver: zodResolver(immediateSchema),
    defaultValues: {
      username: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Pre-fill form with current profile data (request form + username in immediate form)
  useEffect(() => {
    if (profile) {
      immediateForm.reset({
        username: profile.username || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      requestForm.reset({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        gender:
          profile.gender === true
            ? "male"
            : profile.gender === false
              ? "female"
              : "",
        birthDate: profile.birthDate ? profile.birthDate.slice(0, 10) : "",
        citizenId: profile.citizenId || "",
      });
    }
  }, [profile, immediateForm, requestForm]);

  useEffect(() => {
    if (
      profile &&
      (profile.role === "student" || profile.role === "lecturer")
    ) {
      profileUpdateRequestApi
        .getCooldown()
        .then(setCooldownStatus)
        .catch(() =>
          setCooldownStatus({
            canUpdateProfile: true,
            profileChangeCooldownUntil: null,
          }),
        );
    } else {
      setCooldownStatus(null);
    }
  }, [profile]);

  function isWrongPasswordError(err: unknown): boolean {
    const info = getErrorInfo(err);
    if (info.status === 401) return true;
    if (info.status === 400) {
      const m = info.message.toLowerCase();
      return /invalid|incorrect|wrong|current password|old password|password/.test(
        m,
      );
    }
    return false;
  }

  async function performPasswordUpdate(
    values: z.infer<typeof immediateSchema>,
    logOutAfter: boolean,
  ) {
    if (!profile) return;

    setIsSubmitting(true);
    setPasswordConfirmDialogOpen(false);
    setPendingPasswordValues(null);
    immediateForm.clearErrors();
    try {
      if (profile.role === "student") {
        const payload: Parameters<typeof studentApi.updateProfile>[0] = {
          username: values.username?.trim() || undefined,
        };
        if (values.newPassword?.trim()) {
          payload.oldPassword = values.oldPassword;
          payload.password = values.newPassword;
        }
        await studentApi.updateProfile(payload);
      } else {
        const payload: Parameters<typeof lecturerApi.updateProfile>[0] = {
          username: values.username?.trim() || undefined,
        };
        if (values.newPassword?.trim()) {
          payload.oldPassword = values.oldPassword;
          payload.password = values.newPassword;
        }
        await lecturerApi.updateProfile(payload);
      }

      if (logOutAfter) {
        logout();
        router.push(`/${locale}/sign-in`);
      } else {
        toast.success(st.successTitle, {
          description: st.successDescription,
        });
        await refetchProfile();
        const cooldown = await profileUpdateRequestApi.getCooldown();
        setCooldownStatus(cooldown);
        immediateForm.reset({
          username: profile.username || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err: unknown) {
      if (isWrongPasswordError(err)) {
        immediateForm.setError("oldPassword", {
          message: st.passwordIncorrect,
        });
      } else {
        const info = getErrorInfo(err);
        immediateForm.setError("root", { message: info.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImmediateSubmit = (values: z.infer<typeof immediateSchema>) => {
    if (!profile) return;

    if (values.newPassword?.trim()) {
      setPendingPasswordValues(values);
      setPasswordConfirmDialogOpen(true);
      return;
    }

    performPasswordUpdate(values, false);
  };

  const handlePasswordConfirmRemain = () => {
    if (pendingPasswordValues) {
      performPasswordUpdate(pendingPasswordValues, false);
    }
  };

  const handlePasswordConfirmLogout = () => {
    if (pendingPasswordValues) {
      performPasswordUpdate(pendingPasswordValues, true);
    }
  };

  const handleRequestSubmit = (
    values: z.infer<typeof profileRequestSchema>,
  ) => {
    setPendingRequestValues(values);
    setRequestDialogOpen(true);
  };

  const handleRequestConfirm = async () => {
    setRequestDialogOpen(false);
    const values = pendingRequestValues;
    setPendingRequestValues(null);
    if (!values) return;

    const requestedData: Record<string, unknown> = {};
    if (values.fullName?.trim())
      requestedData.fullName = values.fullName.trim();
    if (values.phone?.trim()) requestedData.phone = values.phone.trim();
    if (values.address?.trim()) requestedData.address = values.address.trim();
    if (values.gender === "male" || values.gender === "female")
      requestedData.gender = values.gender;
    if (values.birthDate?.trim())
      requestedData.birthDate = values.birthDate.trim();
    if (values.citizenId?.trim())
      requestedData.citizenId = values.citizenId.trim();

    if (Object.keys(requestedData).length === 0) {
      toast.error(st.requestEmptyError);
      return;
    }

    try {
      await profileUpdateRequestApi.create({ requestedData });
      toast.success(st.requestSuccessTitle, {
        description: st.requestSuccessDescription,
      });
      await refetchProfile();
      const cooldown = await profileUpdateRequestApi.getCooldown();
      setCooldownStatus(cooldown);
      requestForm.reset({
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        gender:
          profile?.gender === true
            ? "male"
            : profile?.gender === false
              ? "female"
              : "",
        birthDate: profile?.birthDate ? profile.birthDate.slice(0, 10) : "",
        citizenId: profile?.citizenId || "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message ? err.message : st.requestFailed;
      toast.error(message);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold mb-4">{st.unauthorized}</h1>
          <p className="text-muted-foreground">{st.signInRequired}</p>
        </div>
      </div>
    );
  }

  const isStudent = profile.role === "student";
  const webhooks = isStudent ? studentWebhooks : lecturerWebhooks;

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{st.title}</h1>
          <p className="text-muted-foreground text-lg">{st.subtitle}</p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-200">
          <p className="text-sm font-medium">{st.warning}</p>
        </div>

        {/* Profile change cooldown info */}
        <div className="mb-6 rounded-lg border border-muted bg-muted/30 p-4 text-muted-foreground">
          <p className="text-sm">{st.profileChangeCooldownDesc}</p>
          {cooldownStatus?.profileChangeCooldownUntil && (
            <>
              <p className="text-sm font-medium mt-2 text-foreground">
                {st.profileChangeCooldownUntil.replace(
                  "{date}",
                  new Date(
                    cooldownStatus.profileChangeCooldownUntil,
                  ).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
                    dateStyle: "long",
                  }),
                )}
              </p>
              <p className="text-sm mt-2">
                {st.profileChangeCooldownContactSupport}{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-primary hover:underline"
                  onClick={() => router.push(`/${locale}/support`)}
                >
                  {st.contactSupport}
                </Button>
              </p>
            </>
          )}
        </div>

        {/* Current Information Card */}
        <Card className="border-border/50 shadow-md mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{st.currentInfo}</CardTitle>
            <CardDescription>{st.currentInfoDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{st.fullName}</p>
                  <p className="font-medium">{profile.fullName || st.notSet}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {st.emailReadOnly}
                  </p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isStudent ? signIn.studentId : signIn.lecturerId}
                  </p>
                  <p className="font-medium">
                    {isStudent ? profile.studentId : profile.lecturerId}
                  </p>
                </div>
              </div>
              {isStudent && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {st.department}
                      </p>
                      <p className="font-medium">
                        {profile.department?.name || st.notAssigned}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {st.phone}
                      </p>
                      <p className="font-medium">
                        {profile.phone || st.notSet}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {st.address}
                      </p>
                      <p className="font-medium">
                        {profile.address || st.notSet}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {!isStudent && profile.departmentHead && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {st.headOfDepartment}
                    </p>
                    <p className="font-medium">{profile.departmentHead.name}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form 1: Username & Password (immediate update) */}
        <Card
          className={`border-border/50 shadow-lg mb-6 ${cooldownStatus !== null && !cooldownStatus.canUpdateProfile ? "opacity-70 pointer-events-none" : ""}`}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{st.updateImmediate}</CardTitle>
            <CardDescription>{st.updateImmediateDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...immediateForm}>
              <form
                onSubmit={immediateForm.handleSubmit(handleImmediateSubmit)}
                className="space-y-6"
              >
                {immediateForm.formState.errors.root && (
                  <p className="text-sm text-destructive">
                    {immediateForm.formState.errors.root.message}
                  </p>
                )}
                <FormField
                  control={immediateForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{st.username}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder={
                              dict.admin.students.usernamePlaceholder
                            }
                            className="pl-10"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      {st.passwordChange}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {st.passwordChangeDesc}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 items-start">
                    <FormField
                      control={immediateForm.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem className="grid grid-rows-[auto_auto_1fr] gap-2">
                          <FormLabel>{st.oldPassword}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              disabled={isSubmitting}
                              autoComplete="current-password"
                              {...field}
                            />
                          </FormControl>
                          <div className="min-h-5">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={immediateForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="grid grid-rows-[auto_auto_1fr] gap-2">
                          <FormLabel>{st.newPassword}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              disabled={isSubmitting}
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <div className="min-h-5">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={immediateForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="grid grid-rows-[auto_auto_1fr] gap-2">
                          <FormLabel>{st.confirmPassword}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              disabled={isSubmitting}
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <div className="min-h-5">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 h-11 shadow-md hover:shadow-lg transition-all duration-200 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="mr-2">{st.saving}</span>
                    ) : (
                      <>
                        {st.saveChanges}
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
            </Form>
          </CardContent>
        </Card>

        {/* Password update confirmation dialog */}
        <AlertDialog
          open={passwordConfirmDialogOpen}
          onOpenChange={(open) => {
            if (!open && !isSubmitting) {
              setPasswordConfirmDialogOpen(false);
              setPendingPasswordValues(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {st.passwordUpdateConfirmTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {st.passwordUpdateConfirmDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
              <AlertDialogAction
                onClick={handlePasswordConfirmRemain}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {st.remainAuthenticated}
              </AlertDialogAction>
              <Button
                variant="outline"
                onClick={handlePasswordConfirmLogout}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {st.logOutThisDevice}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Form 2: Request Profile Changes (requires approval) */}
        <Card
          className={`border-border/50 shadow-lg mb-6 ${cooldownStatus !== null && !cooldownStatus.canUpdateProfile ? "opacity-70 pointer-events-none" : ""}`}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{st.requestUpdate}</CardTitle>
            <CardDescription>{st.requestUpdateDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...requestForm}>
              <form
                onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={requestForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{st.fullName}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="text"
                              placeholder={
                                dict.admin.students.fullNamePlaceholder
                              }
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive text-sm" />
                      </FormItem>
                    )}
                  />
                  {isStudent && (
                    <>
                      <FormField
                        control={requestForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{st.phone}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder={
                                    dict.admin.students.phonePlaceholder
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-destructive text-sm" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={requestForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>{st.address}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder={
                                    dict.admin.students.addressPlaceholder
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-destructive text-sm" />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
                {isStudent && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={requestForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{st.gender}</FormLabel>
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={st.notSet} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">
                                {st.genderMale}
                              </SelectItem>
                              <SelectItem value="female">
                                {st.genderFemale}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-destructive text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requestForm.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{st.birthDate}</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage className="text-destructive text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requestForm.control}
                      name="citizenId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{st.citizenId}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder={
                                dict.admin.students.citizenIdPlaceholder
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="default"
                    className="flex-1 h-11"
                  >
                    {st.submitRequest}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* AlertDialog for request confirmation */}
        <AlertDialog
          open={requestDialogOpen}
          onOpenChange={setRequestDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{st.requestUpdateTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {st.requestUpdateConfirm}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{dict.common.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={handleRequestConfirm}>
                {st.submitRequest}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Webhooks Section */}
        <SettingsWebhooksSection
          role={profile.role}
          webhooks={webhooks.webhooks}
          loading={webhooks.loading}
          refetch={webhooks.refetch}
        />

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {st.needHelpElse}
          </p>
          <Button
            variant="link"
            onClick={() => router.push(`/${locale}/support`)}
            className="text-primary"
          >
            {st.contactSupport}
          </Button>
        </div>
      </div>
    </div>
  );
}
