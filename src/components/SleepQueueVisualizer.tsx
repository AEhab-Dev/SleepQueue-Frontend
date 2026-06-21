//frontend/src/components/SleepQueueVisualizer.tsx
'use client'
import { CycleServer, AlarmWindow } from '@/lib/api'
import { motion } from 'framer-motion'

interface Props {
  cycles: CycleServer[]
  alarmWindows: AlarmWindow[]
}

const STAGE_COLORS: Record<string, string> = {
  WAKE: 'rgba(252,129,129,0.7)',
  N1:   'rgba(99,179,237,0.4)',
  N2:   'rgba(99,179,237,0.65)',
  N3:   'rgba(72,187,120,0.8)',
  REM:  'rgba(159,122,234,0.8)',
}

const STAGE_LABELS: Record<string, string> = {
  WAKE: 'Wake', N1: 'N1', N2: 'N2', N3: 'Deep', REM: 'REM',
}

export default function SleepQueueVisualizer({ cycles, alarmWindows }: Props) {
  const alarmCycles = new Set(alarmWindows.map(w => w.cycle_after))

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '24px', overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.2), transparent)',
      }} />

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap',
      }}>
        {Object.entries(STAGE_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 3,
              background: STAGE_COLORS[key],
            }} />
            <span style={{
              fontSize: 10, fontFamily: 'JetBrains Mono',
              color: 'var(--text-muted)', letterSpacing: '0.06em',
            }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Cycles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cycles.map((cycle, ci) => {
          const totalMin = cycle.stages.reduce((s, st) => s + st.duration_minutes, 0)
          const isAlarm = alarmCycles.has(cycle.cycle_number)

          return (
            <div key={ci}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
              }}>
                <span style={{
                  fontSize: 10, fontFamily: 'JetBrains Mono',
                  color: 'var(--text-muted)', letterSpacing: '0.08em',
                  minWidth: 60,
                }}>
                  Cycle {cycle.cycle_number}
                </span>
                {isAlarm && (
                  <span style={{
                    fontSize: 9, fontFamily: 'JetBrains Mono',
                    color: 'var(--accent-3)', letterSpacing: '0.1em',
                    padding: '2px 7px', borderRadius: 4,
                    background: 'rgba(72,187,120,0.08)',
                    border: '1px solid rgba(72,187,120,0.2)',
                  }}>
                    ⏰ ALARM
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden',
                border: isAlarm ? '1px solid rgba(72,187,120,0.3)' : '1px solid var(--border)',
              }}>
                {cycle.stages.map((stage, si) => {
                  const pct = (stage.duration_minutes / totalMin) * 100
                  return (
                    <motion.div
                      key={si}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: ci * 0.08 + si * 0.02, duration: 0.5, ease: 'easeOut' }}
                      title={`${STAGE_LABELS[stage.stage]}: ${stage.duration_minutes}min`}
                      style={{
                        background: STAGE_COLORS[stage.stage] || 'rgba(99,179,237,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', cursor: 'default',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {pct > 8 && (
                        <span style={{
                          fontSize: 9, fontFamily: 'JetBrains Mono',
                          color: 'rgba(255,255,255,0.8)', fontWeight: 700,
                          letterSpacing: '0.04em',
                        }}>
                          {stage.duration_minutes}m
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}