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
  adminRequestApi,
  type LecturerTeachingRequestAdmin,
  type LecturerTeachingRequestStatus,
  type ProfileUpdateRequestAdmin,
  type ProfileUpdateRequestStatus,
} from "@/lib/api/admin-request";
import { getErrorInfo } from "@/lib/api/error";
import { GraduationCap, Send, UserCog, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type EntityTab = "lecturer" | "student" | "profile";

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
  const [entityTab, setEntityTab] = useState<EntityTab>("lecturer");
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
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchLecturerRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const data = await adminRequestApi.getLecturerRequests(status);
      setLecturerRequests(data);
    } catch {
      toast.error("Failed to load lecturer requests");
      setLecturerRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchProfileRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status =
        profileStatusFilter === "all" ? undefined : profileStatusFilter;
      const data = await adminRequestApi.getProfileUpdateRequests(status);
      setProfileRequests(data);
    } catch {
      toast.error("Failed to load profile update requests");
      setProfileRequests([]);
    } finally {
      setLoading(false);
    }
  }, [profileStatusFilter]);

  useEffect(() => {
    if (entityTab === "lecturer") fetchLecturerRequests();
    if (entityTab === "profile") fetchProfileRequests();
  }, [entityTab, fetchLecturerRequests, fetchProfileRequests]);

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      await adminRequestApi.approveLecturerRequest(id);
      toast.success("Request approved. Lecturer assigned to course.");
      fetchLecturerRequests();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? "Failed to approve");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActingId(id);
    try {
      await adminRequestApi.rejectLecturerRequest(id);
      toast.success("Request rejected.");
      fetchLecturerRequests();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? "Failed to reject");
    } finally {
      setActingId(null);
    }
  };

  const handleApproveProfile = async (id: string) => {
    setActingId(id);
    try {
      await adminRequestApi.approveProfileUpdateRequest(id);
      toast.success("Profile update approved.");
      fetchProfileRequests();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? "Failed to approve");
    } finally {
      setActingId(null);
    }
  };

  const handleRejectProfile = async (id: string) => {
    setActingId(id);
    try {
      await adminRequestApi.rejectProfileUpdateRequest(id);
      toast.success("Profile update rejected.");
      fetchProfileRequests();
    } catch (err: unknown) {
      const { message } = getErrorInfo(err);
      toast.error(message ?? "Failed to reject");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests"
        description="Review and approve or reject lecturer teaching requests and student requests."
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
          <Button
            variant={entityTab === "lecturer" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEntityTab("lecturer")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Lecturer requests
          </Button>
          <Button
            variant={entityTab === "student" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEntityTab("student")}
            className="gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            Student requests
          </Button>
          <Button
            variant={entityTab === "profile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEntityTab("profile")}
            className="gap-2"
          >
            <UserCog className="h-4 w-4" />
            Profile updates
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
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {entityTab === "lecturer" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              Loading requests...
            </div>
          ) : lecturerRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Send className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No lecturer teaching requests
                  {statusFilter !== "all" ? ` with status ${statusFilter}` : ""}
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
                          {req.status}
                        </Badge>
                        {req.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(req.id)}
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(req.id)}
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? "Rejecting..." : "Reject"}
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
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Student request categories are not configured yet.
            </p>
          </CardContent>
        </Card>
      )}

      {entityTab === "profile" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              Loading requests...
            </div>
          ) : profileRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No profile update requests
                  {profileStatusFilter !== "all"
                    ? ` with status ${profileStatusFilter}`
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
                        <div className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">
                            Requested changes:{" "}
                          </span>
                          {Object.entries(req.requestedData)
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(", ")}
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
                          {req.status}
                        </Badge>
                        {req.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveProfile(req.id)}
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectProfile(req.id)}
                              disabled={actingId !== null}
                            >
                              {actingId === req.id ? "Rejecting..." : "Reject"}
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
    </div>
  );
}
