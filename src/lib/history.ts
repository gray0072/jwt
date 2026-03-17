const STORAGE_KEY = 'jwt-lab-history'
const MAX_ENTRIES = 50

export interface HistoryEntry {
  id: string
  token: string
  algorithm: string
  sub?: string
  firstCustomKey?: string
  timestamp: number
  mode: 'decoded' | 'generated'
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function addToHistory(entry: Omit<HistoryEntry, 'id'>): void {
  const history = getHistory()
  const newEntry: HistoryEntry = { ...entry, id: crypto.randomUUID() }
  const filtered = history.filter((e) => e.token !== entry.token)
  const updated = [newEntry, ...filtered].slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function removeFromHistory(id: string): void {
  const history = getHistory().filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}
