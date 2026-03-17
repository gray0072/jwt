import { useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Grid2 as Grid,
  Button,
  Divider,
  Typography,
  Alert,
} from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SendIcon from '@mui/icons-material/Send'
import { AlgorithmPicker } from './AlgorithmPicker'
import { ClaimsForm } from './ClaimsForm'
import { CustomClaimsEditor } from './CustomClaimsEditor'
import { SnippetsPanel } from './SnippetsPanel'
import { SectionCard } from '@/components/common/SectionCard'
import { TokenDisplay } from '@/components/common/TokenDisplay'
import { CopyButton } from '@/components/common/CopyButton'
import { useGenerateStore } from '@/stores/generateStore'
import { useDecodeStore } from '@/stores/decodeStore'
import { useAppStore } from '@/stores/appStore'
import { generateToken } from '@/lib/jwt'
import { addToHistory } from '@/lib/history'

export function GenerateTab() {
  const {
    algorithm,
    secret,
    secretBase64,
    privateKey,
    claims,
    customClaims,
    generatedToken,
    generateError,
    setGeneratedToken,
    reset,
  } = useGenerateStore()
  const { setRawToken } = useDecodeStore()
  const { setActiveTab } = useAppStore()

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const generate = useCallback(async () => {
    try {
      const token = await generateToken(
        algorithm,
        secret,
        secretBase64,
        privateKey,
        claims,
        customClaims
      )
      setGeneratedToken(token, null)
      addToHistory({
        token,
        algorithm,
        sub: claims.sub || undefined,
        firstCustomKey: customClaims[0]?.key || undefined,
        timestamp: Date.now(),
        mode: 'generated',
      })
    } catch (e) {
      setGeneratedToken(null, e instanceof Error ? e.message : String(e))
    }
  }, [algorithm, secret, secretBase64, privateKey, claims, customClaims, setGeneratedToken])

  // Auto-generate with debounce when inputs change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(generate, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [generate])

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') generate()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [generate])

  const handleSendToDecode = () => {
    if (generatedToken) {
      setRawToken(generatedToken)
      setActiveTab('decode')
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Left: Form */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SectionCard title="Algorithm & Key">
              <AlgorithmPicker />
            </SectionCard>

            <SectionCard title="Standard Claims">
              <ClaimsForm />
            </SectionCard>

            <SectionCard title="Custom Claims">
              <CustomClaimsEditor />
            </SectionCard>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                onClick={generate}
                sx={{ flex: 1 }}
              >
                Generate
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={reset}
                color="secondary"
              >
                Reset
              </Button>
            </Box>
            <Typography variant="caption" color="text.disabled" sx={{ mt: -1 }}>
              Ctrl+Enter to generate
            </Typography>
          </Box>
        </Grid>

        {/* Right: Output */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SectionCard
              noPadding
              title="Generated Token"
              action={
                generatedToken ? (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <CopyButton text={generatedToken} />
                    <Button
                      size="small"
                      startIcon={<SendIcon />}
                      onClick={handleSendToDecode}
                      sx={{ fontSize: '0.72rem', py: 0.25 }}
                    >
                      Decode
                    </Button>
                  </Box>
                ) : null
              }
            >
              <Box sx={{ p: 2, minHeight: 80 }}>
                {generateError && (
                  <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                    {generateError}
                  </Alert>
                )}
                {generatedToken ? (
                  <TokenDisplay token={generatedToken} />
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    Fill in the form to generate a token.
                  </Typography>
                )}
              </Box>
            </SectionCard>

            {/* Snippets */}
            <SectionCard title="Use in Code">
              <SnippetsPanel token={generatedToken ?? ''} />
            </SectionCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
