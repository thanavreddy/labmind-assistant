import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "student" | "faculty";
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}