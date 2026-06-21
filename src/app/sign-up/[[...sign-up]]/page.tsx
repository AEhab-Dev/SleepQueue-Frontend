import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
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
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(104,211,145,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 32 }}>🌙</span>
          <h1 style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', marginTop: 8 }}>
            SleepQueue
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono', marginTop: 4 }}>
            Create your account to start optimizing sleep
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}