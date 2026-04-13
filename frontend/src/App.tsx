import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Public pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import AuthCallback from '@/pages/AuthCallback'
import SelectRole from '@/pages/SelectRole'
import Dashboard from './pages/Dashboard'

// Protected pages (already built by Lovable)
import StudentDashboard from '@/pages/StudentDashboard'
import ProfessorDashboard from '@/pages/ProfessorDashboard'
import AIAssistant from '@/pages/AIAssistant'
import ConceptCheck from '@/pages/ConceptCheck'
import LabRecordEditor from '@/pages/LabRecordEditor'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/select-role" element={<SelectRole />} />

          {/* Smart redirect based on role */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Student only routes */}
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/assistant" element={
            <ProtectedRoute allowedRole="student">
              <AIAssistant />
            </ProtectedRoute>
          } />
          <Route path="/concept-check" element={
            <ProtectedRoute allowedRole="student">
              <ConceptCheck />
            </ProtectedRoute>
          } />
          <Route path="/lab-record" element={
            <ProtectedRoute allowedRole="student">
              <LabRecordEditor />
            </ProtectedRoute>
          } />

          {/* Teacher only routes */}
          <Route path="/professor-dashboard" element={
            <ProtectedRoute allowedRole="professor">
              <ProfessorDashboard />
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}