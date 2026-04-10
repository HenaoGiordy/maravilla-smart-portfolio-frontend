import { Route, Routes } from "react-router"
import { AppLayout } from "@/components/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/portfolio"   element={<></>} />
        <Route path="/investments" element={<></>} />
        <Route path="/analysis"    element={<></>} />
        <Route path="/settings"    element={<></>} />
      </Route>
    </Routes>
  )
}
