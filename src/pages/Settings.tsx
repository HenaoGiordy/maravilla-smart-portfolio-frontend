import { useState } from "react"
import { User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { apiRequest } from "@/lib/api"

export default function Settings() {
  const { user, activeProfile, accessToken, refreshMe } = useAuth()

  const [form, setForm] = useState({
    name:     user?.name     ?? "",
    email:    user?.email    ?? "",
    phone:    user?.phone    ?? "",
    location: user?.location ?? "",
  })

  const [pwd, setPwd] = useState({
    current:  "",
    next:     "",
    confirm:  "",
  })

  const [showPwd, setShowPwd]       = useState(false)
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingPwd, setSavingPwd]   = useState(false)
  const [infoMsg, setInfoMsg]       = useState<{ ok: boolean; text: string } | null>(null)
  const [pwdMsg, setPwdMsg]         = useState<{ ok: boolean; text: string } | null>(null)

  const initials = (user?.name ?? "??")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat("es", { month: "short", year: "numeric" }).format(new Date(user.created_at))
    : "—"

  const handleSaveInfo = async () => {
    setSavingInfo(true)
    setInfoMsg(null)
    try {
      await apiRequest("/api/v1/auth/me", {
        method: "PATCH",
        body: JSON.stringify(form),
      }, accessToken)
      await refreshMe()
      setInfoMsg({ ok: true, text: "Información actualizada correctamente" })
    } catch (err) {
      setInfoMsg({ ok: false, text: err instanceof Error ? err.message : "No se pudo guardar" })
    } finally {
      setSavingInfo(false)
    }
  }

  const handleSavePwd = async () => {
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ ok: false, text: "Las contraseñas nuevas no coinciden" })
      return
    }
    setSavingPwd(true)
    setPwdMsg(null)
    try {
      await apiRequest("/api/v1/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ current_password: pwd.current, new_password: pwd.next }),
      }, accessToken)
      setPwd({ current: "", next: "", confirm: "" })
      setPwdMsg({ ok: true, text: "Contraseña actualizada correctamente" })
    } catch (err) {
      setPwdMsg({ ok: false, text: err instanceof Error ? err.message : "No se pudo cambiar la contraseña" })
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Card lateral ─────────────────────────────────────── */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-8 pb-6">

            {/* Avatar */}
            <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-sura-azul dark:bg-sura-amarillo">
              <span className="text-3xl font-bold text-white dark:text-sura-gris-oscuro">
                {initials}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-foreground">{user?.name ?? "—"}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{user?.email ?? "—"}</p>

            {/* Badge perfil activo */}
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary">
              <Shield className="size-4" />
              <span className="text-sm font-medium">
                {activeProfile ? `Perfil ${activeProfile.name}` : "Sin perfil activo"}
              </span>
            </div>

            <Separator className="my-6 w-full" />

            {/* Stats */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Perfil de riesgo</span>
                <span className="font-semibold text-foreground capitalize">
                  {activeProfile?.risk_level === "low"    ? "Bajo"
                   : activeProfile?.risk_level === "medium" ? "Medio"
                   : activeProfile?.risk_level === "high"   ? "Alto"
                   : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Retorno esperado</span>
                <span className="font-semibold text-foreground">
                  {activeProfile?.expected_return ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Miembro desde</span>
                <span className="font-semibold text-foreground">{memberSince}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Última actividad</span>
                <span className="font-semibold text-foreground">Hoy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Formularios ──────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Información personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4 text-primary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

              <div className="space-y-1.5">
                <Label>Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              {infoMsg && (
                <p className={`rounded-md px-3 py-2 text-sm ${
                  infoMsg.ok
                    ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {infoMsg.text}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveInfo}
                  disabled={savingInfo}
                  className="gap-2 bg-sura-amarillo font-semibold text-sura-gris-oscuro hover:bg-sura-amarillo-medio"
                >
                  <Save className="size-4" />
                  {savingInfo ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="size-4 text-primary" />
                Cambiar Contraseña
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

              <div className="space-y-1.5">
                <Label>Contraseña actual</Label>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={pwd.current}
                    onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Nueva contraseña</Label>
                <Input
                  type={showPwd ? "text" : "password"}
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Confirmar nueva contraseña</Label>
                <Input
                  type={showPwd ? "text" : "password"}
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              {pwdMsg && (
                <p className={`rounded-md px-3 py-2 text-sm ${
                  pwdMsg.ok
                    ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {pwdMsg.text}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePwd}
                  disabled={savingPwd || !pwd.current || !pwd.next || !pwd.confirm}
                  className="gap-2 bg-sura-amarillo font-semibold text-sura-gris-oscuro hover:bg-sura-amarillo-medio"
                >
                  <Lock className="size-4" />
                  {savingPwd ? "Actualizando..." : "Cambiar contraseña"}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
