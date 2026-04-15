import { useState, useEffect } from "react"
import { Shield, TrendingUp, TrendingDown, Zap, ArrowUpRight, Sparkles } from "lucide-react"
import { PieChart, Pie, Cell } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { apiRequest } from "@/lib/api"
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
import { Skeleton } from "@/components/ui/skeleton"

// ── Datos estáticos por perfil ────────────────────────────────────────────────

type RiskLevel = "conservador" | "moderado" | "agresivo"

type DailyGain = {
  symbol: string
  name: string
  close: number | null
  change: number | null
  percent_change: number | null
  annual_return: number | null
}

const portfolioData: Record<RiskLevel, {
  description: string
  variable: number
  fixed: number
  variableReturn: number
  fixedReturn: number
  variableInstruments: { name: string; pct: number; return: number }[]
  fixedInstruments: { name: string; pct: number; return: number }[]
  symbols: [string, string, string]
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
    symbols: ["JNJ", "PG", "KO"],
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
    symbols: ["AAPL", "MSFT", "GOOGL"],
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
    symbols: ["NVDA", "TSLA", "META"],
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
  const { user, activeProfile, accessToken } = useAuth()

  const riskLevelMap: Record<string, RiskLevel> = {
    low: "conservador", medium: "moderado", high: "agresivo",
    conservador: "conservador", moderado: "moderado", agresivo: "agresivo",
  }
  const riskKey = riskLevelMap[activeProfile?.risk_level?.toLowerCase() ?? ""] ?? "moderado"
  const data    = portfolioData[riskKey] ?? portfolioData.moderado
  const meta    = riskMeta[riskKey]      ?? riskMeta.moderado
  const RiskIcon = meta.Icon

  const equityPct = activeProfile?.equity_allocation  || data.variable
  const fixedPct  = activeProfile?.fixed_income_allocation || data.fixed

  const [dailyGains, setDailyGains] = useState<DailyGain[]>([])
  const [gainsLoading, setGainsLoading] = useState(false)
  const [gainsError, setGainsError] = useState<string | null>(null)

  useEffect(() => {
    const symbols = data.symbols
    const query = symbols.map(s => `symbols=${s}`).join("&")
    setGainsLoading(true)
    setGainsError(null)
    apiRequest<DailyGain[]>(`/api/v1/market-data/daily-gains?${query}`, {}, accessToken)
      .then(setDailyGains)
      .catch((err: Error) => setGainsError(err.message))
      .finally(() => setGainsLoading(false))
  }, [riskKey, accessToken])

  const variableInstruments = dailyGains.length > 0
    ? data.variableInstruments.map((inst, i) => ({
        name:   dailyGains[i]?.name         ?? inst.name,
        pct:    inst.pct,
        return: dailyGains[i]?.annual_return ?? inst.return,
      }))
    : data.variableInstruments

  const variableAvgReturn = dailyGains.length > 0
    ? parseFloat(
        (dailyGains.reduce((sum, g) => sum + (g.annual_return ?? 0), 0) / dailyGains.length).toFixed(2)
      )
    : data.variableReturn

  const pieData = [
    { name: "variable", value: equityPct },
    { name: "fixed",    value: fixedPct  },
  ]

  const avgTotal = (
    (variableAvgReturn * equityPct + data.fixedReturn * fixedPct) / 100
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
            Perfil {activeProfile?.name}
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
                pct={equityPct}
                returnPct={variableAvgReturn}
                returnColorClass="text-sura-azul dark:text-primary"
              />
              <LegendItem
                dotColor="var(--sura-aqua)"
                label="Renta Fija"
                pct={fixedPct}
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
          instruments={variableInstruments}
          avgReturn={variableAvgReturn}
          accentClass="text-sura-azul"
          barColor="bg-primary"
          avgBgClass="border-primary/20 bg-primary/5"
          loading={gainsLoading}
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

      {/* ── Variación del día ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Variación del día — {data.symbols.join(", ")}
          </h2>
        </div>

        {gainsLoading && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        )}

        {gainsError && (
          <p className="text-sm text-destructive">{gainsError}</p>
        )}

        {!gainsLoading && !gainsError && dailyGains.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {dailyGains.map(gain => {
              const hasData = gain.close != null && gain.change != null && gain.percent_change != null
              const positive = hasData && gain.percent_change! >= 0
              return (
                <Card key={gain.symbol}>
                  <CardContent className="flex flex-col gap-2 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {gain.symbol}
                      </span>
                      {hasData && (positive
                        ? <TrendingUp className="size-4 text-emerald-500" />
                        : <TrendingDown className="size-4 text-destructive" />
                      )}
                    </div>
                    <p className="truncate text-sm font-medium">{gain.name ?? gain.symbol}</p>
                    {hasData ? (
                      <>
                        <p className="text-2xl font-extrabold leading-none">
                          ${gain.close!.toFixed(2)}
                        </p>
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-semibold",
                          positive ? "text-emerald-500" : "text-destructive"
                        )}>
                          <span>{positive ? "+" : ""}{gain.change!.toFixed(2)}</span>
                          <span className="text-xs">({positive ? "+" : ""}{gain.percent_change!.toFixed(2)}%)</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
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
  title, subtitle, instruments, avgReturn, accentClass, barColor, avgBgClass, loading = false,
}: {
  title: string
  subtitle: string
  instruments: { name: string; pct: number; return: number }[]
  avgReturn: number
  accentClass: string
  barColor: string
  avgBgClass: string
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading ? (
          <>
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
            <div className={cn("mt-1 flex items-center justify-between rounded-xl border border-dashed px-4 py-3", avgBgClass)}>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
