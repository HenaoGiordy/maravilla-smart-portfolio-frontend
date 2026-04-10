import {
  BarChart3,
  LayoutDashboard,
  PieChart,
  Settings,
  TrendingUp,
} from "lucide-react"
import { NavLink, useLocation } from "react-router"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { icon: LayoutDashboard, label: "Inicio",         to: "/"            },
  { icon: PieChart,        label: "Mi Portafolio",  to: "/portfolio"   },
  { icon: TrendingUp,      label: "Inversiones",    to: "/investments" },
  { icon: BarChart3,       label: "Análisis",       to: "/analysis"    },
  { icon: Settings,        label: "Configuración",  to: "/settings"    },
]

const mockUser = {
  name: "Giordy Pavel Henao",
  email: "giordy.henao@proteccion.com",
  initials: "GH",
}

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon">

      {/* ── Encabezado ─────────────────────────────────────────── */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:py-3">
        <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <TrendingUp className="size-[18px] text-sidebar-primary-foreground" />
          </div>
          <span className="text-[13px] font-semibold leading-snug text-sidebar-foreground group-data-[state=collapsed]:hidden">
            Mi Portafolio<br />Inteligente
          </span>
        </div>
      </SidebarHeader>

      {/* ── Navegación ─────────────────────────────────────────── */}
      <SidebarContent className="py-3">
        <SidebarGroup className="px-2 py-0">
          <SidebarMenu className="gap-0.5">
            {navItems.map(({ icon: Icon, label, to }) => {
              const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to)
              return (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    render={<NavLink to={to} end={to === "/"} />}
                    isActive={isActive}
                    tooltip={label}
                    className={cn(
                      "h-10 text-sidebar-foreground/65 [&_svg]:size-[18px]",
                      isActive && "border-l-[3px] border-sidebar-primary pl-[9px] group-data-[state=collapsed]:border-l-0 group-data-[state=collapsed]:pl-2"
                    )}
                  >
                    <Icon className={cn(
                      "shrink-0",
                      isActive ? "text-sidebar-primary" : "text-sidebar-foreground/65"
                    )} />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Usuario logueado ───────────────────────────────────── */}
      <SidebarFooter className="border-t border-sidebar-border px-4 py-4 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:py-3">
        <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[13px] font-bold text-sidebar-primary-foreground">
            {mockUser.initials}
          </div>
          <div className="min-w-0 group-data-[state=collapsed]:hidden">
            <p className="truncate text-[13px] font-semibold text-sidebar-foreground leading-tight">
              {mockUser.name}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/55 leading-tight mt-0.5">
              {mockUser.email}
            </p>
          </div>
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}
