import { CheckCircle2, ChevronRight, Shield, Sparkles, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const profiles = [
  {
    level: "Bajo",
    levelIcon: Shield,
    levelBadgeClass: "h-auto border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700",
    name: "Conservador",
    description: "Perfil de bajo riesgo con inversiones estables y predecibles",
    returnRange: "4-6%",
    returnClass: "text-emerald-600",
    features: ["Bonos del estado", "Fondos de renta fija", "Baja volatilidad"],
    buttonVariant: "outline" as const,
    cardClass: "border-emerald-100 hover:border-emerald-300",
  },
  {
    level: "Medio",
    levelIcon: TrendingUp,
    levelBadgeClass: "h-auto border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700",
    name: "Moderado",
    description: "Balance entre seguridad y crecimiento para inversores equilibrados",
    returnRange: "7-10%",
    returnClass: "text-amber-600",
    features: ["Mix de acciones y bonos", "Diversificación media", "Crecimiento estable"],
    buttonVariant: "secondary" as const,
    cardClass: "border-amber-100 hover:border-amber-300",
    featured: true,
  },
  {
    level: "Alto",
    levelIcon: Zap,
    levelBadgeClass: "h-auto border-primary/20 bg-primary/8 px-3 py-1 text-sm font-semibold text-primary",
    name: "Agresivo",
    description: "Máximo potencial de crecimiento para inversores con alta tolerancia",
    returnRange: "12-18%",
    returnClass: "text-primary",
    features: ["Acciones de crecimiento", "Alta volatilidad", "Máximo retorno potencial"],
    buttonVariant: "default" as const,
    cardClass: "border-primary/15 hover:border-primary/40",
  },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 px-8 py-8">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-sura-azul px-8 py-8 shadow-md">
        <div className="pointer-events-none absolute -right-10 -top-10 size-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 right-24 size-36 rounded-full bg-sura-amarillo/15" />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-sura-amarillo" />
              <span className="text-xs font-semibold uppercase tracking-widest text-sura-amarillo">
                Simulador inteligente
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-snug">
              ¡Bienvenido de nuevo, Juan!
            </h1>
            <p className="max-w-md text-sm text-white/70 leading-relaxed">
              Planifica tu futuro financiero con nuestras herramientas de
              simulación inteligente. Elige el perfil que mejor se adapte a
              tus objetivos.
            </p>
          </div>
          <div className="hidden shrink-0 items-center justify-center rounded-xl bg-white/10 p-4 md:flex">
            <TrendingUp className="size-10 text-sura-amarillo" />
          </div>
        </div>
      </div>

      {/* ── Encabezado sección ─────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Perfiles de Inversión</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona el perfil que mejor se ajuste a tu tolerancia al riesgo
        </p>
      </div>

      {/* ── Tarjetas de perfiles ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {profiles.map((profile) => {
          const LevelIcon = profile.levelIcon
          return (
            <div key={profile.name} className="relative">

              {profile.featured && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge variant="secondary" className="h-auto px-3 py-0.5 text-[11px] font-bold shadow-sm">
                    Más popular
                  </Badge>
                </div>
              )}

              <Card
                className={cn(
                  "ring-0 border transition-all duration-200 hover:shadow-md",
                  profile.cardClass,
                  profile.featured && "ring-2 ring-sura-amarillo ring-offset-2"
                )}
              >
                <CardHeader className="gap-3 pb-0">
                  <Badge variant="outline" className={profile.levelBadgeClass}>
                    <LevelIcon className="size-4" />
                    {profile.level}
                  </Badge>
                  <div>
                    <CardTitle className="text-lg font-bold">{profile.name}</CardTitle>
                    <CardDescription className="mt-1.5 text-xs leading-relaxed">
                      {profile.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <div className="rounded-xl bg-muted/60 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Retorno Esperado
                    </p>
                    <p className={cn("mt-1 text-3xl font-extrabold", profile.returnClass)}>
                      {profile.returnRange}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {profile.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <CheckCircle2 className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-xs text-foreground/80">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="border-0 bg-transparent">
                  <Button variant={profile.buttonVariant} className="w-full justify-between" size="lg">
                    Simular
                    <ChevronRight className="size-4" />
                  </Button>
                </CardFooter>
              </Card>

            </div>
          )
        })}
      </div>

    </div>
  )
}
