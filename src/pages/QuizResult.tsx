import { useMemo } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"

type QuizResultState = {
  score: number
  profile_name: string
  risk_level: string
  expected_return: string
  description: string
}

export default function QuizResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state as QuizResultState | undefined

  const { theme, toggleTheme } = useTheme()

  const riskLabel = useMemo(() => {
    if (!result) return ""
    if (result.risk_level === "low") return "Bajo"
    if (result.risk_level === "medium") return "Medio"
    return "Alto"
  }, [result])

  if (!result) {
    return <Navigate to="/quiz" replace />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-sura-azul px-4 py-8 dark:bg-sura-gris-oscuro">

      {/* Toggle tema */}
      <div className="absolute right-4 top-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="gap-2 text-white/60 hover:bg-white/10 hover:text-white"
        >
          {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          <span className="hidden text-xs sm:inline">
            {theme === "light" ? "INVERSIONES" : "AHORRO"}
          </span>
        </Button>
      </div>

      <Card className="w-full max-w-xl border-primary/20">
        <CardHeader>
          <CardTitle className="mt-2 text-2xl">Tu perfil recomendado: {result.profile_name}</CardTitle>
          <CardDescription>{result.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-semibold text-foreground">Nivel de riesgo:</span> {riskLabel}</p>
          <p><span className="font-semibold text-foreground">Rendimiento esperado:</span> {result.expected_return}</p>
          <p className="rounded-lg bg-muted/40 px-3 py-2">
            Tu perfil quedó guardado como perfil activo. Desde este punto puedes ingresar al inicio y ver recomendaciones acordes.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-sura-amarillo font-semibold text-sura-gris-oscuro hover:bg-sura-amarillo-medio"
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
