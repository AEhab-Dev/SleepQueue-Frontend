//frontend/src/components/MetricsGrid.tsx
'use client'
import { SleepMetrics } from '@/lib/api'
import { motion } from 'framer-motion'

interface Props {
  metrics: SleepMetrics
  required_hours: number
}

export default function MetricsGrid({ metrics, required_hours }: Props) {
  const items = [
    { label: 'Total Sleep', value: `${metrics.total_sleep_hours}h`, color: 'var(--accent)' },
    { label: 'Required', value: `${required_hours}h`, color: 'var(--accent)' },
    { label: 'Deep Sleep', value: `${metrics.deep_sleep_minutes}min`, color: 'var(--nrem3)' },
    { label: 'REM Sleep', value: `${metrics.rem_sleep_minutes}min`, color: 'var(--rem)' },
    { label: 'Light Sleep', value: `${metrics.light_sleep_minutes}min`, color: 'var(--accent-2)' },
    { label: 'Efficiency', value: `${metrics.sleep_efficiency}%`, color: 'var(--accent-3)' },
    { label: 'Tasks Done', value: `${metrics.tasks_completed}/${metrics.tasks_total}`, color: 'var(--accent-2)' },
    { label: 'Cycle Use', value: `${metrics.cycle_utilization}%`, color: 'var(--accent-3)' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 10,
    }}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 16px 14px',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${item.color}, transparent)`,
          }} />
          <div style={{
            fontSize: 9, fontFamily: 'JetBrains Mono',
            color: 'var(--text-muted)', letterSpacing: '0.1em',
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 8,
          }}>
            {item.label}
          </div>
          <div style={{
            fontSize: 28, fontWeight: 900, fontFamily: 'JetBrains Mono',
            color: item.color, lineHeight: 1, letterSpacing: '-0.02em',
          }}>
            {item.value}
          </div>
        </motion.div>
      ))}
    </div>
  )
}