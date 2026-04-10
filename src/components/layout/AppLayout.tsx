import { Outlet } from "react-router"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function AppLayout() {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <SidebarInset className="overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center border-b bg-background px-4">
          <SidebarTrigger />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
