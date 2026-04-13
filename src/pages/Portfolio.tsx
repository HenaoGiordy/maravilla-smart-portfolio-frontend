import { Shield, TrendingUp, Zap, ArrowUpRight, Sparkles } from "lucide-react"
import { PieChart, Pie, Cell } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

// ── Datos estáticos por perfil ────────────────────────────────────────────────

type RiskLevel = "conservador" | "moderado" | "agresivo"

const portfolioData: Record<RiskLevel, {
  description: string
  variable: number
  fixed: number
  variableReturn: number
  fixedReturn: number
  variableInstruments: { name: string; pct: number; return: number }[]
  fixedInstruments: { name: string; pct: number; return: number }[]
}> = {
  conservador: {
    description:
      "Portafolio orientado a la preservación del capital con mínima exposición a la volatilidad del mercado. Ideal para horizontes de inversión cortos o perfil de riesgo bajo.",
    variable: 20,
    fixed: 80,
    variableReturn: 6.5,
    fixedReturn: 5.2,
    variableInstruments: [
      { name: "Acciones de alta bursatilidad", pct: 12, return: 7.0 },
      { name: "ETF mercado local",              pct: 8,  return: 5.8 },
    ],
    fixedInstruments: [
      { name: "CDTs (hasta 1 año)",  pct: 40, return: 12.5 },
      { name: "Bonos del Gobierno",  pct: 25, return: 11.0 },
      { name: "Fondos de liquidez",  pct: 15, return: 9.8  },
    ],
  },
  moderado: {
    description:
      "Portafolio balanceado que combina crecimiento patrimonial con estabilidad. Diseñado para inversores con horizonte de mediano plazo y tolerancia media al riesgo.",
    variable: 50,
    fixed: 50,
    variableReturn: 10.2,
    fixedReturn: 7.8,
    variableInstruments: [
      { name: "Acciones nacionales",  pct: 25, return: 11.5 },
      { name: "ETF internacional",    pct: 15, return: 9.2  },
      { name: "Fondos de acciones",   pct: 10, return: 9.8  },
    ],
    fixedInstruments: [
      { name: "CDTs (1-3 años)",     pct: 30, return: 12.8 },
      { name: "Bonos corporativos",  pct: 12, return: 10.5 },
      { name: "Títulos de deuda",    pct: 8,  return: 9.0  },
    ],
  },
  agresivo: {
    description:
      "Portafolio de alto crecimiento con exposición predominante a renta variable. Para inversores con horizonte largo y alta tolerancia a la volatilidad.",
    variable: 80,
    fixed: 20,
    variableReturn: 15.4,
    fixedReturn: 8.5,
    variableInstruments: [
      { name: "Acciones de crecimiento", pct: 35, return: 18.0 },
      { name: "ETF tecnología global",   pct: 25, return: 16.5 },
      { name: "Fondos de alto retorno",  pct: 20, return: 12.2 },
    ],
    fixedInstruments: [
      { name: "CDTs corto plazo",  pct: 12, return: 12.2 },
      { name: "Bonos high-yield",  pct: 8,  return: 11.5 },
    ],
  },
}

const riskMeta: Record<
  RiskLevel,
  { label: string; colorClass: string; badgeClass: string; Icon: typeof Shield }
> = {
  conservador: {
    label: "Bajo",
    colorClass: "text-sura-aqua",
    badgeClass: "border-sura-aqua/40 bg-sura-aqua/10 text-sura-aqua",
    Icon: Shield,
  },
  moderado: {
    label: "Moderado",
    colorClass: "text-primary",
    badgeClass: "border-sura-amarillo/50 bg-sura-amarillo/15 text-foreground",
    Icon: TrendingUp,
  },
  agresivo: {
    label: "Alto",
    colorClass: "text-primary",
    badgeClass: "border-primary/20 bg-primary/8 text-primary",
    Icon: Zap,
  },
}

const chartConfig = {
  variable: { label: "Renta Variable", color: "var(--sura-azul)" },
  fixed:    { label: "Renta Fija",     color: "var(--sura-aqua)" },
} satisfies ChartConfig

// ── Componente principal ──────────────────────────────────────────────────────

export default function Portfolio() {
  const { user, activeProfile } = useAuth()

  const riskKey = (activeProfile?.risk_level?.toLowerCase() ?? "moderado") as RiskLevel
  const data    = portfolioData[riskKey] ?? portfolioData.moderado
  const meta    = riskMeta[riskKey]      ?? riskMeta.moderado
  const RiskIcon = meta.Icon

  const pieData = [
    { name: "variable", value: data.variable },
    { name: "fixed",    value: data.fixed    },
  ]

  const avgTotal = (
    (data.variableReturn * data.variable + data.fixedReturn * data.fixed) / 100
  ).toFixed(1)

  return (
    <div className="flex flex-col gap-6 px-8 py-8">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-sura-azul px-8 py-7 shadow-md
                      dark:bg-sura-gris-oscuro dark:ring-1 dark:ring-sura-amarillo/25">
        <div className="pointer-events-none absolute -right-10 -top-10 size-52 rounded-full bg-white/5 dark:bg-sura-amarillo/10" />
        <div className="pointer-events-none absolute -bottom-8 right-24 size-40 rounded-full bg-sura-amarillo/15 dark:bg-sura-amarillo/20" />
        <div className="relative flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-sura-amarillo" />
              <span className="text-xs font-semibold uppercase tracking-widest text-sura-amarillo">
                Mi Portafolio
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-snug">
              {activeProfile?.name ?? "Tu portafolio inteligente"}
            </h1>
            <p className="max-w-md text-sm text-white/70 leading-relaxed">
              Composición y rendimiento estimado según tu perfil de inversión,{" "}
              {user?.name?.split(" ")[0] ?? "inversionista"}.
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 h-auto px-3 py-1.5 text-sm font-semibold hidden sm:flex",
              meta.badgeClass
            )}
          >
            <RiskIcon className="size-4" />
            Riesgo {meta.label}
          </Badge>
        </div>
      </div>

      {/* ── Descripción + Distribución: una al lado de la otra ──── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Card descripción */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Descripción del portafolio</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {data.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/50 px-5 py-4">
              <Metric label="Rendimiento promedio total">
                <span className={cn("text-2xl font-extrabold", meta.colorClass)}>
                  {avgTotal}%
                </span>
                <span className="text-xs text-muted-foreground"> / E.A</span>
              </Metric>
              <Metric label="Perfil de riesgo">
                <span className="text-sm font-semibold">{activeProfile?.risk_level ?? "Moderado"}</span>
              </Metric>
            </div>
          </CardContent>
        </Card>

        {/* Card distribución */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribución del portafolio</CardTitle>
            <CardDescription>Proporción entre renta variable y renta fija</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
            <ChartContainer config={chartConfig} className="h-40 w-full max-w-[160px] shrink-0">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68} strokeWidth={2}>
                  <Cell fill="var(--sura-azul)" />
                  <Cell fill="var(--sura-aqua)" />
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-3 flex-1 w-full">
              <LegendItem
                dotColor="var(--sura-azul)"
                label="Renta Variable"
                pct={data.variable}
                returnPct={data.variableReturn}
                returnColorClass="text-sura-azul dark:text-primary"
              />
              <LegendItem
                dotColor="var(--sura-aqua)"
                label="Renta Fija"
                pct={data.fixed}
                returnPct={data.fixedReturn}
                returnColorClass="text-sura-aqua"
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ── Instrumentos ─────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        <InstrumentsCard
          title="Renta Variable"
          subtitle="Acciones y ETFs"
          instruments={data.variableInstruments}
          avgReturn={data.variableReturn}
          accentClass="text-sura-azul"
          barColor="bg-primary"
          avgBgClass="border-primary/20 bg-primary/5"
        />
        <InstrumentsCard
          title="Renta Fija"
          subtitle="CDTs, bonos y fondos"
          instruments={data.fixedInstruments}
          avgReturn={data.fixedReturn}
          accentClass="text-sura-aqua"
          barColor="bg-sura-aqua"
          avgBgClass="border-sura-aqua/30 bg-sura-aqua/5"
        />
      </div>

    </div>
  )
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function LegendItem({
  dotColor, label, pct, returnPct, returnColorClass,
}: {
  dotColor: string
  label: string
  pct: number
  returnPct: number
  returnColorClass: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="size-2.5 shrink-0 rounded-full" style={{ background: dotColor }} />
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <p className="text-2xl font-extrabold leading-none">{pct}%</p>
      <div>
        <p className="text-[10px] text-muted-foreground">Rendimiento promedio</p>
        <p className={cn("text-sm font-bold", returnColorClass)}>+{returnPct}% E.A.</p>
      </div>
    </div>
  )
}

function InstrumentsCard({
  title, subtitle, instruments, avgReturn, accentClass, barColor, avgBgClass,
}: {
  title: string
  subtitle: string
  instruments: { name: string; pct: number; return: number }[]
  avgReturn: number
  accentClass: string
  barColor: string
  avgBgClass: string
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {instruments.map((inst) => (
          <div key={inst.name} className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{inst.name}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", barColor)}
                  style={{ width: `${inst.pct}%` }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold">{inst.pct}%</p>
              <p className={cn("text-xs font-semibold", accentClass)}>+{inst.return}% E.A.</p>
            </div>
          </div>
        ))}

        <div className={cn("mt-1 flex items-center justify-between rounded-xl border border-dashed px-4 py-3", avgBgClass)}>
          <div className="flex items-center gap-2">
            <ArrowUpRight className={cn("size-4", accentClass)} />
            <span className="text-sm font-semibold">Promedio {title}</span>
          </div>
          <span className={cn("text-lg font-extrabold", accentClass)}>
            +{avgReturn}% E.A.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
