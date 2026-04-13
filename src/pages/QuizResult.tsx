import { useMemo } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-8">
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
          <Button className="w-full" onClick={() => navigate("/")}>Ir al inicio</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
