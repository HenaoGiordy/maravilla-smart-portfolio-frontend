import { type ReactNode } from "react"
import { Navigate, Route, Routes } from "react-router"
import { AppLayout } from "@/components/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Quiz from "@/pages/Quiz"
import QuizResult from "@/pages/QuizResult"
import { useAuth } from "@/context/AuthContext"

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function OnboardingRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.onboarding_completed) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quiz" element={<OnboardingRoute><Quiz /></OnboardingRoute>} />
      <Route path="/quiz-result" element={<OnboardingRoute><QuizResult /></OnboardingRoute>} />

      <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="/portfolio"   element={<></>} />
        <Route path="/investments" element={<></>} />
        <Route path="/analysis"    element={<></>} />
        <Route path="/settings"    element={<></>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}