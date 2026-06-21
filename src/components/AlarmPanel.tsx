//frontend/src/components/AlarmPanel.tsx
'use client'
import { AlarmWindow } from '@/lib/api'
import { motion } from 'framer-motion'

interface Props { windows: AlarmWindow[] }

export default function AlarmPanel({ windows }: Props) {
  if (!windows.length) return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '24px', textAlign: 'center',
      fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)',
    }}>
      No optimal alarm windows found.
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
      {windows.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '18px 18px 16px',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--accent-3), transparent)',
          }} />
          <div style={{
            fontSize: 10, fontFamily: 'JetBrains Mono',
            color: 'var(--text-muted)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 10,
          }}>
            Window {i + 1} · After cycle {w.cycle_after}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 900, fontFamily: 'JetBrains Mono',
            color: 'var(--accent-3)', letterSpacing: '-0.02em', marginBottom: 4,
          }}>
            {w.start_time}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono',
          }}>
            to {w.end_time}
          </div>
          <div style={{
            marginTop: 12, padding: '4px 8px', borderRadius: 6,
            background: 'rgba(99,179,237,0.06)', display: 'inline-block',
            fontSize: 10, fontFamily: 'JetBrains Mono',
            color: 'var(--accent)', letterSpacing: '0.06em',
          }}>
            {w.stage} · {w.quality_score}% quality
          </div>
        </motion.div>
      ))}
    </div>
  )
}