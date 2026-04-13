import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { apiRequest } from "@/lib/api"

type User = {
  id: number
  email: string
  name: string
  phone?: string | null
  location?: string | null
  onboarding_completed: boolean
  created_at: string
}

type Profile = {
  id: number
  user_id: number
  name: string
  risk_level: string
  volatility_target: number
  expected_return?: string | null
  score?: number | null
  description?: string | null
  is_active: boolean
  created_at: string
}

type Tokens = {
  access_token: string
  refresh_token: string
  token_type: string
}

type AuthPayload = {
  user: User
  tokens: Tokens
}

type QuizAnswer = {
  question_id: number
  score: number
}

type QuizResult = {
  score: number
  profile_name: string
  risk_level: string
  expected_return: string
  description: string
}

type RegisterInput = {
  name: string
  email: string
  phone: string
  location: string
  password: string
  confirm_password: string
}

type LoginInput = {
  email: string
  password: string
}

type AuthContextType = {
  user: User | null
  activeProfile: Profile | null
  loading: boolean
  accessToken: string | null
  register: (payload: RegisterInput) => Promise<void>
  login: (payload: LoginInput) => Promise<void>
  logout: () => void
  submitQuiz: (answers: QuizAnswer[]) => Promise<QuizResult>
  refreshMe: () => Promise<void>
}

const AUTH_STORAGE_KEY = "maravilla.auth"

type StoredAuth = {
  accessToken: string
  refreshToken: string
  user: User
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

function writeStoredAuth(data: StoredAuth | null) {
  if (!data) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const setSession = (payload: AuthPayload) => {
    setUser(payload.user)
    setAccessToken(payload.tokens.access_token)
    setRefreshToken(payload.tokens.refresh_token)
    writeStoredAuth({
      accessToken: payload.tokens.access_token,
      refreshToken: payload.tokens.refresh_token,
      user: payload.user,
    })
  }

  const logout = () => {
    setUser(null)
    setActiveProfile(null)
    setAccessToken(null)
    setRefreshToken(null)
    writeStoredAuth(null)
  }

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null

    const tokens = await apiRequest<Tokens>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!user) return null

    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)
    writeStoredAuth({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user,
    })

    return tokens.access_token
  }

  const refreshMe = async () => {
    if (!accessToken) return

    let token = accessToken
    try {
      const me = await apiRequest<User>("/api/v1/auth/me", {}, token)
      setUser(me)

      try {
        const profile = await apiRequest<Profile>("/api/v1/auth/active-profile", {}, token)
        setActiveProfile(profile)
      } catch {
        setActiveProfile(null)
      }

      writeStoredAuth({
        accessToken: token,
        refreshToken: refreshToken ?? "",
        user: me,
      })
    } catch (error) {
      if (!refreshToken) {
        logout()
        return
      }
      token = await refreshAccessToken() ?? ""
      if (!token) {
        logout()
        return
      }
      const me = await apiRequest<User>("/api/v1/auth/me", {}, token)
      setUser(me)
      try {
        const profile = await apiRequest<Profile>("/api/v1/auth/active-profile", {}, token)
        setActiveProfile(profile)
      } catch {
        setActiveProfile(null)
      }
      writeStoredAuth({
        accessToken: token,
        refreshToken: refreshToken ?? "",
        user: me,
      })
      if (error instanceof Error && error.message.includes("401")) {
        return
      }
    }
  }

  useEffect(() => {
    const stored = readStoredAuth()
    if (!stored) {
      setLoading(false)
      return
    }

    setUser(stored.user)
    setAccessToken(stored.accessToken)
    setRefreshToken(stored.refreshToken)
  }, [])

  useEffect(() => {
    if (accessToken && loading) {
      void refreshMe().finally(() => setLoading(false))
    }
  }, [accessToken])

  const register = async (payload: RegisterInput) => {
    const auth = await apiRequest<AuthPayload>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    setSession(auth)
  }

  const login = async (payload: LoginInput) => {
    const auth = await apiRequest<AuthPayload>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    setSession(auth)
    try {
      const profile = await apiRequest<Profile>("/api/v1/auth/active-profile", {}, auth.tokens.access_token)
      setActiveProfile(profile)
    } catch {
      setActiveProfile(null)
    }
  }

  const submitQuiz = async (answers: QuizAnswer[]) => {
    if (!accessToken) {
      throw new Error("No active session")
    }

    const result = await apiRequest<QuizResult>(
      "/api/v1/auth/quiz-profile",
      {
        method: "POST",
        body: JSON.stringify({ answers }),
      },
      accessToken
    )

    await refreshMe()
    return result
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      activeProfile,
      loading,
      accessToken,
      register,
      login,
      logout,
      submitQuiz,
      refreshMe,
    }),
    [user, activeProfile, loading, accessToken]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
