"use client";

import { PageHeader } from "@/components/ui/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Label } from "@/components/ui/shadcn/label";
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  adminRequestApi,
  type CourseWithdrawalRequestAdmin,
  type CourseWithdrawalRequestStatus,
  type LecturerTeachingRequestAdmin,
  type LecturerTeachingRequestStatus,
  type ProfileUpdateRequestAdmin,
  type ProfileUpdateRequestStatus,
} from "@/lib/api/admin-request";
import { getErrorInfo } from "@/lib/api/error";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { GraduationCap, Send, UserCog, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type EntityTab = "lecturer" | "student" | "profile";

const rejectReasonSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters").trim(),
});

const REQUEST_FIELD_KEYS = [
  "fullName",
  "phone",
  "address",
  "gender",
  "birthDate",
  "citizenId",
] as const;

function formatTime(minutes: number | null): string {
  if (minutes === null) return "TBA";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function RequestsManagementPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.requests;

  const searchParams = useSearchParams();
  const initialTabFromUrl =
    (searchParams.get("tab") as EntityTab | null) ?? "lecturer";

  const [entityTab, setEntityTab] = useState<EntityTab>(initialTabFromUrl);
  const [statusFilter, setStatusFilter] = useState<
    LecturerTeachingRequestStatus | "all"
  >("all");
  const [profileStatusFilter, setProfileStatusFilter] = useState<
    ProfileUpdateRequestStatus | "all"
  >("all");
  const [lecturerRequests, setLecturerRequests] = useState<
    LecturerTeachingRequestAdmin[]
  >([]);
  const [profileRequests, setProfileRequests] = useState<
    ProfileUpdateRequestAdmin[]
  >([]);
  const [studentStatusFilter, setStudentStatusFilter] = useState<
    CourseWithdrawalRequestStatus | "all"
  >("all");
  const [studentRequests, setStudentRequests] = useState<
    CourseWithdrawalRequestAdmin[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [rejectContext, setRejectContext] = useState<{
    type: EntityTab | null;
    id: string | null;
  }>({ type: null, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [submittingReject, setSubmittingReject] = useState(false);

  const fetchLecturerRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const data = await adminRequestApi.getLecturerRequests(status);
      setLecturerRequests(data);
    } catch {
      toast.error(t.loadLecturerFailed);
      setLecturerRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, t]);

  const fetchProfileRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status =
        profileStatusFilter === "all" ? undefined : profileStatusFilter;
      const data = await adminRequestApi.getProfileUpdateRequests(status);
      setProfileRequests(data);
    } catch {
      toast.error(t.loadProfileFailed);
      setProfileRequests([]);
    } finally {
      setLoading(false);
    }
  }, [profileStatusFilter, t]);

  const fetchStudentRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status =
        studentStatusFilter === "all" ? undefined : studentStatusFilter;
      const data = await adminRequestApi.getStudentWithdrawalRequests(status);
      setStudentRequests(data);
    } catch {
      toast.error(t.loadStudentFailed ?? t.loadLecturerFailed);
      setStudentRequests([]);
    } finally {
      setLoading(false);
    }
  }, [studentStatusFilter, t]);

  useEffect(() => {
    if (entityTab === "lecturer") fetchLecturerRequests();
    if (entityTab === "profile") fetchProfileRequests();
    if (entityTab === "student") fetchStudentRequests();
  }, [
    entityTab,
    fetchLecturerRequests,
    fetchProfileRequests,
    fetchStudentRequests,
  ]);

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      await adminRequestApi.approveLecturerRequest(id);
      toast.success(t.approvedAssigned);
      fetchLecturerRequests();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? t.approvedFailed);
    } finally {
      setActingId(null);
    }
  };

  const openRejectDialog = (type: EntityTab, id: string) => {
    setRejectContext({ type, id });
    setRejectReason("");
    setRejectError(null);
  };

  const closeRejectDialog = () => {
    setRejectContext({ type: null, id: null });
    setRejectReason("");
    setRejectError(null);
    setSubmittingReject(false);
  };

  const handleConfirmReject = async () => {
    if (!rejectContext.type || !rejectContext.id) return;

    const parsed = rejectReasonSchema.safeParse({ reason: rejectReason });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setRejectError(issue?.message ?? "Reason must be at least 10 characters");
      return;
    }

    setSubmittingReject(true);
    setActingId(rejectContext.id);

    try {
      if (rejectContext.type === "lecturer") {
        await adminRequestApi.rejectLecturerRequest(
          rejectContext.id,
          parsed.data.reason,
        );
        toast.success(t.rejectedSuccess);
        await fetchLecturerRequests();
      } else if (rejectContext.type === "student") {
        await adminRequestApi.rejectStudentWithdrawalRequest(
          rejectContext.id,
          parsed.data.reason,
        );
        toast.success(t.rejected);
        await fetchStudentRequests();
      } else if (rejectContext.type === "profile") {
        await adminRequestApi.rejectProfileUpdateRequest(
          rejectContext.id,
          parsed.data.reason,
        );
        toast.success(t.profileRejected);
        await fetchProfileRequests();
      }
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? t.rejectedFailed);
    } finally {
      setActingId(null);
      closeRejectDialog();
    }
  };

  const handleApproveProfile = async (id: string) => {
    setActingId(id);
    try {
      await adminRequestApi.approveProfileUpdateRequest(id);
      toast.success(t.profileApproved);
      fetchProfileRequests();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? t.profileApprovedFailed);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} description={t.description} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
          <Button
            variant={entityTab === "lecturer" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEntityTab("lecturer")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {t.lecturerRequests}
          </Button>
          <Button
            variant={entityTab === "student" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEntityTab("student")}
            className="gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            {t.studentRequests}
          </Button>
          <Button
            variant={entityTab === "profile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEntityTab("profile")}
            className="gap-2"
          >
            <UserCog className="h-4 w-4" />
            {t.profileUpdates}
          </Button>
        </div>

        {entityTab === "profile" && (
          <Select
            value={profileStatusFilter}
            onValueChange={(v) =>
              setProfileStatusFilter(v as ProfileUpdateRequestStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              <SelectItem value="PENDING">{t.pending}</SelectItem>
              <SelectItem value="APPROVED">{t.approved}</SelectItem>
              <SelectItem value="REJECTED">{t.rejected}</SelectItem>
            </SelectContent>
          </Select>
        )}
        {entityTab === "lecturer" && (
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as LecturerTeachingRequestStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              <SelectItem value="PENDING">{t.pending}</SelectItem>
              <SelectItem value="APPROVED">{t.approved}</SelectItem>
              <SelectItem value="REJECTED">{t.rejected}</SelectItem>
            </SelectContent>
          </Select>
        )}
        {entityTab === "student" && (
          <Select
            value={studentStatusFilter}
            onValueChange={(v) =>
              setStudentStatusFilter(v as CourseWithdrawalRequestStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              <SelectItem value="PENDING">{t.pending}</SelectItem>
              <SelectItem value="APPROVED">{t.approved}</SelectItem>
              <SelectItem value="REJECTED">{t.rejected}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {entityTab === "lecturer" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              {t.loadingRequests}
            </div>
          ) : lecturerRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Send className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t.noLecturerRequests}
                  {statusFilter !== "all"
                    ? ` ${t.withStatus} ${statusFilter}`
                    : ""}
                  .
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lecturerRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {req.lecturer.fullName ?? req.lecturer.lecturerId} (
                          {req.lecturer.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {req.courseOnSemester.course.name}
                          {req.courseOnSemester.course.department && (
                            <span>
                              {" "}
                              · {req.courseOnSemester.course.department.name}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.courseOnSemester.semester.name}
                          {req.courseOnSemester.dayOfWeek != null && (
                            <span>
                              {" "}
                              · {DAYS[req.courseOnSemester.dayOfWeek]},{" "}
                              {formatTime(req.courseOnSemester.startTime)} -{" "}
                              {formatTime(req.courseOnSemester.endTime)}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            req.status === "PENDING"
                              ? "secondary"
                              : req.status === "APPROVED"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {req.status === "PENDING"
                            ? t.pending
                            : req.status === "APPROVED"
                              ? t.approved
                              : t.rejected}
                        </Badge>
                        {req.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(req.id)}
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? t.approving : t.approve}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openRejectDialog("lecturer", req.id)
                              }
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? t.rejecting : t.reject}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {entityTab === "student" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              {t.loadingRequests}
            </div>
          ) : studentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t.noStudentRequests}
                  {studentStatusFilter !== "all"
                    ? ` ${t.withStatus} ${studentStatusFilter}`
                    : ""}
                  .
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {studentRequests.map((req) => {
                const courseOnSemester = req.enrollment?.courseOnSemester;
                const course = courseOnSemester?.course;
                const semester = courseOnSemester?.semester;

                return (
                  <Card key={req.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {req.student.fullName ??
                              req.student.studentId ??
                              req.student.email}{" "}
                            ({req.student.email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {course?.name ?? "Unknown course"}
                            {course?.department && (
                              <span> · {course.department.name}</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {semester?.name ?? "Unknown semester"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Reason:</span>
                            {req.reason}
                          </p>
                          {req.details && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {req.details}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              req.status === "PENDING"
                                ? "secondary"
                                : req.status === "APPROVED"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {req.status === "PENDING"
                              ? t.pending
                              : req.status === "APPROVED"
                                ? t.approved
                                : t.rejected}
                          </Badge>
                          {req.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  setActingId(req.id);
                                  try {
                                    await adminRequestApi.approveStudentWithdrawalRequest(
                                      req.id,
                                    );
                                    toast.success(t.approved);
                                    fetchStudentRequests();
                                  } catch (err: unknown) {
                                    const { message } = getErrorInfo(err);
                                    toast.error(message ?? t.approvedFailed);
                                  } finally {
                                    setActingId(null);
                                  }
                                }}
                                disabled={actingId !== null}
                              >
                                {actingId === req.id ? t.approving : t.approve}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openRejectDialog("student", req.id)
                                }
                                disabled={actingId !== null}
                              >
                                {actingId === req.id ? t.rejecting : t.reject}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {entityTab === "profile" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              {t.loadingRequests}
            </div>
          ) : profileRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t.noProfileRequests}
                  {profileStatusFilter !== "all"
                    ? ` ${t.withStatus} ${profileStatusFilter}`
                    : ""}
                  .
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {profileRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {req.user?.fullName ??
                            req.user?.studentId ??
                            req.user?.lecturerId}{" "}
                          ({req.user?.email})
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {req.role}
                        </p>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <span className="font-medium block">
                            {t.requestedChanges}
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 pl-2">
                            {(
                              Object.keys(req.requestedData) as Array<
                                keyof typeof req.requestedData
                              >
                            )
                              .filter(
                                (k) =>
                                  req.requestedData[k] !== undefined &&
                                  req.requestedData[k] !== null,
                              )
                              .sort((a, b) => {
                                const ia = REQUEST_FIELD_KEYS.indexOf(
                                  a as (typeof REQUEST_FIELD_KEYS)[number],
                                );
                                const ib = REQUEST_FIELD_KEYS.indexOf(
                                  b as (typeof REQUEST_FIELD_KEYS)[number],
                                );
                                if (ia >= 0 && ib >= 0) return ia - ib;
                                if (ia >= 0) return -1;
                                if (ib >= 0) return 1;
                                return String(a).localeCompare(String(b));
                              })
                              .map((key) => {
                                const value = req.requestedData[key];
                                const st = dict.settings;
                                const label =
                                  key === "fullName"
                                    ? st.fullName
                                    : key === "phone"
                                      ? st.phone
                                      : key === "address"
                                        ? st.address
                                        : key === "gender"
                                          ? st.gender
                                          : key === "birthDate"
                                            ? st.birthDate
                                            : key === "citizenId"
                                              ? st.citizenId
                                              : key;
                                const displayValue =
                                  key === "gender"
                                    ? value === "male"
                                      ? st.genderMale
                                      : value === "female"
                                        ? st.genderFemale
                                        : String(value)
                                    : String(value);
                                return (
                                  <li key={key}>
                                    <span className="font-medium">
                                      {label}:
                                    </span>{" "}
                                    {displayValue}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            req.status === "PENDING"
                              ? "secondary"
                              : req.status === "APPROVED"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {req.status === "PENDING"
                            ? t.pending
                            : req.status === "APPROVED"
                              ? t.approved
                              : t.rejected}
                        </Badge>
                        {req.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveProfile(req.id)}
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? t.approving : t.approve}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openRejectDialog("profile", req.id)
                              }
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? t.rejecting : t.reject}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog
        open={rejectContext.type !== null}
        onOpenChange={(open) => {
          if (!open) closeRejectDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject request</DialogTitle>
            <DialogDescription>
              Please provide a brief explanation for this rejection. This reason
              may be shown to the requester.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (rejectError) setRejectError(null);
                }}
                rows={4}
                placeholder="Reason must be at least 10 characters"
              />
              {rejectError && (
                <p className="text-sm text-destructive">{rejectError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeRejectDialog}
              disabled={submittingReject}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={submittingReject}
            >
              {submittingReject ? t.rejecting : t.reject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
