import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/Label";
import { TrendingUp, Shield, PieChart, Sparkles } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  navigate("/dashboard");
};

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="relative flex min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #53565a 0%, #3a3d40 50%, #2a2d30 100%)" }}
    >
      {/* Orb 1 - Amarillo */}
      <motion.div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #e3e82966, #e3e82922)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Orb 2 - Gris claro */}
      <motion.div
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #ffffff22, #e3e82933)" }}
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Partículas */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: "#e3e82944",
          }}
          animate={{ y: [0, -100, 0], x: [0, Math.random() * 50 - 25, 0], opacity: [0, 1, 0] }}
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
        />
      ))}

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        {/* Left - Hero */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center justify-center p-8 lg:p-16"
        >
          <div className="max-w-xl">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl"
              style={{ background: "linear-gradient(135deg, #e3e829, #c9ce00)", boxShadow: "0 25px 50px #e3e82944" }}
            >
              <Sparkles className="h-10 w-10" style={{ color: "#53565a" }} />
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-4 text-5xl font-bold leading-tight lg:text-6xl"
              style={{ color: "#ffffff" }}
            >
              Mi Portafolio{" "}
              <span style={{ color: "#e3e829" }}>Inteligente</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12 text-xl"
              style={{ color: "#ffffff99" }}
            >
              Construye tu futuro financiero con inteligencia
            </motion.p>

            {/* Feature cards */}
            <div className="space-y-4">
              {[
                { icon: TrendingUp, title: "Crecimiento Proyectado", desc: "Visualiza el potencial de tus inversiones", delay: 0.8 },
                { icon: Shield, title: "Perfiles de Riesgo", desc: "Ajusta tu estrategia según tu perfil", delay: 1 },
                { icon: PieChart, title: "Simulaciones Precisas", desc: "Compara escenarios en tiempo real", delay: 1.2 },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  className="flex items-start gap-4 rounded-xl p-4 backdrop-blur-sm transition-all cursor-default"
                  style={{ background: "#ffffff0d", border: "1px solid #ffffff15" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#ffffff1a")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#ffffff0d")}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "#e3e82922" }}>
                    <feature.icon className="h-6 w-6" style={{ color: "#e3e829" }} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold" style={{ color: "#ffffff" }}>{feature.title}</h3>
                    <p className="text-sm" style={{ color: "#ffffff70" }}>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right - Login form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-1 items-center justify-center p-8 lg:p-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-xl lg:p-10"
              style={{ background: "#ffffff0f", border: "1px solid #ffffff1a" }}>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>Bienvenido</h2>
                <p style={{ color: "#ffffff70" }}>Ingresa a tu cuenta para continuar</p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#ffffff" }}>Correo electrónico</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // required  ← elimina esta línea
                    className="h-12 text-white placeholder:text-white/40 transition-all"
                    style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}  
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: "#ffffff" }}>Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-white placeholder:text-white/40 transition-all"
                    style={{ background: "#ffffff0d", border: "1px solid #ffffff33" }}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm transition-colors"
                    style={{ color: "#e3e829" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="h-12 w-full font-semibold transition-all"
                    style={{
                      background: "linear-gradient(135deg, #e3e829, #c9ce00)",
                      color: "#53565a",
                      boxShadow: "0 10px 30px #e3e82944",
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-8 text-center"
              >
                <p className="text-sm" style={{ color: "#ffffff70" }}>
                  ¿No tienes una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/registro")}
                    className="font-semibold transition-colors"
                    style={{ color: "#e3e829" }}
                  >
                    Regístrate aquí
                  </button>
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-8 text-center text-sm"
              style={{ color: "#ffffff50" }}
            >
              © 2026 Mi Portafolio Inteligente. Tu futuro comienza hoy.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}