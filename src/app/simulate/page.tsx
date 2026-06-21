//frontend/src/app/simulate/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import InputForm from '@/components/InputForm'
import { runSimulation, SmartWatchInput, SimulationResult } from '@/lib/api'
import { saveHistory } from '@/lib/history'

const LOADING_STEPS = [
  { label: 'Parsing biometric input', icon: '📡' },
  { label: 'Modeling sleep architecture', icon: '🧠' },
  { label: 'Assigning task queue', icon: '📋' },
  { label: 'Computing alarm windows', icon: '⏰' },
  { label: 'Finalizing recovery plan', icon: '✅' },
]

function LoadingSequence() {
  const [step, setStep] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
    }, 900)
    return () => clearInterval(interval)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ display: 'block', fontSize: 40 }}>⚙️</motion.span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
            {LOADING_STEPS[step].icon}&nbsp; {LOADING_STEPS[step].label}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {LOADING_STEPS.map((_, i) => (
          <motion.div key={i} animate={{ background: i <= step ? 'var(--accent)' : 'rgba(99,179,237,0.12)', scale: i === step ? 1.3 : 1 }} transition={{ duration: 0.3 }}
            style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 9999, transition: 'width 0.3s ease' }} />
        ))}
      </div>
    </motion.div>
  )
}

export default function SimulatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: SmartWatchInput) {
    setLoading(true)
    setError(null)
    try {
      const res: SimulationResult = await runSimulation(data)
      saveHistory({
        required_sleep_hours: res.required_sleep_hours,
        freshness_score: res.metrics.freshness_score,
        throughput_percent: res.metrics.throughput_percent,
        deep_sleep_minutes: res.metrics.deep_sleep_minutes,
        rem_sleep_minutes: res.metrics.rem_sleep_minutes,
        total_sleep_hours: res.metrics.total_sleep_hours,
        tasks_completed: res.metrics.tasks_completed,
        tasks_total: res.metrics.tasks_total,
      })
      sessionStorage.setItem('sleepqueue_result', JSON.stringify(res))
      router.push('/results')
    } catch {
      setError('Unable to reach the simulation backend. Ensure FastAPI is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <NavBar />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '52px 28px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>
            Sleep{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Simulation
            </span>{' '}⚙️
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            Enter your smartwatch metrics. The engine models your circadian rhythm and fatigue load.
          </p>
        </motion.div>

        <InputForm onSubmit={handleSubmit} loading={loading} />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: 'rgba(252,129,129,0.06)', border: '1px solid rgba(252,129,129,0.25)', display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div style={{ fontSize: 12, color: 'rgba(252,129,129,0.7)', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{loading && <LoadingSequence />}</AnimatePresence>
      </main>
    </div>
  )
}