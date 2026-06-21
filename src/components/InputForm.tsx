//frontend/src/components/InputForm.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SmartWatchInput } from '@/lib/api'

interface Props {
  onSubmit: (data: SmartWatchInput) => void
  loading: boolean
}

const DEFAULTS: SmartWatchInput = {
  heart_rate_avg: 68,
  hrv_ms: 42,
  spo2_percent: 97,
  steps_today: 8000,
  active_calories: 420,
  stress_score: 35,
  sleep_debt_hours: 1.5,
  age: 28,
  weight_kg: 72,
  bedtime_hour: 23,
}

type Field = {
  key: keyof SmartWatchInput
  label: string
  unit: string
  min: number
  max: number
  step: number
  tip: string
}

const FIELDS: Field[] = [
  { key: 'heart_rate_avg', label: 'Avg Heart Rate', unit: 'bpm', min: 40, max: 120, step: 1, tip: 'Resting average from today' },
  { key: 'hrv_ms', label: 'HRV', unit: 'ms', min: 10, max: 120, step: 1, tip: 'Heart rate variability — higher = better recovery' },
  { key: 'spo2_percent', label: 'SpO₂', unit: '%', min: 85, max: 100, step: 0.1, tip: 'Blood oxygen saturation' },
  { key: 'steps_today', label: 'Steps Today', unit: 'steps', min: 0, max: 30000, step: 100, tip: 'Total daily step count' },
  { key: 'active_calories', label: 'Active Calories', unit: 'kcal', min: 0, max: 3000, step: 10, tip: 'Active (non-BMR) calories burned' },
  { key: 'stress_score', label: 'Stress Score', unit: '/100', min: 0, max: 100, step: 1, tip: 'Garmin/Fitbit stress index' },
  { key: 'sleep_debt_hours', label: 'Sleep Debt', unit: 'h', min: 0, max: 12, step: 0.5, tip: 'Accumulated sleep deficit' },
  { key: 'age', label: 'Age', unit: 'yrs', min: 16, max: 90, step: 1, tip: 'Used to calibrate circadian model' },
  { key: 'weight_kg', label: 'Weight', unit: 'kg', min: 40, max: 200, step: 0.5, tip: 'Body weight for metabolic calc' },
  { key: 'bedtime_hour', label: 'Bedtime', unit: 'h (24h)', min: 18, max: 30, step: 0.5, tip: 'Intended bedtime (e.g. 23 = 11pm, 26 = 2am)' },
]

export default function InputForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState<SmartWatchInput>(DEFAULTS)

  const set = (key: keyof SmartWatchInput, val: number) =>
    setValues(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '32px 28px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.25), transparent)',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 14, marginBottom: 28,
      }}>
        {FIELDS.map(field => (
          <div key={field.key}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 7,
            }}>
              <label style={{
                fontSize: 11, fontFamily: 'JetBrains Mono',
                color: 'var(--text-muted)', letterSpacing: '0.06em',
                fontWeight: 600,
              }}>
                {field.label}
              </label>
              <span style={{
                fontSize: 11, fontFamily: 'JetBrains Mono',
                color: 'var(--accent)', fontWeight: 700,
              }}>
                {values[field.key]} {field.unit}
              </span>
            </div>
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.key]}
              onChange={e => set(field.key, parseFloat(e.target.value))}
              title={field.tip}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(99,179,237,0.04)',
                border: '1px solid rgba(99,179,237,0.15)',
                borderRadius: 10, color: 'var(--text)',
                fontFamily: 'JetBrains Mono', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,179,237,0.45)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,179,237,0.15)')}
            />
          </div>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? {
          scale: 1.02,
          boxShadow: '0 0 48px rgba(99,179,237,0.4)',
        } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        style={{
          width: '100%', padding: '14px',
          borderRadius: 12, border: 'none',
          background: loading
            ? 'rgba(99,179,237,0.3)'
            : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
          color: '#fff', fontSize: 15, fontWeight: 700,
          fontFamily: 'Syne, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.06em',
          boxShadow: '0 0 32px rgba(99,179,237,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          transition: 'background 0.3s ease',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? '⚙️  Running Simulation…' : '⚙️  Run Simulation'}
      </motion.button>
    </motion.form>
  )
}