import { useState } from 'react'
import Modal from '../ui/Modal'
import { register } from '../../api/auth'

type SignUpModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (token: string) => void
  onSwitchToSignIn: () => void
}

export default function SignUpModal({ isOpen, onClose, onSuccess, onSwitchToSignIn }: SignUpModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState(false)
  const [pwdError, setPwdError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  function triggerShake() {
    setShake(false)
    requestAnimationFrame(() => setShake(true))
    setTimeout(() => setShake(false), 500)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEmailError(false)
    setPwdError(false)

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    const pwdValid = password.length >= 8

    if (!emailValid || !pwdValid) {
      setEmailError(!emailValid)
      setPwdError(!pwdValid)
      setError(!pwdValid && emailValid ? 'Password must be at least 8 characters.' : 'Please fill all fields correctly.')
      triggerShake()
      return
    }

    setLoading(true)
    try {
      const { token } = await register({ email: email.trim(), password })
      onSuccess(token)
      onClose()
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-3 border rounded-[10px] text-[15px] text-ink bg-white transition-[border-color,box-shadow] outline-none focus:border-accent focus:shadow-accent ${hasError ? 'border-[#DC2626] shadow-[0_0_0_4px_rgba(220,38,38,0.12)]' : 'border-border'}`

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={shake ? 'animate-shake' : ''}>
        <h2 className="font-serif text-[36px] leading-[1.05] tracking-[-0.02em] m-0 mb-2">
          Create an <span className="italic text-accent">account.</span>
        </h2>
        <p className="text-muted text-sm m-0 mb-6">
          Save trips, get price alerts, sync across devices.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          {error && (
            <div className="flex items-center gap-2 p-[10px_14px] bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-[10px] text-[13px]">
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="signup-email" className="text-[12px] text-ink-2 font-medium mb-1.5">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass(emailError)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="signup-pwd" className="text-[12px] text-ink-2 font-medium mb-1.5">
              Password
            </label>
            <input
              id="signup-pwd"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={inputClass(pwdError)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center inline-flex items-center gap-2 px-3 py-3 rounded-[10px] text-[15px] font-medium border-transparent bg-accent text-white hover:bg-accent-hover transition-all mt-1 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-muted">
          Already have an account?{' '}
          <a
            href="#"
            className="text-accent font-medium no-underline"
            onClick={e => {
              e.preventDefault()
              onSwitchToSignIn()
            }}
          >
            Sign in
          </a>
        </p>
      </div>
    </Modal>
  )
}
