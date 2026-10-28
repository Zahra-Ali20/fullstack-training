
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  login,
  clearAuthError
} from '../features/auth/authSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password) {
      setValidationError('Email and password are required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setValidationError('Please enter a valid email address.')
      return
    }

    setValidationError('')
    dispatch(clearAuthError())

    try {
      await dispatch(
        login({
          email: normalizedEmail,
          password
        })
      ).unwrap()

      navigate('/')
    } catch {
      // The Redux auth slice stores and displays the login error.
    }
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setValidationError('')
              dispatch(clearAuthError())
            }}
            required
          />
        </div>

        <div>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setValidationError('')
              dispatch(clearAuthError())
            }}
            required
          />
        </div>

        {validationError && (
          <p role="alert">{validationError}</p>
        )}

        {error && (
          <p role="alert">{error}</p>
        )}

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}

export default LoginPage
