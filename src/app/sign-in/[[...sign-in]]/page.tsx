//frontend/src/app/dashboard/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(159,122,234,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Logo above clerk box */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 32 }}>🌙</span>
          <h1 style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', marginTop: 8 }}>
            SleepQueue
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono', marginTop: 4 }}>
            Sign in to access your sleep data
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}