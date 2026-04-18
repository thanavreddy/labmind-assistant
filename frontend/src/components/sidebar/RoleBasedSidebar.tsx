/**
 * RoleBasedSidebar.tsx
 * 
 * Wrapper component that renders the appropriate sidebar based on the user's role.
 * - Faculty users see: FacultySidebar
 * - Student users see: StudentSidebar (original sidebar)
 * - Loading state: returns null (main AppLayout handles the skeleton)
 */

import { useAuth } from "@/contexts/AuthContext";
import { FacultySidebarContent } from "@/components/sidebar/FacultySidebar";

interface RoleBasedSidebarProps {
  collapsed: boolean;
}

export function RoleBasedSidebar({ collapsed }: RoleBasedSidebarProps) {
  const { role, loading } = useAuth();

  // Return null during loading — AppLayout will show a skeleton if needed
  if (loading) {
    return null;
  }

  // Render faculty sidebar for faculty users
  if (role === "faculty") {
    return <FacultySidebarContent collapsed={collapsed} />;
  }

  // For students and other roles, return null
  // The AppLayout will use the default student sidebar logic
  return null;
}

export default RoleBasedSidebar;
