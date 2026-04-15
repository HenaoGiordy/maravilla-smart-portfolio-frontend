import { useEffect, useMemo, useState } from "react"
import { Bell, Info, Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/context/AuthContext"
import { apiRequest } from "@/lib/api"

type NotificationFrequency = "daily" | "weekly" | "monthly"

type NotificationSettings = {
  enabled: boolean
  frequency: NotificationFrequency
  delivery_hour: number
}

const VARIABLE_INCOME_ASSETS = [
  { name: "Apple Inc.", allocation: 25, annualReturn: 30.62 },
  { name: "Microsoft Corp.", allocation: 15, annualReturn: 1.2 },
  { name: "Alphabet Inc.", allocation: 10, annualReturn: 111.86 },
]

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function formatHour(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12.toString().padStart(2, "0")}:00 ${suffix}`
}

export default function Notifications() {
  const { accessToken } = useAuth()

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    frequency: "daily",
    delivery_hour: 8,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingNow, setSendingNow] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const frequencyLabel = useMemo(
    () => ({ daily: "Diaria", weekly: "Semanal", monthly: "Mensual" }[settings.frequency]),
    [settings.frequency]
  )

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setMsg(null)
      try {
        const data = await apiRequest<NotificationSettings>("/api/v1/auth/notifications/settings", {}, accessToken)
        setSettings(data)
      } catch (err) {
        setMsg({ ok: false, text: err instanceof Error ? err.message : "No se pudo cargar configuración" })
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [accessToken])

  const handleSave = async () => {
    setSaving(true)
    setMsg(null)
    try {
      const data = await apiRequest<NotificationSettings>(
        "/api/v1/auth/notifications/settings",
        {
          method: "PUT",
          body: JSON.stringify(settings),
        },
        accessToken
      )
      setSettings(data)
      setMsg({ ok: true, text: "Configuración guardada correctamente" })
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "No se pudo guardar la configuración" })
    } finally {
      setSaving(false)
    }
  }

  const handleSendNow = async () => {
    setSendingNow(true)
    setMsg(null)
    try {
      await apiRequest<{ message: string }>(
        "/api/v1/auth/notifications/send-now",
        { method: "POST" },
        accessToken
      )
      setMsg({ ok: true, text: "Notificación enviada. Revisa tu correo y la carpeta de spam." })
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "No se pudo enviar la notificación" })
    } finally {
      setSendingNow(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 px-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configuración de Notificaciones</h1>
          <p className="text-sm text-muted-foreground">
            Personaliza cómo y cuándo quieres recibir alertas por correo para renta variable.
          </p>
        </div>

        <Card className="border-sura-amarillo/30 bg-gradient-to-r from-sura-gris-oscuro/95 to-zinc-800 text-white dark:border-sura-amarillo/45">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4 text-sura-amarillo" />
              Estos son los cambios de Renta Variable
            </CardTitle>
            <p className="text-xs text-zinc-300">Acciones y ETFs</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {VARIABLE_INCOME_ASSETS.map((asset) => (
              <div key={asset.name} className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-3">
                <p className="text-sm font-semibold text-white">{asset.name}</p>
                <p className="mt-1 text-xs text-zinc-300">{asset.allocation}%</p>
                <p className="mt-1 text-sm font-bold text-sura-amarillo">+{asset.annualReturn}% E.A.</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4 text-primary" />
              Preferencias de envío
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">

            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Recibir notificaciones</p>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Activa para recibir correos con los cambios de Apple, Microsoft y Alphabet.
                  </TooltipContent>
                </Tooltip>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.enabled}
                onClick={() => setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? "bg-sura-amarillo" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block size-5 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label>Frecuencia</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Define cada cuánto se enviará el resumen de cambios de renta variable.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <select
                  value={settings.frequency}
                  disabled={loading}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, frequency: event.target.value as NotificationFrequency }))
                  }
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-0"
                >
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label>Hora de envío</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Hora local estimada para recibir el correo (formato 12 horas).
                    </TooltipContent>
                  </Tooltip>
                </div>
                <select
                  value={settings.delivery_hour}
                  disabled={loading}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, delivery_hour: Number(event.target.value) }))
                  }
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-0"
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {formatHour(hour)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Estado actual: {settings.enabled ? "Activo" : "Inactivo"} · {frequencyLabel} · {formatHour(settings.delivery_hour)}
            </div>

            {msg && (
              <p
                className={`rounded-md px-3 py-2 text-sm ${
                  msg.ok
                    ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleSendNow}
                disabled={sendingNow || loading}
              >
                <Send className="size-4" />
                {sendingNow ? "Enviando..." : "Recibir notificación ahora"}
              </Button>

              <Button
                className="bg-sura-amarillo font-semibold text-sura-gris-oscuro hover:bg-sura-amarillo-medio"
                onClick={handleSave}
                disabled={saving || loading}
              >
                {saving ? "Guardando..." : "Guardar configuración"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
