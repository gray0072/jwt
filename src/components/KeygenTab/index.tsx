import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography, Alert, ToggleButtonGroup, ToggleButton, TextField, Divider } from '@mui/material'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { useKeygenStore, type KeyType, type RsaSize, type EcCurve, type KeyFormat } from '@/stores/keygenStore'
import { generateRsaKeyPair, generateEcKeyPair, generateEdKeyPair } from '@/lib/crypto'
import { CopyButton } from '@/components/common/CopyButton'
import { SectionCard } from '@/components/common/SectionCard'

function KeyOutput({
  label,
  pem,
  jwk,
  format,
  onFormatChange,
}: {
  label: string
  pem: string
  jwk: object
  format: KeyFormat
  onFormatChange: (f: KeyFormat) => void
}) {
  const displayValue = format === 'pem' ? pem : JSON.stringify(jwk, null, 2)
  const color = label === 'Private Key' ? '#f97583' : '#79b8ff'

  return (
    <SectionCard
      noPadding
      title={
        <Typography variant="subtitle2" fontWeight={600} sx={{ color }}>
          {label}
        </Typography>
      }
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={format}
            onChange={(_, v: KeyFormat) => { if (v) onFormatChange(v) }}
            sx={{ height: 24 }}
          >
            <ToggleButton value="pem" sx={{ fontSize: '0.68rem', px: 1 }}>PEM</ToggleButton>
            <ToggleButton value="jwk" sx={{ fontSize: '0.68rem', px: 1 }}>JWK</ToggleButton>
          </ToggleButtonGroup>
          <CopyButton text={displayValue} />
        </Box>
      }
    >
      <TextField
        multiline
        fullWidth
        value={displayValue}
        InputProps={{ readOnly: true }}
        inputProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '0.72rem',
            lineHeight: 1.6,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiInputBase-root': { p: 0 },
          '& .MuiInputBase-input': { p: 2 },
        }}
      />
    </SectionCard>
  )
}

export function KeygenTab() {
  const {
    keyType,
    rsaSize,
    ecCurve,
    keyPair,
    generating,
    error,
    privateKeyFormat,
    publicKeyFormat,
    setKeyType,
    setRsaSize,
    setEcCurve,
    setGenerating,
    setKeyPair,
    setError,
    setPrivateKeyFormat,
    setPublicKeyFormat,
  } = useKeygenStore()

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    setKeyPair(null)
    try {
      let kp
      if (keyType === 'RSA') {
        kp = await generateRsaKeyPair(rsaSize)
      } else if (keyType === 'EC') {
        kp = await generateEcKeyPair(ecCurve)
      } else {
        kp = await generateEdKeyPair()
      }
      setKeyPair(kp)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 860, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Config */}
        <SectionCard title="Key Configuration">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Key Type</InputLabel>
              <Select
                value={keyType}
                label="Key Type"
                onChange={(e) => setKeyType(e.target.value as KeyType)}
              >
                <MenuItem value="RSA">RSA</MenuItem>
                <MenuItem value="EC">EC (ECDSA)</MenuItem>
                <MenuItem value="OKP">EdDSA (Ed25519)</MenuItem>
              </Select>
            </FormControl>

            {keyType === 'RSA' && (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Key Size</InputLabel>
                <Select
                  value={rsaSize}
                  label="Key Size"
                  onChange={(e) => setRsaSize(Number(e.target.value) as RsaSize)}
                >
                  <MenuItem value={2048}>2048 bits</MenuItem>
                  <MenuItem value={3072}>3072 bits</MenuItem>
                  <MenuItem value={4096}>4096 bits</MenuItem>
                </Select>
              </FormControl>
            )}

            {keyType === 'EC' && (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Curve</InputLabel>
                <Select
                  value={ecCurve}
                  label="Curve"
                  onChange={(e) => setEcCurve(e.target.value as EcCurve)}
                >
                  <MenuItem value="P-256">P-256</MenuItem>
                  <MenuItem value="P-384">P-384</MenuItem>
                  <MenuItem value="P-521">P-521</MenuItem>
                </Select>
              </FormControl>
            )}

            {keyType === 'OKP' && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                Curve: Ed25519 (fixed)
              </Typography>
            )}

            <Button
              variant="contained"
              startIcon={<VpnKeyIcon />}
              onClick={handleGenerate}
              disabled={generating}
              sx={{ height: 40 }}
            >
              {generating ? 'Generating…' : 'Generate Key Pair'}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mt: 2, fontSize: '0.78rem' }}>
            Keys are generated entirely in your browser using the Web Crypto API and are never transmitted.
          </Alert>
        </SectionCard>

        {error && <Alert severity="error">{error}</Alert>}

        {keyPair && (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <KeyOutput
                label="Private Key"
                pem={keyPair.privateKeyPem}
                jwk={keyPair.privateKeyJwk}
                format={privateKeyFormat}
                onFormatChange={setPrivateKeyFormat}
              />
              <KeyOutput
                label="Public Key"
                pem={keyPair.publicKeyPem}
                jwk={keyPair.publicKeyJwk}
                format={publicKeyFormat}
                onFormatChange={setPublicKeyFormat}
              />
            </Box>

            <Alert severity="warning" sx={{ fontSize: '0.78rem' }}>
              <strong>Keep the private key secret.</strong> Store it securely and never share it.
            </Alert>
          </>
        )}

        {!keyPair && !error && !generating && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.disabled">
              Click "Generate Key Pair" to create a new asymmetric key pair.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
