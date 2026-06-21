//frontend/src/app/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import HistoryGraph from '@/components/HistoryGraph'
import { getHistory, HistoryEntry, clearHistory } from '@/lib/history'

function InfoTooltip({ text }: { text: string }) {
  const [v, setV] = useState(false)
  return (
    <div
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setV(true)}
      onMouseLeave={() => setV(false)}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: v ? 'rgba(99,179,237,0.15)' : 'transparent',
        border: `1px solid ${v ? 'rgba(99,179,237,0.6)' : 'rgba(99,179,237,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: v ? '#63b3ed' : 'rgba(99,179,237,0.35)',
        fontSize: 10, cursor: 'help', transition: 'all 0.2s ease',
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      }}>i</div>
      <AnimatePresence>
        {v && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            style={{
              position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
              transform: 'translateX(-50%)',
              width: 230, padding: '12px 14px', borderRadius: 12,
              background: 'rgba(8,10,18,0.98)',
              border: '1px solid rgba(99,179,237,0.25)',
              fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65,
              boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,179,237,0.05)',
              pointerEvents: 'none', fontFamily: 'JetBrains Mono, monospace',
              zIndex: 999, whiteSpace: 'normal',
            }}
          >
            <div style={{
  position: 'absolute', bottom: -5, left: '50%',
  width: 8, height: 8, background: 'rgba(8,10,18,0.98)',
  border: '1px solid rgba(99,179,237,0.25)',
  borderTop: 'none', borderLeft: 'none',
  transform: 'translateX(-50%) rotate(45deg)',
}} />
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
}
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const STAT_COLORS = {
  blue: 'var(--accent)',
  green: 'var(--accent-3)',
  purple: 'var(--accent-2)',
  teal: 'var(--nrem3)',
}

export default function DashboardPage() {
  const router = useRouter()
  const user = { id: 'local', firstName: 'Ahmed' }
const isLoaded = true
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [mounted, setMounted] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
  setMounted(true)
  setHistory(getHistory())
}, [])

  if (!isLoaded || !mounted) {
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
              border: '1px solid rgba(99,179,237,0.15)',
              borderTopColor: 'rgba(99,179,237,0.8)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 8, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🌙</div>
        </div>
        <motion.p
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em' }}
        >
          LOADING SLEEP DATA
        </motion.p>
      </div>
    )
  }

  const latest = history[0]
  const avgFreshness = history.length
    ? Math.round(history.reduce((s, h) => s + h.freshness_score, 0) / history.length)
    : null
  const totalSims = history.length
  const isFirstTime = history.length === 0

  const freshnessColor = avgFreshness && avgFreshness > 70
    ? 'var(--accent-3)' : 'var(--danger)'

  const statItems = [
    {
      label: 'Simulations Run',
      value: totalSims,
      unit: '',
      icon: '🔬',
      color: 'var(--accent)',
      tooltip: 'Total sleep analyses completed. Each simulation refines your personal sleep model.',
    },
    {
      label: 'Avg Freshness',
      value: avgFreshness ?? 0,
      unit: '%',
      icon: '✨',
      color: avgFreshness && avgFreshness > 70 ? 'var(--accent-3)' : 'var(--danger)',
      tooltip: 'Your average freshness score across all sessions. A score above 70% signals consistently restorative sleep.',
    },
    {
      label: 'Sleep Required',
      value: latest?.required_sleep_hours ?? 0,
      unit: 'h',
      icon: '🎯',
      color: 'var(--accent-2)',
      tooltip: 'Optimal sleep duration calculated in your last simulation, tailored to your biometric data.',
    },
    {
      label: 'Deep Sleep',
      value: latest?.deep_sleep_minutes ?? 0,
      unit: 'min',
      icon: '🔧',
      color: 'var(--nrem3)',
      tooltip: 'NREM Stage 3 duration from your last session. This is when physical repair, memory consolidation, and hormonal reset occur.',
    },
  ]

  const handleClearHistory = () => {
  if (!confirmClear) {
    setConfirmClear(true)
    setTimeout(() => setConfirmClear(false), 3000)
    return
  }
  clearHistory()
  setHistory([])
  setConfirmClear(false)
}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient background glow */}
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(99,179,237,0.04) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(159,122,234,0.04) 0%, transparent 70%)',
      }} />

      <NavBar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 32px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 52 }}
        >
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>

              {/* System badge */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '5px 12px 5px 10px', borderRadius: 9999, marginBottom: 22,
                  background: 'rgba(99,179,237,0.05)',
                  border: '1px solid rgba(99,179,237,0.15)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'rgba(99,179,237,0.7)',
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
                Sleep Intelligence · Online
              </motion.div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900,
                letterSpacing: '-0.035em', lineHeight: 1.08, margin: '0 0 14px',
                color: 'var(--text)',
              }}>
                {isFirstTime ? (
                  <>Welcome to{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>SleepQueue</span>
                    {' '}🌙
                  </>
                ) : (
                  <>Good to see you,{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, var(--accent) 20%, var(--accent-2) 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{user?.firstName ?? 'Sleeper'}</span>
                    {' '}🌙
                  </>
                )}
              </h1>

              {/* Subline */}
              <p style={{
                color: 'var(--text-muted)', fontFamily: 'JetBrains Mono',
                fontSize: 12, lineHeight: 1.7, margin: 0, letterSpacing: '0.01em',
              }}>
                {isFirstTime
                  ? 'Connect your smartwatch data and run your first simulation to unlock personalized sleep insights.'
                  : (
                    <>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{totalSims}</span>
                      {` simulation${totalSims !== 1 ? 's' : ''} logged · Avg freshness `}
                      <span style={{ color: freshnessColor, fontWeight: 700 }}>{avgFreshness}%</span>
                    </>
                  )
                }
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 56px rgba(99,179,237,0.45), 0 0 0 1px rgba(99,179,237,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/simulate')}
              style={{
                alignSelf: 'center',
                padding: '13px 28px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                letterSpacing: '0.06em', whiteSpace: 'nowrap',
                boxShadow: '0 0 32px rgba(99,179,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                transition: 'box-shadow 0.25s ease',
              }}
            >
              ⚙️&nbsp;&nbsp;New Simulation
            </motion.button>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        {!isFirstTime && (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 14, marginBottom: 40,
            }}
          >
            {statItems.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{
                  y: -5,
                  borderColor: `${stat.color}44`,
                  boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${stat.color}22`,
                }}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16, padding: '20px 20px 18px',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                }}
              >
                {/* Top color bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                  borderRadius: '16px 16px 0 0',
                }} />

                {/* Ambient glow */}
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 90, height: 90,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${stat.color}14 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Label row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 14,
                }}>
                  <div style={{
                    fontSize: 10, color: 'var(--text-muted)',
                    fontFamily: 'JetBrains Mono', letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    {stat.icon}&nbsp; {stat.label}
                  </div>
                  <InfoTooltip text={stat.tooltip} />
                </div>

                {/* Value */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{
                    fontSize: 38, fontWeight: 900, color: stat.color,
                    lineHeight: 1, fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                  <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.6, marginLeft: 2 }}>
                    {stat.unit}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── First-Time Empty State ── */}
        {isFirstTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(135deg, rgba(99,179,237,0.05) 0%, rgba(159,122,234,0.03) 100%)',
              border: '1px dashed rgba(99,179,237,0.2)',
              borderRadius: 24, padding: '64px 40px',
              textAlign: 'center', marginBottom: 40,
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Subtle grid texture */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(circle, rgba(99,179,237,0.06) 1px, transparent 1px)',
              backgroundSize: '32px 32px', opacity: 0.5,
            }} />

            {/* Pulsing icon */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.1 }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '1px solid rgba(99,179,237,0.3)',
                  }}
                />
              ))}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(99,179,237,0.08)',
                border: '1px solid rgba(99,179,237,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, position: 'relative', zIndex: 1,
              }}>💤</div>
            </div>

            <h2 style={{
              fontSize: 22, fontWeight: 800, marginBottom: 12,
              letterSpacing: '-0.02em', color: 'var(--text)',
            }}>
              No simulations yet
            </h2>
            <p style={{
              color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.75,
              maxWidth: 440, margin: '0 auto 36px',
              fontFamily: 'JetBrains Mono', letterSpacing: '0.01em',
            }}>
              Enter your smartwatch metrics and let the engine calculate your{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>optimal sleep window</span>,{' '}
              ideal alarm timing, and recovery priorities.
            </p>

            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 56px rgba(99,179,237,0.45), 0 0 0 1px rgba(99,179,237,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/simulate')}
              style={{
                padding: '15px 48px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                letterSpacing: '0.05em',
                boxShadow: '0 0 40px rgba(99,179,237,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              Run First Simulation →
            </motion.button>
          </motion.div>
        )}

        {/* ── History Graph ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <HistoryGraph history={history} />
        </motion.div>

        {/* ── Session Log Table ── */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '28px 28px 20px', marginTop: 20,
              overflow: 'hidden', position: 'relative',
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.2), transparent)',
            }} />

            {/* Table header row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 22,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono', letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}>
                  🗂&nbsp; Session Log
                </span>
                <InfoTooltip text="All simulations sorted newest first. A freshness score above 70% indicates restorative, high-quality sleep." />
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClearHistory}
                style={{
                  padding: '6px 14px', borderRadius: 8,
                  border: `1px solid ${confirmClear ? 'rgba(252,129,129,0.6)' : 'rgba(252,129,129,0.2)'}`,
                  background: confirmClear ? 'rgba(252,129,129,0.08)' : 'transparent',
                  color: 'var(--danger)', fontSize: 11,
                  cursor: 'pointer', fontFamily: 'JetBrains Mono',
                  transition: 'all 0.2s ease', letterSpacing: '0.06em',
                }}
              >
                {confirmClear ? '⚠️ Confirm Clear' : 'Clear History'}
              </motion.button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse',
                fontFamily: 'JetBrains Mono', fontSize: 12,
              }}>
                <thead>
                  <tr>
                    {[
                      { label: 'Date', tip: null },
                      { label: 'Required', tip: null },
                      { label: 'Actual', tip: null },
                      { label: 'Freshness', tip: null },
                      { label: 'Throughput', tip: null },
                      { label: 'Deep Sleep', tip: null },
                      { label: 'REM', tip: null },
                    ].map(col => (
                      <th key={col.label} style={{
                        padding: '8px 14px 14px', textAlign: 'left',
                        color: 'var(--text-muted)', fontWeight: 600,
                        letterSpacing: '0.1em', fontSize: 10,
                        textTransform: 'uppercase',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <motion.tr
                      key={h.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.035, ease: 'easeOut' }}
                      style={{
                        borderBottom: i < history.length - 1
                          ? '1px solid rgba(99,179,237,0.05)' : 'none',
                        cursor: 'default',
                      }}
                      whileHover={{ backgroundColor: 'rgba(99,179,237,0.03)' } as any}
                    >
                      <td style={{ padding: '13px 14px', color: 'var(--text-muted)', fontSize: 11 }}>
                        {new Date(h.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: '13px 14px', color: 'var(--accent)', fontWeight: 700 }}>
                        {h.required_sleep_hours}h
                      </td>
                      <td style={{ padding: '13px 14px', color: 'var(--text)' }}>
                        {h.total_sleep_hours}h
                      </td>
                      <td style={{ padding: '13px 14px', fontWeight: 700 }}>
                        <span style={{
                          color: h.freshness_score > 70 ? 'var(--accent-3)' : 'var(--danger)',
                          padding: '3px 8px', borderRadius: 6,
                          background: h.freshness_score > 70
                            ? 'rgba(72,187,120,0.08)' : 'rgba(252,129,129,0.08)',
                          fontSize: 11,
                        }}>
                          {h.freshness_score}%
                        </span>
                      </td>
                      <td style={{ padding: '13px 14px', color: 'var(--accent-2)' }}>
                        {h.throughput_percent}%
                      </td>
                      <td style={{ padding: '13px 14px', color: 'var(--nrem3)' }}>
                        {h.deep_sleep_minutes}min
                      </td>
                      <td style={{ padding: '13px 14px', color: 'var(--rem)' }}>
                        {h.rem_sleep_minutes}min
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer hint */}
            <div style={{
              marginTop: 18, paddingTop: 16,
              borderTop: '1px solid rgba(99,179,237,0.06)',
              fontSize: 10, color: 'rgba(255,255,255,0.2)',
              fontFamily: 'JetBrains Mono', letterSpacing: '0.08em',
              textAlign: 'right',
            }}>
              {history.length} record{history.length !== 1 ? 's' : ''} · sorted by recency
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
/*
d:\python\venv\Scripts\activate.bat
cd D:\python\frontend
npm run dev
cd D:\python
uvicorn main:app --host 0.0.0.0 --port 8000
ngrok http 3000
*/