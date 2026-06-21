//src/components/SleepStageTimeline.tsx
'use client'
import { SleepTask } from '@/lib/api'
import { motion } from 'framer-motion'

interface Props { tasks: SleepTask[] }

const TYPE_COLORS: Record<string, string> = {
  NREM1: 'var(--accent)',
  NREM2: 'var(--accent)',
  NREM3: 'var(--nrem3)',
  REM:   'var(--rem)',
  WAKE:  'var(--danger)',
}

const TYPE_LABELS: Record<string, string> = {
  NREM1: 'N1', NREM2: 'N2', NREM3: 'Deep', REM: 'REM', WAKE: 'Wake',
}

export default function TaskQueue({ tasks }: Props) {
  if (!tasks.length) return null

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '24px', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(159,122,234,0.2), transparent)',
      }} />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          <thead>
            <tr>
              {['#', 'Task', 'Type', 'Duration', 'Cycle', 'Priority', 'Status'].map(col => (
                <th key={col} style={{
                  padding: '8px 12px 12px', textAlign: 'left',
                  fontSize: 10, color: 'var(--text-muted)',
                  fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025 }}
                style={{
                  borderBottom: i < tasks.length - 1
                    ? '1px solid rgba(99,179,237,0.04)' : 'none',
                }}
              >
                <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ padding: '12px 12px', color: 'var(--text)', fontWeight: 600 }}>{task.name}</td>
                <td style={{ padding: '12px 12px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 5,
                    background: `${TYPE_COLORS[task.type]}18`,
                    color: TYPE_COLORS[task.type],
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                  }}>
                    {TYPE_LABELS[task.type] ?? task.type}
                  </span>
                </td>
                <td style={{ padding: '12px 12px', color: 'var(--accent-2)' }}>{task.duration_minutes}min</td>
                <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{task.cycle}</td>
                <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{task.priority}</td>
                <td style={{ padding: '12px 12px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 5, fontSize: 10, fontWeight: 700,
                    color: task.completed ? 'var(--accent-3)' : 'var(--text-muted)',
                    background: task.completed ? 'rgba(72,187,120,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${task.completed ? 'rgba(72,187,120,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    {task.completed ? '✓ Done' : '○ Pending'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: 16, paddingTop: 14,
        borderTop: '1px solid rgba(99,179,237,0.06)',
        fontSize: 10, color: 'rgba(255,255,255,0.2)',
        fontFamily: 'JetBrains Mono', letterSpacing: '0.08em',
        textAlign: 'right',
      }}>
        {tasks.length} tasks · {tasks.filter(t => t.completed).length} completed
      </div>
    </div>
  )
}