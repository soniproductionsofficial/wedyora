import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { isAdminLoggedIn, loginAdmin } from '../../lib/adminAuth'

const ADMIN_BG = '/admin/login-bg.jpg?v=2'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

export function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!loginAdmin(username, password)) {
      setError('Invalid username or password.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#fff8f9]">
      <img
        src={ADMIN_BG}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-10 sm:px-10 lg:justify-end lg:px-14 xl:pr-20">
        <div className="w-full max-w-md rounded-2xl border border-[#8e1454]/12 bg-white p-8 shadow-[0_20px_50px_rgba(142,20,84,0.12)] sm:p-9">
          <div className="flex justify-center">
            <Logo className="h-10 w-44" />
          </div>

          <p className="mt-6 text-center text-[11px] font-semibold tracking-[0.22em] text-[#8e1454] uppercase">
            Admin portal
          </p>
          <h1 className="mt-2 text-center font-display text-3xl text-[#3a2f32]">Sign in</h1>
          <p className="mt-2 text-center text-sm text-muted">
            Username and password for operations desk.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="text-sm text-[#3a2f32]">
              Username
              <input
                required
                autoComplete="username"
                className={field}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="text-sm text-[#3a2f32]">
              Password
              <input
                required
                type="password"
                autoComplete="current-password"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error ? <p className="text-sm text-[#8e1454]">{error}</p> : null}
            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#8e1454] px-6 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase transition hover:bg-[#7a1048]"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
