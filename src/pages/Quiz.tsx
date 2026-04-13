import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { Moon, Sun } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

const questions = [
  {
    id: 1,
    title: "¿Cuál es tu objetivo principal al invertir?",
    options: [
      { score: 1, label: "Proteger mi capital y mantener el poder adquisitivo" },
      { score: 2, label: "Obtener crecimiento moderado con baja volatilidad" },
      { score: 3, label: "Maximizar el rendimiento asumiendo más riesgo" },
    ],
  },
  {
    id: 2,
    title: "¿En cuánto tiempo planeas usar el dinero que vas a invertir?",
    options: [
      { score: 1, label: "Menos de 2 años" },
      { score: 2, label: "Entre 2 y 5 años" },
      { score: 3, label: "Más de 5 años" },
    ],
  },
  {
    id: 3,
    title: "Si tu inversión cayera un 20% en un mes, ¿qué harías?",
    options: [
      { score: 1, label: "Retiraría todo para evitar más pérdidas" },
      { score: 2, label: "Me preocuparía pero esperaría antes de decidir" },
      { score: 3, label: "Lo vería como oportunidad para comprar más" },
    ],
  },
  {
    id: 4,
    title: "¿Cuál es tu fuente principal de ingresos?",
    options: [
      { score: 1, label: "Pensión o ingreso fijo sin posibilidad de incremento" },
      { score: 2, label: "Empleo estable con salario predecible" },
      { score: 3, label: "Negocio propio o ingresos variables con alto potencial" },
    ],
  },
  {
    id: 5,
    title: "¿Qué porcentaje de tus ahorros totales representará esta inversión?",
    options: [
      { score: 1, label: "Más del 75% de mis ahorros" },
      { score: 2, label: "Entre el 25% y el 75%" },
      { score: 3, label: "Menos del 25% (tengo otros ahorros de respaldo)" },
    ],
  },
  {
    id: 6,
    title: "¿Tienes experiencia previa invirtiendo?",
    options: [
      { score: 1, label: "Ninguna o muy poca (CDTs, depósitos bancarios)" },
      { score: 2, label: "Algo de experiencia con fondos mutuos o acciones simples" },
      { score: 3, label: "Amplia experiencia con acciones, ETFs, derivados" },
    ],
  },
  {
    id: 7,
    title: "¿Cómo describirías tu situación financiera actual?",
    options: [
      { score: 1, label: "Deudas significativas y poca liquidez de reserva" },
      { score: 2, label: "Estable, con fondo de emergencia básico y pocas deudas" },
      { score: 3, label: "Sólida, con fondo robusto y patrimonio diversificado" },
    ],
  },
  {
    id: 8,
    title: "¿Qué rendimiento anual esperarías de tu inversión?",
    options: [
      { score: 1, label: "Similar a la inflación o poco por encima (3%-6%)" },
      { score: 2, label: "Moderado, entre el 6% y 12% anual" },
      { score: 3, label: "Alto, superior al 12% anual aunque con más riesgo" },
    ],
  },
  {
    id: 9,
    title: "Opción A: 5% garantizado. Opción B: puede rendir +20% o perder -10%. ¿Cuál eliges?",
    options: [
      { score: 1, label: "Opción A siempre, prefiero lo seguro" },
      { score: 2, label: "Dependería del momento, pero probablemente A" },
      { score: 3, label: "Opción B, el potencial de ganancia vale el riesgo" },
    ],
  },
  {
    id: 10,
    title: "¿Cómo reaccionas emocionalmente ante las fluctuaciones del mercado?",
    options: [
      { score: 1, label: "Me generan mucho estrés y ansiedad" },
      { score: 2, label: "Me incomodan pero puedo manejarlas racionalmente" },
      { score: 3, label: "Son parte normal de invertir y no me afectan" },
    ],
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const { submitQuiz, user } = useAuth()

  const { theme, toggleTheme } = useTheme()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const progress = useMemo(() => Object.keys(answers).length, [answers])

  const onSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }))
  }

  const handleSubmit = async () => {
    if (progress !== questions.length) {
      setError("Debes responder todas las preguntas para continuar")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const result = await submitQuiz(
        questions.map((question) => ({
          question_id: question.id,
          score: answers[question.id],
        }))
      )

      navigate("/quiz-result", { state: result })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo procesar el cuestionario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-sura-azul dark:bg-sura-gris-oscuro">

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

    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8 md:px-8">
      <Card className="border-primary/15">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Cuestionario de perfil inversionista</CardTitle>
              <CardDescription>
                {user?.name}, responde las 10 preguntas para definir tu perfil activo.
              </CardDescription>
            </div>
            <Badge variant="outline">{progress}/10</Badge>
          </div>
        </CardHeader>
      </Card>

      {questions.map((question) => (
        <Card key={question.id} className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{question.id}. {question.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {question.options.map((option, index) => {
              const id = `q-${question.id}-${option.score}`
              const selected = answers[question.id] === option.score
              const optionLabel = ["A", "B", "C"][index]
              return (
                <label
                  key={id}
                  htmlFor={id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    id={id}
                    type="radio"
                    className="mt-1"
                    checked={selected}
                    onChange={() => onSelect(question.id, option.score)}
                  />
                  <span>
                    <span className="font-semibold">{optionLabel}:</span> {option.label}
                  </span>
                </label>
              )
            })}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardFooter className="flex flex-col items-stretch gap-3">
          {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-sura-amarillo font-semibold text-sura-gris-oscuro hover:bg-sura-amarillo-medio"
          >
            {loading ? "Procesando perfil..." : "Ver resultado de perfil"}
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}
