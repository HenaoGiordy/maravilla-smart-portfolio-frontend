import { useState, useMemo } from "react"
import { useLocation } from "react-router"
import {
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Calendar, Shield, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Hex de la paleta Sura (recharts no entiende clases Tailwind)
const SURA_AQUA   = "#00AEC7"
const SURA_AZUL   = "#0033A0"
const SURA_YELLOW = "#9ca800"   // amarillo oscurecido para legibilidad en gráfica
const SURA_GRAY   = "#53565A"

const profiles = {
  conservador: {
    name: "Conservador",
    return: 0.05,
    risk: "Bajo",
    chartColor: SURA_AQUA,
    badgeClass:  "border-sura-aqua/40 bg-sura-aqua/10 text-sura-aqua",
    borderClass: "border-sura-aqua/40",
    activeBorder: "border-sura-aqua",
    activeBg: "bg-sura-aqua/5",
  },
  moderado: {
    name: "Moderado",
    return: 0.085,
    risk: "Medio",
    chartColor: SURA_YELLOW,
    badgeClass:  "border-sura-amarillo/50 bg-sura-amarillo/15 text-sura-gris-oscuro dark:text-sura-amarillo",
    borderClass: "border-sura-amarillo/40",
    activeBorder: "border-sura-amarillo",
    activeBg: "bg-sura-amarillo/5",
  },
  agresivo: {
    name: "Agresivo",
    return: 0.15,
    risk: "Alto",
    chartColor: SURA_AZUL,
    badgeClass:  "border-primary/20 bg-primary/10 text-primary",
    borderClass: "border-primary/30",
    activeBorder: "border-primary",
    activeBg: "bg-primary/5",
  },
}

type ProfileKey = keyof typeof profiles

function calcFV(monthly: number, annualRate: number, years: number) {
  const months = years * 12
  const r = annualRate / 12
  if (r === 0) return monthly * months
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
}

export default function Simulator() {
  const location = useLocation()
  const initialProfile: ProfileKey = (location.state?.profile as ProfileKey) ?? "moderado"

  const [monthly, setMonthly]           = useState(500)
  const [horizon, setHorizon]           = useState(15)
  const [profile, setProfile]           = useState<ProfileKey>(initialProfile)
  const [compareMode, setCompareMode]   = useState(false)
  const [compared, setCompared]         = useState<ProfileKey[]>(["moderado", "agresivo"])

  // ── Datos de proyección (modo simple) ─────────────────────────
  const projectionData = useMemo(() => {
    const { return: rate } = profiles[profile]
    return Array.from({ length: horizon + 1 }, (_, year) => {
      const fv       = year === 0 ? 0 : calcFV(monthly, rate, year)
      const invested = monthly * year * 12
      return {
        year,
        invertido: Math.round(invested),
        ganancia:  Math.round(Math.max(0, fv - invested)),
      }
    })
  }, [monthly, horizon, profile])

  // ── Datos de comparación ───────────────────────────────────────
  const comparisonData = useMemo(() => {
    if (!compareMode) return []
    return Array.from({ length: horizon + 1 }, (_, year) => {
      const row: Record<string, number> = { year }
      compared.forEach((key) => {
        row[profiles[key].name] = Math.round(year === 0 ? 0 : calcFV(monthly, profiles[key].return, year))
      })
      return row
    })
  }, [monthly, horizon, compareMode, compared])

  const last        = projectionData[projectionData.length - 1]
  const finalValue  = (last?.invertido ?? 0) + (last?.ganancia ?? 0)
  const invested    = last?.invertido ?? 0
  const earnings    = last?.ganancia  ?? 0
  const roi         = invested > 0 ? ((earnings / invested) * 100).toFixed(1) : "0"

  const toggleCompare = (key: ProfileKey) => {
    setCompared((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : prev.length < 3 ? [...prev, key] : prev
    )
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">

      {/* ── Encabezado ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Simulador de Inversiones</h1>
          <p className="text-sm text-muted-foreground">
            Proyecta el crecimiento de tus inversiones a lo largo del tiempo
          </p>
        </div>
        <Button
          variant={compareMode ? "default" : "outline"}
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? "Modo simple" : "Comparar perfiles"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Panel de configuración ───────────────────────────── */}
        <div className="flex flex-col gap-4 lg:col-span-1">

          {/* Inversión mensual */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="size-4 text-primary" />
                Inversión Mensual
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="pl-7"
                  min={100}
                  step={100}
                />
              </div>
              <input
                type="range"
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                min={100} max={5000} step={100}
                className="w-full accent-sura-azul dark:accent-sura-amarillo"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$100</span><span>$5,000</span>
              </div>
            </CardContent>
          </Card>

          {/* Horizonte temporal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="size-4 text-primary" />
                Horizonte Temporal
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  type="number"
                  value={horizon}
                  onChange={(e) => setHorizon(Math.min(40, Math.max(1, Number(e.target.value))))}
                  className="pr-12 text-center text-lg font-semibold"
                  min={1}
                  max={40}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">años</span>
              </div>
              <input
                type="range"
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                min={1} max={40}
                className="w-full accent-sura-azul dark:accent-sura-amarillo"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 año</span><span>40 años</span>
              </div>
            </CardContent>
          </Card>

          {/* Selección de perfil */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Shield className="size-4 text-primary" />
                {compareMode ? "Seleccionar perfiles (máx. 3)" : "Perfil de Riesgo"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {(Object.keys(profiles) as ProfileKey[]).map((key) => {
                const p         = profiles[key]
                const isActive  = compareMode ? compared.includes(key) : profile === key
                return (
                  <button
                    key={key}
                    onClick={() => compareMode ? toggleCompare(key) : setProfile(key)}
                    className={cn(
                      "w-full rounded-lg border-2 p-3 text-left transition-all",
                      isActive ? `${p.activeBorder} ${p.activeBg}` : `border-border hover:${p.activeBorder}/50`
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Riesgo {p.risk}</p>
                      </div>
                      {compareMode ? (
                        <div className={cn(
                          "flex size-5 items-center justify-center rounded border-2",
                          isActive ? "border-primary bg-primary" : "border-border"
                        )}>
                          {isActive && (
                            <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{(p.return * 100).toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">E.A.</p>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* ── Panel de resultados ──────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Tarjetas resumen (solo modo simple) */}
          {!compareMode && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-0 bg-sura-azul dark:bg-sura-gris-oscuro text-white">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="size-4 opacity-80" />
                    <p className="text-xs opacity-80">Valor Final</p>
                  </div>
                  <p className="text-2xl font-bold">${finalValue.toLocaleString()}</p>
                  <p className="mt-1 text-xs opacity-60">En {horizon} años</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="size-4" />
                    <p className="text-xs">Total Invertido</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${invested.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${monthly}/mes × {horizon * 12} meses
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-sura-aqua text-white">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <ArrowUpRight className="size-4 opacity-80" />
                    <p className="text-xs opacity-80">Ganancias</p>
                  </div>
                  <p className="text-2xl font-bold">${earnings.toLocaleString()}</p>
                  <p className="mt-1 text-xs opacity-60">ROI: {roi}%</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gráfica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {compareMode ? "Comparación de Perfiles" : "Proyección de Crecimiento"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                {compareMode ? (
                  <LineChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="year"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      label={{ value: "Años", position: "insideBottom", offset: -2, fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(v) => typeof v === "number" ? `$${v.toLocaleString()}` : v}
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {compared.map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={profiles[key].name}
                        stroke={profiles[key].chartColor}
                        strokeWidth={2.5}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="gInvertido" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={SURA_GRAY} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={SURA_GRAY} stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gGanancia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={profiles[profile].chartColor} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={profiles[profile].chartColor} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="year"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      label={{ value: "Años", position: "insideBottom", offset: -2, fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(v) => typeof v === "number" ? `$${v.toLocaleString()}` : v}
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="invertido"
                      stackId="1"
                      stroke={SURA_GRAY}
                      fill="url(#gInvertido)"
                      name="Monto Invertido"
                    />
                    <Area
                      type="monotone"
                      dataKey="ganancia"
                      stackId="1"
                      stroke={profiles[profile].chartColor}
                      fill="url(#gGanancia)"
                      name="Ganancias"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumen comparación */}
          {compareMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen de Comparación</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {compared.map((key) => {
                  const p       = profiles[key]
                  const fv      = calcFV(monthly, p.return, horizon)
                  const inv     = monthly * horizon * 12
                  const earn    = fv - inv
                  return (
                    <div
                      key={key}
                      className="rounded-lg border-2 p-4"
                      style={{ borderColor: p.chartColor + "55" }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full" style={{ backgroundColor: p.chartColor }} />
                          <span className="font-medium text-foreground">{p.name}</span>
                        </div>
                        <Badge variant="outline" className={cn("text-xs", p.badgeClass)}>
                          Riesgo {p.risk}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Valor Final</p>
                          <p className="text-base font-semibold text-foreground">
                            ${Math.round(fv).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Ganancias</p>
                          <p className="text-base font-semibold text-sura-aqua">
                            ${Math.round(earn).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Retorno E.A.</p>
                          <p className="text-base font-semibold text-foreground">
                            {(p.return * 100).toFixed(1)}% E.A.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
