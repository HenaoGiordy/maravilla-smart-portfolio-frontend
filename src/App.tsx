import { Route, Routes, Navigate } from "react-router"
import { AppLayout } from "@/components/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"
import { Login } from "@/pages/Login"

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio"   element={<></>} />
        <Route path="/investments" element={<></>} />
        <Route path="/analysis"    element={<></>} />
        <Route path="/settings"    element={<></>} />
      </Route>
    </Routes>
  )
}