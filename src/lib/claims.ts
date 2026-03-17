import { v4 as uuidv4 } from 'uuid'
import type { CustomClaim } from '@/stores/generateStore'

export function generateJTI(): string {
  return uuidv4()
}

/** Parse a duration string like "1h", "30m", "7d", "3600" → seconds */
export function parseDuration(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const match = /^(\d+(?:\.\d+)?)\s*(s|m|h|d|w)?$/.exec(trimmed)
  if (!match) return null

  const value = parseFloat(match[1]!)
  const unit = match[2] ?? 's'
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  }
  return Math.round(value * (multipliers[unit] ?? 1))
}

/** Format a unix timestamp as a relative string */
export function formatRelative(unix: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = unix - now
  const abs = Math.abs(diff)

  const units: [number, string][] = [
    [60, 'second'],
    [3600, 'minute'],
    [86400, 'hour'],
    [604800, 'day'],
    [2592000, 'week'],
    [31536000, 'month'],
  ]

  let label = `${abs} seconds`
  for (let i = 0; i < units.length - 1; i++) {
    const [threshold, unit] = units[i]!
    const [nextThreshold] = units[i + 1]!
    if (abs < nextThreshold) {
      const count = Math.floor(abs / threshold)
      label = `${count} ${unit}${count !== 1 ? 's' : ''}`
      break
    }
  }
  if (abs >= 31536000) {
    const count = Math.floor(abs / 31536000)
    label = `${count} month${count !== 1 ? 's' : ''}`
  }

  return diff >= 0 ? `in ${label}` : `${label} ago`
}

/** Format a unix timestamp as a human-readable date */
export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/** Build payload object from custom claims */
export function buildCustomPayload(
  customClaims: CustomClaim[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const claim of customClaims) {
    if (!claim.key.trim()) continue
    try {
      switch (claim.type) {
        case 'number':
          result[claim.key] = Number(claim.value)
          break
        case 'boolean':
          result[claim.key] = claim.value === 'true'
          break
        case 'json':
          result[claim.key] = JSON.parse(claim.value)
          break
        default:
          result[claim.key] = claim.value
      }
    } catch {
      result[claim.key] = claim.value
    }
  }
  return result
}

export const DURATION_PRESETS = [
  { label: '15 min', value: '15m' },
  { label: '1 hour', value: '1h' },
  { label: '24 hours', value: '24h' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '365d' },
]
