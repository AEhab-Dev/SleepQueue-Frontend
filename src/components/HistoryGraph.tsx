//frontend/src/components/HistoryGraph.tsx
'use client'
import { HistoryEntry } from '@/lib/history'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface Props { history: HistoryEntry[] }

export default function HistoryGraph({ history }: Props) {
  if (history.length === 0) return null

  const data = [...history].reverse().map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Freshness: h.freshness_score,
    Throughput: h.throughput_percent,
    'Deep Sleep (min)': h.deep_sleep_minutes,
  }))

  return (
    <motion.div
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '28px 28px 20px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.2), transparent)',
      }} />

      <div style={{ marginBottom: 20 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: 'var(--accent)',
          fontFamily: 'JetBrains Mono', letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          📊&nbsp; Trend History
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(8,10,18,0.97)', border: '1px solid rgba(99,179,237,0.2)',
              borderRadius: 10, fontFamily: 'JetBrains Mono', fontSize: 11,
              color: 'rgba(255,255,255,0.8)',
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10, paddingTop: 12 }}
          />
          <Line type="monotone" dataKey="Freshness" stroke="#63b3ed" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Throughput" stroke="#9f7aea" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Deep Sleep (min)" stroke="#68d391" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}