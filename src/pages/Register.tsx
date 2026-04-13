import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { Sparkles, UserPlus, ShieldCheck, ClipboardCheck, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirm_password: "",
  })

  const { theme, toggleTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (form.password !== form.confirm_password) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    try {
      await register(form)
      navigate("/quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-sura-azul dark:bg-sura-gris-oscuro">
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
        <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-16">
          <div className="max-w-xl">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-sura-amarillo shadow-2xl shadow-sura-amarillo/30">
              <Sparkles className="h-10 w-10 text-sura-azul dark:text-sura-gris-oscuro" />
            </div>

            <h1 className="mb-4 text-5xl font-bold leading-tight text-white lg:text-6xl">
              Crea tu <span className="text-sura-amarillo">cuenta</span>
            </h1>
            <p className="mb-12 text-xl text-white/70">
              Activa tu portafolio inteligente en pocos pasos
            </p>

            <div className="space-y-4">
              {[
                { icon: UserPlus,      title: "Registro simple",      desc: "Completa tus datos personales de forma rápida"   },
                { icon: ClipboardCheck, title: "Perfil personalizado", desc: "Responde el cuestionario para recomendaciones"   },
                { icon: ShieldCheck,   title: "Sesión segura",         desc: "Accede con autenticación protegida por tokens"  },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex cursor-default items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-sura-amarillo/15">
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

        <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-2xl">
            <div className="rounded-3xl border p-8 shadow-2xl lg:p-10
                            border-white/20 bg-white
                            dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl">
              <div className="mb-8">
                <h2 className="mb-2 text-3xl font-bold text-sura-azul dark:text-white">Registro de usuario</h2>
                <p className="text-muted-foreground dark:text-white/60">
                  Completa tus datos para crear cuenta y continuar con el cuestionario.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-foreground dark:text-white">Nombre completo</label>
                  <Input
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Nombre completo"
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground dark:text-white">Correo electrónico</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground dark:text-white">Teléfono</label>
                  <Input
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+57 3000000000"
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-foreground dark:text-white">Ubicación</label>
                  <Input
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder="Ciudad, País"
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground dark:text-white">Contraseña</label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground dark:text-white">Confirmar contraseña</label>
                  <Input
                    type="password"
                    value={form.confirm_password}
                    onChange={(event) => updateField("confirm_password", event.target.value)}
                    required
                    className="h-12 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus-visible:ring-sura-amarillo"
                  />
                </div>

                {error && (
                  <p className="md:col-span-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700
                                dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
                    {error}
                  </p>
                )}

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full bg-sura-amarillo font-semibold text-sura-gris-oscuro shadow-lg shadow-sura-amarillo/30 hover:bg-sura-amarillo-medio"
                  >
                    {loading ? "Creando cuenta..." : "Continuar al cuestionario"}
                  </Button>
                </div>
              </form>
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
