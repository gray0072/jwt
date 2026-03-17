export const JWT_COLORS = {
  header: '#f97583',
  payload: '#79b8ff',
  signature: '#ffab70',
  dot: '#8b949e',
} as const

export const ALGORITHM_COLORS: Record<string, string> = {
  HS256: '#58a6ff',
  HS384: '#58a6ff',
  HS512: '#58a6ff',
  RS256: '#3fb950',
  RS384: '#3fb950',
  RS512: '#3fb950',
  PS256: '#d2a8ff',
  PS384: '#d2a8ff',
  PS512: '#d2a8ff',
  ES256: '#ffa657',
  ES384: '#ffa657',
  ES512: '#ffa657',
  EdDSA: '#ff7b72',
  none: '#8b949e',
}
