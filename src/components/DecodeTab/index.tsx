import { useEffect, useRef, useCallback } from 'react'
import { Box, Grid2 as Grid, Alert } from '@mui/material'
import { TokenInput } from './TokenInput'
import { HeaderPanel } from './HeaderPanel'
import { PayloadPanel } from './PayloadPanel'
import { SignaturePanel } from './SignaturePanel'
import { useDecodeStore } from '@/stores/decodeStore'
import { decodeToken } from '@/lib/jwt'
import { addToHistory } from '@/lib/history'

export function DecodeTab() {
  const { rawToken, decodedHeader, decodedPayload, decodeError, setDecoded } = useDecodeStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const decode = useCallback(
    (token: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (!token.trim()) {
          setDecoded(null, null, null)
          return
        }
        try {
          const result = decodeToken(token)
          setDecoded(
            result.header as Record<string, unknown>,
            result.payload as Record<string, unknown>,
            null
          )
          // Save to history
          const alg = (result.header.alg as string) ?? 'unknown'
          const sub = result.payload.sub as string | undefined
          const firstCustomKey = Object.keys(result.payload).find(
            (k) => !['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'].includes(k)
          )
          addToHistory({ token, algorithm: alg, sub, firstCustomKey, timestamp: Date.now(), mode: 'decoded' })
        } catch (e) {
          setDecoded(null, null, e instanceof Error ? e.message : String(e))
        }
      }, 150)
    },
    [setDecoded]
  )

  // Decode on mount if token already set
  useEffect(() => {
    if (rawToken) decode(rawToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const algorithm = decodedHeader?.alg as string | undefined

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Left: Token input */}
        <Grid size={{ xs: 12, md: 5 }}>
          <TokenInput onTokenChange={decode} />
          {decodeError && (
            <Alert severity="error" sx={{ mt: 1.5, fontSize: '0.8rem' }}>
              {decodeError}
            </Alert>
          )}
        </Grid>

        {/* Right: Decoded panels */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <HeaderPanel header={decodedHeader} />
            <PayloadPanel payload={decodedPayload} />
            <SignaturePanel algorithm={algorithm} rawToken={rawToken} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
