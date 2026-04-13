import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { TrendingUp, Shield, PieChart, Sparkles } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const features = [
    {
      icon: TrendingUp,
      title: "Crecimiento Proyectado",
      desc: "Visualiza el potencial de tus inversiones",
    },
    {
      icon: Shield,
      title: "Perfiles de Riesgo",
      desc: "Ajusta tu estrategia según tu perfil",
    },
    {
      icon: PieChart,
      title: "Simulaciones Precisas",
      desc: "Compara escenarios en tiempo real",
    },
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
    <div
      className="relative flex min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #53565a 0%, #3a3d40 50%, #2a2d30 100%)" }}
    >
      <div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #e3e82966, #e3e82922)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #ffffff22, #e3e82933)" }}
      />

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-16">
          <div className="max-w-xl">
            <div
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl"
              style={{ background: "linear-gradient(135deg, #e3e829, #c9ce00)", boxShadow: "0 25px 50px #e3e82944" }}
            >
              <Sparkles className="h-10 w-10" style={{ color: "#53565a" }} />
            </div>

            <h1 className="mb-4 text-5xl font-bold leading-tight lg:text-6xl" style={{ color: "#ffffff" }}>
              Mi Portafolio <span style={{ color: "#e3e829" }}>Inteligente</span>
            </h1>
            <p className="mb-12 text-xl" style={{ color: "#ffffff99" }}>
              Construye tu futuro financiero con inteligencia
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex cursor-default items-start gap-4 rounded-xl p-4 backdrop-blur-sm transition-all"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff15" }}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "#e3e82922" }}>
                    <feature.icon className="h-6 w-6" style={{ color: "#e3e829" }} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold" style={{ color: "#ffffff" }}>{feature.title}</h3>
                    <p className="text-sm" style={{ color: "#ffffff70" }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-xl lg:p-10" style={{ background: "#ffffff0f", border: "1px solid #ffffff1a" }}>
              <div className="mb-8">
                <h2 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>Bienvenido</h2>
                <p style={{ color: "#ffffff70" }}>Ingresa a tu cuenta para continuar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm" style={{ color: "#ffffff" }}>Correo electrónico</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-white placeholder:text-white/40"
                    style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm" style={{ color: "#ffffff" }}>Contraseña</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-white placeholder:text-white/40"
                    style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                  />
                </div>

                {error && (
                  <p className="rounded-md px-3 py-2 text-sm" style={{ background: "#7f1d1d66", color: "#fecaca", border: "1px solid #7f1d1d" }}>
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full font-semibold transition-all"
                  style={{ background: "linear-gradient(135deg, #e3e829, #c9ce00)", color: "#53565a", boxShadow: "0 10px 30px #e3e82944" }}
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm" style={{ color: "#ffffff70" }}>
                  ¿No tienes una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold transition-colors"
                    style={{ color: "#e3e829" }}
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm" style={{ color: "#ffffff50" }}>
              © 2026 Mi Portafolio Inteligente. Tu futuro comienza hoy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
