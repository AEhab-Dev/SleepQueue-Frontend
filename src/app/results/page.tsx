//frontend/src/app/results/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import AlarmPanel from '@/components/AlarmPanel'
import MetricsGrid from '@/components/MetricsGrid'
import SleepQueueVisualizer from '@/components/SleepQueueVisualizer'
import TaskQueue from '@/components/SleepStageTimeline'
import { SimulationResult } from '@/lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
}
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

function RibbonCard({
  item, index,
}: {
  item: { label: string; value: string; sub?: string; color: string; tooltip: string }
  index: number
}) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ y: -4 }}
      style={{
        textAlign: 'center', padding: '22px 14px 18px',
        background: hov ? `${item.color}0d` : 'var(--surface)',
        border: `1px solid ${hov ? item.color + '45' : 'var(--border)'}`,
        borderRadius: 16, position: 'relative', overflow: 'visible',
        transition: 'background 0.25s ease, border-color 0.25s ease',
        cursor: 'default',
      }}
    >
      {/* Top gradient accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${item.color}, transparent)`,
        borderRadius: '16px 16px 0 0',
        opacity: hov ? 1 : 0.5,
        transition: 'opacity 0.25s ease',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)',
        width: 80, height: 80, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${item.color}18 0%, transparent 70%)`,
        opacity: hov ? 1 : 0, transition: 'opacity 0.3s ease',
      }} />

      {/* Value */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.07, type: 'spring', stiffness: 220, damping: 18 }}
        style={{
          fontSize: 28, fontWeight: 900, color: item.color,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em',
        }}
      >
        {item.value}
      </motion.div>

      {/* Label */}
      <div style={{
        fontSize: 10, color: 'var(--text-muted)',
        fontFamily: 'JetBrains Mono', letterSpacing: '0.1em',
        textTransform: 'uppercase', fontWeight: 600,
      }}>
        {item.label}
      </div>

      {/* Optional sub-label */}
      {item.sub && (
        <div style={{
          fontSize: 9, color: `${item.color}70`,
          fontFamily: 'JetBrains Mono', letterSpacing: '0.06em',
          marginTop: 4,
        }}>
          {item.sub}
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
              transform: 'translateX(-50%)', width: 220,
              padding: '10px 13px', borderRadius: 11,
              background: 'rgba(8,10,18,0.98)',
              border: '1px solid rgba(99,179,237,0.2)',
              fontSize: 10.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6,
              fontFamily: 'JetBrains Mono, monospace', zIndex: 99,
              boxShadow: '0 16px 40px rgba(0,0,0,0.7)', pointerEvents: 'none',
              textAlign: 'left',
            }}
          >
            {/* Caret */}
            <div style={{
              position: 'absolute', top: -5, left: '50%',
              width: 8, height: 8,
              background: 'rgba(8,10,18,0.98)',
              border: '1px solid rgba(99,179,237,0.2)',
              borderBottom: 'none', borderRight: 'none',
              transform: 'translateX(-50%) rotate(45deg)',
            }} />
            {item.tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SectionLabel({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--accent)',
        fontFamily: 'JetBrains Mono',
      }}>
        {icon}&nbsp; {title}
      </span>
      {sub && (
        <span style={{
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: 'JetBrains Mono', letterSpacing: '0.06em',
        }}>
          — {sub}
        </span>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const raw = sessionStorage.getItem('sleepqueue_result')
    if (!raw) { router.push('/simulate'); return }
    setResult(JSON.parse(raw))
  }, [router])

  if (!mounted || !result) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 20,
      }}>
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid rgba(99,179,237,0.12)',
              borderTopColor: 'rgba(99,179,237,0.7)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>📊</div>
        </div>
        <motion.p
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 11,
            color: 'var(--text-muted)', letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Loading results
        </motion.p>
      </div>
    )
  }

  const freshnessColor = result.metrics.freshness_score > 70 ? 'var(--accent-3)' : 'var(--danger)'
  const freshnessLabel = result.metrics.freshness_score > 85
    ? 'Excellent' : result.metrics.freshness_score > 70
    ? 'Good' : result.metrics.freshness_score > 50
    ? 'Fair' : 'Poor'

  const ribbonItems = [
    {
      label: 'Sleep Required',
      value: `${result.required_sleep_hours}h`,
      sub: 'tonight',
      color: 'var(--accent)',
      tooltip: 'Hours your body needs based on fatigue load, stress index, and health factors.',
    },
    {
      label: 'Cycles',
      value: String(result.cycles_needed),
      sub: '×90 min each',
      color: 'var(--accent-2)',
      tooltip: 'Each cycle is ~90 minutes. Early cycles are NREM-dominant (repair). Late cycles are REM-dominant (memory).',
    },
    {
      label: 'Freshness',
      value: `${result.metrics.freshness_score}%`,
      sub: freshnessLabel,
      color: freshnessColor,
      tooltip: 'Composite wakeup quality: 60% sleep throughput + 40% cycle utilization. Above 70% = refreshed.',
    },
    {
      label: 'Throughput',
      value: `${result.metrics.throughput_percent}%`,
      sub: `${result.metrics.tasks_completed}/${result.metrics.tasks_total} tasks`,
      color: 'var(--accent-2)',
      tooltip: 'Completed sleep tasks divided by total scheduled tasks — analogous to CPU job completion.',
    },
    {
      label: 'Alarm Windows',
      value: String(result.optimal_alarm_windows.length),
      sub: 'light-stage only',
      color: 'var(--accent-3)',
      tooltip: 'Optimal wakeup windows during light sleep stages, minimizing sleep inertia and grogginess.',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: '-10%', right: '-5%',
        width: 600, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse, ${freshnessColor === 'var(--accent-3)'
          ? 'rgba(104,211,145,0.04)' : 'rgba(252,129,129,0.03)'} 0%, transparent 70%)`,
      }} />
      <div style={{
        position: 'fixed', bottom: '-5%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(99,179,237,0.03) 0%, transparent 70%)',
      }} />

      <NavBar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 32px', position: 'relative', zIndex: 1 }}>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginBottom: 40,
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', flexWrap: 'wrap', gap: 24,
          }}
        >
          <div>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 12px 5px 10px', borderRadius: 9999, marginBottom: 20,
                background: 'rgba(104,211,145,0.05)',
                border: '1px solid rgba(104,211,145,0.2)',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(104,211,145,0.8)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--accent-3)', display: 'inline-block', flexShrink: 0,
                }}
              />
              Analysis Complete
            </motion.div>

            <h1 style={{
              fontSize: 'clamp(22px, 3.5vw, 38px)', fontWeight: 900,
              letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.08,
            }}>
              Simulation{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-3) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Results
              </span>
              {' '}📊
            </h1>

            <p style={{
              color: 'var(--text-muted)', fontFamily: 'JetBrains Mono',
              fontSize: 12, margin: 0, lineHeight: 1.7, letterSpacing: '0.01em',
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{result.cycles_needed}</span>
              {' cycles · '}
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{result.required_sleep_hours}h</span>
              {' required · '}
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{result.task_queue.length}</span>
              {' tasks queued'}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, alignSelf: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/simulate')}
              style={{
                padding: '10px 20px', borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                letterSpacing: '0.03em', transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,179,237,0.3)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
              }}
            >
              ← New Simulation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(99,179,237,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                letterSpacing: '0.04em',
                boxShadow: '0 0 24px rgba(99,179,237,0.18), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              Dashboard →
            </motion.button>
          </div>
        </motion.div>

        {/* ── Summary Ribbon ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
            gap: 12, marginBottom: 40,
          }}
        >
          {ribbonItems.map((item, i) => (
            <RibbonCard key={item.label} item={item} index={i} />
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <div style={{
          height: 1, marginBottom: 36,
          background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.12), transparent)',
        }} />

        {/* ── Result Sections ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel icon="⏰" title="Optimal Alarm Windows" sub="best wakeup moments during light sleep" />
            <AlarmPanel windows={result.optimal_alarm_windows} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <SectionLabel icon="📈" title="Sleep Metrics" sub="detailed cycle and stage breakdown" />
            <MetricsGrid metrics={result.metrics} required_hours={result.required_sleep_hours} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <SectionLabel icon="🔄" title="Sleep Queue Visualizer" sub="cycle-by-cycle stage architecture" />
            <SleepQueueVisualizer cycles={result.cycle_servers} alarmWindows={result.optimal_alarm_windows} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <SectionLabel icon="📋" title="Task Queue" sub="scheduled repair and consolidation tasks" />
            <TaskQueue tasks={result.task_queue} />
          </motion.div>
        </motion.div>

        {/* ── Footer hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 52, paddingTop: 20,
            borderTop: '1px solid rgba(99,179,237,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}
        >
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 10,
            color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em',
          }}>
            Results stored locally · not synced to cloud
          </span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push('/simulate')}
            style={{
              fontFamily: 'JetBrains Mono', fontSize: 10,
              color: 'rgba(99,179,237,0.4)', background: 'none',
              border: 'none', cursor: 'pointer', letterSpacing: '0.08em',
              padding: 0, transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(99,179,237,0.4)')}
          >
            Run another simulation →
          </motion.button>
        </motion.div>

      </main>
    </div>
  )
}