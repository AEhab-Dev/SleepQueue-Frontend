export interface SmartWatchInput {
  heart_rate_avg: number
  hrv_ms: number
  spo2_percent: number
  steps_today: number
  active_calories: number
  stress_score: number
  sleep_debt_hours: number
  age: number
  weight_kg: number
  bedtime_hour: number
}

export interface SleepStage {
  stage: 'WAKE' | 'N1' | 'N2' | 'N3' | 'REM'
  duration_minutes: number
  start_minute: number
}

export interface CycleServer {
  cycle_number: number
  stages: SleepStage[]
  total_minutes: number
}

export interface AlarmWindow {
  start_time: string
  end_time: string
  cycle_after: number
  stage: string
  quality_score: number
}

export interface SleepTask {
  id: string
  name: string
  type: 'NREM1' | 'NREM2' | 'NREM3' | 'REM' | 'WAKE'
  duration_minutes: number
  priority: number
  completed: boolean
  cycle: number
}

export interface SleepMetrics {
  freshness_score: number
  throughput_percent: number
  tasks_completed: number
  tasks_total: number
  deep_sleep_minutes: number
  rem_sleep_minutes: number
  total_sleep_hours: number
  light_sleep_minutes: number
  sleep_efficiency: number
  cycle_utilization: number
}

export interface SimulationResult {
  required_sleep_hours: number
  cycles_needed: number
  bedtime_recommendation: string
  wake_time_recommendation: string
  cycle_servers: CycleServer[]
  task_queue: SleepTask[]
  optimal_alarm_windows: AlarmWindow[]
  metrics: SleepMetrics
}

export async function runSimulation(input: SmartWatchInput): Promise<SimulationResult> {
  const response = await fetch('http://localhost:8000/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error(`Simulation failed: ${response.statusText}`)
  }
  return response.json()
}