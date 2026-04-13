import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { TrendingUp, Shield, PieChart, Sparkles, Moon, Sun } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const features = [
    { icon: TrendingUp, title: "Crecimiento Proyectado", desc: "Visualiza el potencial de tus inversiones" },
    { icon: Shield,     title: "Perfiles de Riesgo",     desc: "Ajusta tu estrategia según tu perfil"       },
    { icon: PieChart,   title: "Simulaciones Precisas",  desc: "Compara escenarios en tiempo real"          },
  ]

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    // Claro: bg-sura-azul (corporativo) | Oscuro: bg-sura-gris-oscuro
    <div className="relative flex min-h-screen overflow-hidden bg-sura-azul dark:bg-sura-gris-oscuro">

      {/* Blobs decorativos */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl bg-sura-amarillo/20" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl bg-sura-amarillo/10" />

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

      <div className="relative z-10 flex w-full flex-col lg:flex-row">

        {/* ── Panel izquierdo ─────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-16">
          <div className="max-w-xl">

            {/* Logo */}
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-sura-amarillo shadow-2xl shadow-sura-amarillo/30">
              <Sparkles className="h-10 w-10 text-sura-azul dark:text-sura-gris-oscuro" />
            </div>

            <h1 className="mb-4 text-5xl font-bold leading-tight text-white lg:text-6xl">
              Mi Portafolio{" "}
              <span className="text-sura-amarillo">Inteligente</span>
            </h1>
            <p className="mb-12 text-xl text-white/70">
              Construye tu futuro financiero con inteligencia
            </p>

            {/* Feature cards */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex cursor-default items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sura-amarillo/15">
                    <feature.icon className="h-6 w-6 text-sura-amarillo" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Panel derecho — formulario ───────────────────────── */}
        <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">

            {/* Claro: card blanca | Oscuro: glassmorphism */}
            <div className="rounded-3xl border p-8 shadow-2xl lg:p-10
                            border-white/20 bg-white
                            dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl">

              <div className="mb-8">
                {/* Claro: texto azul corporativo | Oscuro: blanco */}
                <h2 className="mb-2 text-3xl font-bold text-sura-azul dark:text-white">
                  Bienvenido
                </h2>
                <p className="text-muted-foreground dark:text-white/60">
                  Ingresa a tu cuenta para continuar
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-foreground dark:text-white">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm text-foreground dark:text-white">
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                {error && (
                  <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700
                                dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full bg-sura-amarillo font-semibold text-sura-gris-oscuro shadow-lg shadow-sura-amarillo/30 hover:bg-sura-amarillo-medio"
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground dark:text-white/60">
                  ¿No tienes una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-sura-azul transition-colors hover:text-sura-azul/70 dark:text-sura-amarillo dark:hover:text-sura-amarillo-medio"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-white/40">
              © 2026 Mi Portafolio Inteligente. Tu futuro comienza hoy.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
