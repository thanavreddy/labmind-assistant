import { supabase } from "@/lib/supabase";

export const getUserProfile = async (userId: string) => {
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (student) return { ...student, role: "student" };

  const { data: faculty } = await supabase
    .from("faculty")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (faculty) return { ...faculty, role: "faculty" };

  return null;
};