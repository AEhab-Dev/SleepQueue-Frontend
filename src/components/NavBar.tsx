//frontend/src/components/NavBar.tsx
'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NavBar() {
  const router = useRouter()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(99,179,237,0.08)',
        background: 'rgba(6,8,15,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/dashboard')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>🌙</div>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 16, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SleepQueue</span>
        </motion.div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate', path: '/simulate' },
          ].map(link => (
            <motion.button
              key={link.path}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(link.path)}
              style={{
                padding: '6px 14px', borderRadius: 8,
                background: 'transparent', border: 'none',
                color: 'var(--text-muted)', fontSize: 13,
                cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                fontWeight: 600, letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}