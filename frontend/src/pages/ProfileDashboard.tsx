/**
 * ProfileDashboard.tsx
 *
 * Displays and allows editing of the authenticated user's profile.
 * Fetches data from Supabase `profiles` table using the logged-in user's ID.
 * Supports updating `full_name` and `department` with success/error toasts.
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { toast } from "@/components/ui/sonner";

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// Lucide icons
import {
  User,
  Mail,
  Building2,
  CalendarDays,
  ShieldCheck,
  Save,
  Loader2,
  GraduationCap,
  BookOpen,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of a row from the `profiles` table. */
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
  role: "student" | "faculty";
}

/** Editable fields exposed in the form. */
interface ProfileForm {
  full_name: string;
  department: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format an ISO date string to a human-readable date. */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ---------------------------------------------------------------------------
// Skeleton loader shown while the profile is being fetched
// ---------------------------------------------------------------------------

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Role badge component
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: Profile["role"] }) {
  if (role === "faculty") {
    return (
      <Badge className="gap-1.5 bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20">
        <BookOpen className="h-3 w-3" />
        Faculty
      </Badge>
    );
  }

  if (role === "student") {
    return (
      <Badge className="gap-1.5 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20">
        <GraduationCap className="h-3 w-3" />
        Student
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <ShieldCheck className="h-3 w-3" />
      Unassigned
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function ProfileDashboard() {
  const { user } = useAuth();

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form state (editable fields only)
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    department: "",
  });

  // Save state
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch profile on mount
  // ---------------------------------------------------------------------------

useEffect(() => {
  if (!user) return;

  const fetchProfile = async () => {
    setFetchLoading(true);
    setFetchError(null);

    try {
      // Check Students Table
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (studentError) throw studentError;

      console.log(student);
      if (student) {
        setProfile({ ...student, role: "student" });
        setForm({
          full_name: student.name ?? "",
          department: student.department ?? "",
        });
        setFetchLoading(false);
        return;
      }

      // Check Faculty Table
      const { data: faculty, error: facultyError } = await supabase
        .from("faculty")
        .select("id, email, full_name, department, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (facultyError) throw facultyError;

      if (faculty) {
        setProfile({ ...faculty, role: "faculty" });
        setForm({
          full_name: faculty.full_name ?? "",
          department: faculty.department ?? "",
        });
        setFetchLoading(false);
        return;
      }

      setFetchError("Profile not found.");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setFetchError("Failed to load profile. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  fetchProfile();
}, [user]);

  // ---------------------------------------------------------------------------
  // Handle form input changes
  // ---------------------------------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------------------------------------------------------------------
  // Save updated profile to Supabase
  // ---------------------------------------------------------------------------

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !profile) return;

  setSaving(true);

  const tableName = profile.role === "student" ? "students" : "faculty";

  const { error } = await supabase
    .from(tableName)
    .update({
      full_name: form.full_name.trim() || null,
      department: form.department.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  setSaving(false);

  if (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to save changes. Please try again.");
    return;
  }

  setProfile((prev) =>
    prev
      ? {
          ...prev,
          full_name: form.full_name.trim() || null,
          department: form.department.trim() || null,
          updated_at: new Date().toISOString(),
        }
      : prev
  );

  toast.success("Profile updated successfully!");
};

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-3xl mx-auto">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="mb-10 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
            Account Settings
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            My Profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your personal information and account details.
          </p>
        </div>

        {/* ── Content card ───────────────────────────────────────────────── */}
        <Card className="glass-card border opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-primary">
                  Profile Information
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Your email and role are managed by the system and cannot be
                  changed here.
                </CardDescription>
              </div>
              {/* Role badge — rendered once profile loads */}
              {!fetchLoading && profile && (
                <RoleBadge role={profile.role} />
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* ── Loading skeleton ─────────────────────────────────────── */}
            {fetchLoading && <ProfileSkeleton />}

            {/* ── Fetch error ──────────────────────────────────────────── */}
            {!fetchLoading && fetchError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {fetchError}
              </div>
            )}

            {/* ── Profile form ─────────────────────────────────────────── */}
            {!fetchLoading && !fetchError && profile && (
              <form onSubmit={handleSave} className="space-y-8">

                {/* Avatar / identity strip */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                  {/* Avatar initials */}
                  <div className="h-14 w-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary select-none">
                      {(profile.full_name ?? profile.email)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {profile.full_name || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {profile.email}
                    </p>
                    <div className="mt-1.5">
                      <RoleBadge role={profile.role} />
                    </div>
                  </div>
                </div>

                {/* Fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ── Email (read-only) ─────────────────────────────── */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      <Mail className="h-3 w-3" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="text-white"
                      aria-label="Email address (read-only)"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Contact admin to change your email.
                    </p>
                  </div>

                  {/* ── Full Name (editable) ──────────────────────────── */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="full_name"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground   uppercase tracking-wider"
                    >
                      <User className="h-3 w-3" />
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      maxLength={255}
                      aria-label="Full name"
                      className="text-muted-foreground"
                    />
                  </div>

                  {/* ── Role (read-only) ──────────────────────────────── */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      Role
                    </Label>
                    <Input
                      id="role"
                      type="text"
                      value={
                        profile.role
                          ? profile.role.charAt(0).toUpperCase() +
                            profile.role.slice(1)
                          : "Not assigned"
                      }
                      disabled
                      className="text-white"
                      aria-label="Role (read-only)"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Role is assigned during sign-up.
                    </p>
                  </div>

                  {/* ── Department (editable) ─────────────────────────── */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="department"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      <Building2 className="h-3 w-3" />
                      Department
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      value={form.department}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      maxLength={100}
                      aria-label="Department"
                    />
                  </div>

                  {/* ── Account created (read-only) ───────────────────── */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="created_at"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      <CalendarDays className="h-3 w-3" />
                      Member Since
                    </Label>
                    <Input
                      id="created_at"
                      type="text"
                      value={formatDate(profile.created_at)}
                      disabled
                      className="text-white"
                      aria-label="Account creation date (read-only)"
                    />
                  </div>
                </div>

                <Separator />

                {/* Save button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="gap-2 min-w-[140px]"
                    id="save-profile-btn"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ── Last updated note ───────────────────────────────────────────── */}
        {profile && !fetchLoading && (
          <p
            className="text-center text-[10px] text-muted-foreground font-mono tracking-wider mt-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Last updated · {formatDate(profile.updated_at)}
          </p>
        )}
      </div>
    </AppLayout>
  );
}
