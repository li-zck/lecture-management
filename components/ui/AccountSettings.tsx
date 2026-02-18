"use client";

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
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { lecturerApi } from "@/lib/api/lecturer";
import { studentApi } from "@/lib/api/student";
import { getClientDictionary, isLocale } from "@/lib/i18n";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    address: "",
    gender: "" as "" | "male" | "female",
    birthDate: "",
    citizenId: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Pre-fill form with current profile data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        username: profile.username || "",
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
      }));
    }
  }, [profile]);

  const handleImmediateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (formData.newPassword || formData.oldPassword) {
      if (!formData.oldPassword) {
        toast.error("Current password is required to change password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (profile.role === "student") {
        const payload: Parameters<typeof studentApi.updateProfile>[0] = {
          username: formData.username || undefined,
        };
        if (formData.newPassword) {
          payload.oldPassword = formData.oldPassword;
          payload.password = formData.newPassword;
        }
        await studentApi.updateProfile(payload);
      } else {
        const payload: Parameters<typeof lecturerApi.updateProfile>[0] = {
          username: formData.username || undefined,
        };
        if (formData.newPassword) {
          payload.oldPassword = formData.oldPassword;
          payload.password = formData.newPassword;
        }
        await lecturerApi.updateProfile(payload);
      }

      toast.success(st.successTitle, {
        description: st.successDescription,
      });
      await refetchProfile();
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestDialogOpen(true);
  };

  const handleRequestConfirm = () => {
    setRequestDialogOpen(false);
    toast.success(st.requestSuccessTitle, {
      description: st.requestSuccessDescription,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value as "" | "male" | "female",
    }));
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
    <div className="min-h-screen bg-background py-12 px-6">
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
        <Card className="border-border/50 shadow-lg mb-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{st.updateImmediate}</CardTitle>
            <CardDescription>{st.updateImmediateDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImmediateSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {st.username}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="john_doe"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="oldPassword"
                      className="text-sm font-medium"
                    >
                      {st.oldPassword}
                    </Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={formData.oldPassword}
                      onChange={(e) =>
                        handleChange("oldPassword", e.target.value)
                      }
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium"
                    >
                      {st.newPassword}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      {st.confirmPassword}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                  </div>
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
          </CardContent>
        </Card>

        {/* Form 2: Request Profile Changes (requires approval) */}
        <Card className="border-border/50 shadow-lg mb-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{st.requestUpdate}</CardTitle>
            <CardDescription>{st.requestUpdateDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    {st.fullName}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {isStudent && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {st.phone}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+84..."
                          value={formData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        {st.address}
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="address"
                          type="text"
                          placeholder="123 Street..."
                          value={formData.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isStudent && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{st.gender}</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={handleGenderChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={st.notSet} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{st.genderMale}</SelectItem>
                        <SelectItem value="female">
                          {st.genderFemale}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium">
                      {st.birthDate}
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        handleChange("birthDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizenId" className="text-sm font-medium">
                      {st.citizenId}
                    </Label>
                    <Input
                      id="citizenId"
                      type="text"
                      placeholder="123456789012"
                      value={formData.citizenId}
                      onChange={(e) =>
                        handleChange("citizenId", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  className="flex-1 h-11"
                >
                  {st.submitRequest}
                </Button>
              </div>
            </form>
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
