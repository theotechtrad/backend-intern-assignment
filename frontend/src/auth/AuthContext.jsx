import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const API_BASE = 'http://127.0.0.1:8000/api/v1'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  const isAuthenticated = Boolean(token)

  async function fetchMe(currentToken) {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })
      if (!res.ok) return
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('Failed to fetch current user', err)
    }
  }

  useEffect(() => {
    if (token) {
      fetchMe(token)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new Error(errorBody.detail || 'Login failed')
    }
    const data = await res.json()
    const accessToken = data.access_token
    setToken(accessToken)
    localStorage.setItem('token', accessToken)
    await fetchMe(accessToken)
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
  }

  const register = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'user' }),
    })
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new Error(errorBody.detail || 'Registration failed')
    }
    return res.json()
  }

  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { API_BASE }
