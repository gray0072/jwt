import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Button,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { useGenerateStore, type AlgorithmId } from '@/stores/generateStore'
import { getAlgorithmFamily } from '@/lib/jwt'
import { generateRandomSecret } from '@/lib/crypto'
import { useAppStore } from '@/stores/appStore'

const ALGORITHM_GROUPS: { label: string; options: AlgorithmId[] }[] = [
  { label: 'HMAC', options: ['HS256', 'HS384', 'HS512'] },
  { label: 'RSA', options: ['RS256', 'RS384', 'RS512'] },
  { label: 'RSA-PSS', options: ['PS256', 'PS384', 'PS512'] },
  { label: 'ECDSA', options: ['ES256', 'ES384', 'ES512'] },
  { label: 'EdDSA', options: ['EdDSA'] },
  { label: 'None', options: ['none'] },
]

export function AlgorithmPicker() {
  const {
    algorithm,
    secret,
    secretVisible,
    secretBase64,
    privateKey,
    setAlgorithm,
    setSecret,
    setSecretVisible,
    setSecretBase64,
    setPrivateKey,
  } = useGenerateStore()
  const { setActiveTab } = useAppStore()

  const family = getAlgorithmFamily(algorithm)
  const isHmac = family === 'HMAC'
  const isAsymmetric = ['RSA', 'RSA-PSS', 'EC', 'EdDSA'].includes(family)

  const handleRandomSecret = () => {
    setSecret(generateRandomSecret(32))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl size="small" fullWidth>
        <InputLabel>Algorithm</InputLabel>
        <Select
          value={algorithm}
          label="Algorithm"
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmId)}
        >
          {ALGORITHM_GROUPS.map((group) => [
            <MenuItem key={`header-${group.label}`} disabled sx={{ fontSize: '0.72rem', py: 0.25, opacity: 0.6 }}>
              {group.label}
            </MenuItem>,
            ...group.options.map((alg) => (
              <MenuItem key={alg} value={alg} sx={{ pl: 3 }}>
                {alg}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>

      {isHmac && (
        <>
          <TextField
            label="Secret"
            size="small"
            fullWidth
            type={secretVisible ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' } }}
            InputProps={{
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  <Tooltip title="Toggle visibility">
                    <IconButton size="small" onClick={() => setSecretVisible(!secretVisible)}>
                      {secretVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate random secret">
                    <IconButton size="small" onClick={handleRandomSecret}>
                      <ShuffleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={secretBase64}
                onChange={(e) => setSecretBase64(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Secret is Base64URL encoded</Typography>}
          />
        </>
      )}

      {isAsymmetric && (
        <>
          <TextField
            label="Private Key (PEM)"
            size="small"
            fullWidth
            multiline
            minRows={5}
            maxRows={12}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="-----BEGIN PRIVATE KEY-----&#10;..."
            inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' } }}
          />
          <Button
            size="small"
            variant="text"
            onClick={() => setActiveTab('keygen')}
            sx={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
          >
            → Go to Key Generator
          </Button>
        </>
      )}

      {algorithm === 'none' && (
        <Typography variant="caption" color="warning.main">
          Warning: "none" algorithm produces unsigned tokens. Not safe for production.
        </Typography>
      )}
    </Box>
  )
}
