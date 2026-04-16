import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <Navigate to="/select-role" replace />;
  }

  if (role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }

  if (role === "faculty") {
    return <Navigate to="/faculty-dashboard" replace />;
  }

  return <Navigate to="/" replace />;
} 