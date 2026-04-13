import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { Sparkles, UserPlus, ShieldCheck, ClipboardCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"

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
              Crea tu <span style={{ color: "#e3e829" }}>cuenta</span>
            </h1>
            <p className="mb-12 text-xl" style={{ color: "#ffffff99" }}>
              Activa tu portafolio inteligente en pocos pasos
            </p>

            <div className="space-y-4">
              {[
                { icon: UserPlus, title: "Registro simple", desc: "Completa tus datos personales de forma rápida" },
                { icon: ClipboardCheck, title: "Perfil personalizado", desc: "Responde el cuestionario para recomendaciones" },
                { icon: ShieldCheck, title: "Sesión segura", desc: "Accede con autenticación protegida por tokens" },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex cursor-default items-start gap-4 rounded-xl p-4 backdrop-blur-sm"
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
          <div className="w-full max-w-2xl rounded-3xl p-8 shadow-2xl backdrop-blur-xl lg:p-10" style={{ background: "#ffffff0f", border: "1px solid #ffffff1a" }}>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>Registro de usuario</h2>
              <p style={{ color: "#ffffff70" }}>
                Completa tus datos para crear cuenta y continuar con el cuestionario.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm" style={{ color: "#ffffff" }}>Nombre completo</label>
                <Input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Nombre completo"
                  required
                  className="h-12 text-white placeholder:text-white/40"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm" style={{ color: "#ffffff" }}>Correo electrónico</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-12 text-white placeholder:text-white/40"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm" style={{ color: "#ffffff" }}>Teléfono</label>
                <Input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+57 3000000000"
                  required
                  className="h-12 text-white placeholder:text-white/40"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm" style={{ color: "#ffffff" }}>Ubicación</label>
                <Input
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Ciudad, País"
                  required
                  className="h-12 text-white placeholder:text-white/40"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm" style={{ color: "#ffffff" }}>Contraseña</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  required
                  className="h-12 text-white placeholder:text-white/40"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm" style={{ color: "#ffffff" }}>Confirmar contraseña</label>
                <Input
                  type="password"
                  value={form.confirm_password}
                  onChange={(event) => updateField("confirm_password", event.target.value)}
                  required
                  className="h-12 text-white placeholder:text-white/40"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                />
              </div>

              {error && (
                <p className="md:col-span-2 rounded-md px-3 py-2 text-sm" style={{ background: "#7f1d1d66", color: "#fecaca", border: "1px solid #7f1d1d" }}>
                  {error}
                </p>
              )}

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="h-12 w-full font-semibold transition-all"
                  disabled={loading}
                  style={{ background: "linear-gradient(135deg, #e3e829, #c9ce00)", color: "#53565a", boxShadow: "0 10px 30px #e3e82944" }}
                >
                  {loading ? "Creando cuenta..." : "Continuar al cuestionario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
