import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusChip } from '@/components/common/StatusChip'
import { useDecodeStore } from '@/stores/decodeStore'
import { verifyToken } from '@/lib/jwt'
import { getAlgorithmFamily } from '@/lib/jwt'

interface SignaturePanelProps {
  algorithm: string | undefined
  rawToken: string
}

type InputMode = 'pem' | 'jwk'

export function SignaturePanel({ algorithm, rawToken }: SignaturePanelProps) {
  const {
    verificationSecret,
    secretEncoding,
    publicKey,
    verificationStatus,
    verificationError,
    setVerificationSecret,
    setSecretEncoding,
    setPublicKey,
    setVerificationStatus,
  } = useDecodeStore()

  const [inputMode, setInputMode] = useState<InputMode>('pem')
  const [loading, setLoading] = useState(false)

  const family = algorithm ? getAlgorithmFamily(algorithm) : null
  const isHmac = family === 'HMAC'
  const isAsymmetric = family === 'RSA' || family === 'RSA-PSS' || family === 'EC' || family === 'EdDSA'
  const isNone = algorithm === 'none'

  const handleVerify = async () => {
    if (!rawToken.trim() || !algorithm) return
    setLoading(true)
    try {
      if (isNone) {
        const parts = rawToken.trim().split('.')
        if (parts.length === 3 && parts[2] === '') {
          setVerificationStatus('valid', null)
        } else {
          setVerificationStatus('invalid', 'Invalid "none" algorithm token')
        }
        return
      }
      await verifyToken(rawToken, algorithm, verificationSecret, secretEncoding, publicKey)
      setVerificationStatus('valid', null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setVerificationStatus('invalid', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard
      noPadding
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#ffab70' }}>
            Signature
          </Typography>
          <StatusChip status={verificationStatus} />
        </Box>
      }
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!algorithm && (
          <Typography variant="body2" color="text.disabled">
            Paste a token to verify its signature.
          </Typography>
        )}

        {isNone && (
          <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
            Algorithm is <strong>none</strong>. This token has no signature.
          </Alert>
        )}

        {isHmac && (
          <>
            <TextField
              label="Secret"
              fullWidth
              size="small"
              type={secretEncoding === 'utf8' ? 'text' : 'text'}
              value={verificationSecret}
              onChange={(e) => setVerificationSecret(e.target.value)}
              placeholder="Enter the HMAC secret"
              inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={secretEncoding === 'base64url'}
                  onChange={(e) => setSecretEncoding(e.target.checked ? 'base64url' : 'utf8')}
                />
              }
              label={<Typography variant="caption">Secret is Base64URL encoded</Typography>}
            />
          </>
        )}

        {isAsymmetric && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Public Key
              </Typography>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={inputMode}
                onChange={(_, v: InputMode) => { if (v) setInputMode(v) }}
                sx={{ height: 26 }}
              >
                <ToggleButton value="pem" sx={{ fontSize: '0.7rem', px: 1.5 }}>PEM</ToggleButton>
                <ToggleButton value="jwk" sx={{ fontSize: '0.7rem', px: 1.5 }}>JWK</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TextField
              multiline
              minRows={4}
              maxRows={10}
              fullWidth
              size="small"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder={
                inputMode === 'pem'
                  ? '-----BEGIN PUBLIC KEY-----\n...'
                  : '{"kty":"RSA","n":"...","e":"AQAB"}'
              }
              inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' } }}
            />
          </>
        )}

        {algorithm && !isNone && (
          <Button
            variant="contained"
            size="small"
            startIcon={<VerifiedUserIcon />}
            onClick={handleVerify}
            disabled={loading || (!isHmac && !isAsymmetric)}
          >
            {loading ? 'Verifying…' : 'Verify Signature'}
          </Button>
        )}

        {isNone && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<VerifiedUserIcon />}
            onClick={handleVerify}
          >
            Check Structure
          </Button>
        )}

        {verificationError && (
          <Alert severity="error" sx={{ fontSize: '0.78rem' }}>
            {verificationError}
          </Alert>
        )}
      </Box>
    </SectionCard>
  )
}
