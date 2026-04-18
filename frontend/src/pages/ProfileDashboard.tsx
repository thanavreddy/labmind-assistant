import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { toast } from "@/components/ui/sonner";

// UI
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

// Icons
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

interface Profile {
  id: string;
  email: string;
  name: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
  role: "student" | "faculty";
}

interface ProfileForm {
  name: string;
  department: string;
}

// ---------------------------------------------------------------------------

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ---------------------------------------------------------------------------

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: Profile["role"] }) {
  if (role === "faculty") {
    return (
      <Badge className="gap-1.5 bg-amber-500/15 text-amber-500 border border-amber-500/30">
        <BookOpen className="h-3 w-3" />
        Faculty
      </Badge>
    );
  }

  return (
    <Badge className="gap-1.5 bg-primary/15 text-primary border border-primary/30">
      <GraduationCap className="h-3 w-3" />
      Student
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProfileDashboard() {
  const { user, role } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    department: "",
  });

  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch Profile
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!user || !role) return;

    const fetchProfile = async () => {
      setFetchLoading(true);

      try {
        const table = role === "student" ? "students" : "faculty";

        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setFetchError("Profile not found.");
          return;
        }

        setProfile({ ...data, role });

        setForm({
          name: data.name ?? "",
          department: data.department ?? "",
        });
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load profile.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, [user, role]);

  // ---------------------------------------------------------------------------
  // Form Change
  // ---------------------------------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);

    const table = profile.role === "student" ? "students" : "faculty";

    const { error } = await supabase
      .from(table)
      .update({
        name: form.name.trim() || null,
        department: form.department.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to save changes.");
      return;
    }

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            name: form.name,
            department: form.department,
          }
        : prev
    );

    toast.success("Profile updated!");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs uppercase text-muted-foreground tracking-widest">
            Account
          </p>
          <h1 className="text-3xl font-bold">
            {role === "student" ? "Student Profile" : "Faculty Profile"}
          </h1>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-primary">Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-6">

            {/* Loading */}
            {fetchLoading && <ProfileSkeleton />}

            {/* Error */}
            {fetchError && (
              <p className="text-red-500 text-sm">{fetchError}</p>
            )}

            {/* Profile */}
            {!fetchLoading && profile && (
              <form onSubmit={handleSave} className="space-y-6">

                {/* Identity */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full text-primary bg-primary/20 flex items-center justify-center">
                    {profile.name?.charAt(0).toUpperCase() ||
                      profile.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-primary">
                      {profile.name || "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                    <RoleBadge role={profile.role} />
                  </div>
                </div>

                {/* Fields */}
                <div className="grid gap-4">

                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <Input value={profile.email} 
                      className="text-primary"
                     disabled />
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <Input
                      name="name"
                      value={form.name}
                      className="text-primary"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <Input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="text-primary"
                    />
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Member Since</Label>
                    <Input
                      value={formatDate(profile.created_at)}
                      disabled
                      className="text-primary"

                    />
                  </div>

                </div>

                {/* Role-specific section */}
                {profile.role === "student" && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-1">Student Info</h3>
                    <p className="text-sm text-muted-foreground">
                      Access your courses, complete experiments, and submit records.
                    </p>
                  </div>
                )}

                {profile.role === "faculty" && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-1">Faculty Info</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage courses, create experiments, and evaluate students.
                    </p>
                  </div>
                )}

                {/* Save */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>

              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}