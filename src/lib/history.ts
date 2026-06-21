export interface HistoryEntry {
  id: string
  date: string
  required_sleep_hours: number
  freshness_score: number
  throughput_percent: number
  deep_sleep_minutes: number
  rem_sleep_minutes: number
  total_sleep_hours: number
  tasks_completed: number
  tasks_total: number
}

const HISTORY_KEY = 'sleepqueue_history'

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHistory(entry: Omit<HistoryEntry, 'id' | 'date'>): void {
  if (typeof window === 'undefined') return
  const history = getHistory()
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify([newEntry, ...history]))
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HISTORY_KEY)
}