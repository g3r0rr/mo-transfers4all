import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)

      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('role').eq('id', data.user.id).single()
      if (profileError) throw new Error(profileError.message)

      if (profile.role === 'admin') navigate('/admin')
      else if (profile.role === 'hotel') navigate('/hotel')
      else {
        await supabase.auth.signOut()
        throw new Error('Your account does not have access to this portal. Please contact support.')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');

        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef5fb 0%, #f8fafc 50%, #d6e8f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'Inter', sans-serif;
        }

        .login-wrap {
          width: 100%;
          max-width: 440px;
        }

        .login-brand {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-brand img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--blue-bright, #2980b9);
          box-shadow: 0 4px 20px rgba(41,128,185,0.25);
          margin-bottom: 1rem;
        }

        .login-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--blue-deep, #0f3460);
          letter-spacing: 0.02em;
        }

        .login-brand-sub {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--blue-bright, #2980b9);
          font-weight: 600;
          margin-top: 0.3rem;
        }

        .login-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(15,52,96,0.04), 0 12px 40px rgba(15,52,96,0.10);
          border: 1px solid var(--border, #cfe0f0);
          overflow: hidden;
        }

        .login-card-top {
          height: 4px;
          background: linear-gradient(90deg, var(--blue-deep, #0f3460), var(--blue-bright, #2980b9));
        }

        .login-card-body {
          padding: 2.5rem 2rem 2rem;
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--blue-deep, #0f3460);
          margin-bottom: 0.35rem;
        }

        .login-subtitle {
          font-size: 0.82rem;
          color: var(--text-light, #7a99b5);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .login-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--blue-mid, #1a5276);
          font-weight: 600;
          margin-bottom: 0.45rem;
        }

        .login-field {
          margin-bottom: 1.25rem;
        }

        .login-input {
          width: 100%;
          background: var(--blue-mist, #eef5fb);
          border: 1.5px solid var(--border, #cfe0f0);
          border-radius: 7px;
          color: var(--text-dark, #0d2236);
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          line-height: 1.4;
          padding: 0.8rem 1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
          vertical-align: middle;
        }

        .login-input[type="password"] {
          font-family: Verdana, sans-serif;
          letter-spacing: 0.15em;
        }

        .login-input:focus {
          border-color: var(--blue-bright, #2980b9);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(41,128,185,0.12);
        }

        .login-input::placeholder {
          color: var(--text-light, #7a99b5);
        }

        .login-error {
          margin-bottom: 1.25rem;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 7px;
          color: #dc2626;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .login-btn {
          width: 100%;
          background: var(--blue-deep, #0f3460);
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 0.9rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(15,52,96,0.2);
          margin-top: 0.5rem;
        }

        .login-btn:hover:not(:disabled) {
          background: var(--blue-mid, #1a5276);
          box-shadow: 0 4px 18px rgba(15,52,96,0.28);
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-back {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: var(--text-light, #7a99b5);
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-back:hover {
          color: var(--blue-bright, #2980b9);
        }
      `}</style>

      <div className="login-page">
        <div className="login-wrap">

          <div className="login-brand">
            <img src="/logo.jpg" alt="MO Transfers4all" />
            <div className="login-brand-name">MO Transfers4all</div>
            <div className="login-brand-sub">Partner Portal</div>
          </div>

          <div className="login-card">
            <div className="login-card-top" />
            <div className="login-card-body">
              <h1 className="login-title">Sign In</h1>
              <p className="login-subtitle">Enter your credentials to access the booking portal.</p>

              <form onSubmit={handleLogin}>
                <div className="login-field">
                  <label className="login-label">Email</label>
                  <input
                    className="login-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">Password</label>
                  <input
                    className="login-input"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="login-error">{error}</div>
                )}

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>

          <a href="/" className="login-back">← Back to website</a>
        </div>
      </div>
    </>
  )
}
