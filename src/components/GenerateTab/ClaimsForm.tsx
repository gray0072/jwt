import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  InputAdornment,
  Tooltip,
} from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { useGenerateStore } from '@/stores/generateStore'
import { generateJTI, DURATION_PRESETS } from '@/lib/claims'

export function ClaimsForm() {
  const { claims, setClaims } = useGenerateStore()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <TextField
        label="iss (Issuer)"
        size="small"
        fullWidth
        value={claims.iss}
        onChange={(e) => setClaims({ iss: e.target.value })}
        placeholder="https://auth.example.com"
      />
      <TextField
        label="sub (Subject)"
        size="small"
        fullWidth
        value={claims.sub}
        onChange={(e) => setClaims({ sub: e.target.value })}
        placeholder="user123"
      />
      <TextField
        label="aud (Audience)"
        size="small"
        fullWidth
        value={claims.aud}
        onChange={(e) => setClaims({ aud: e.target.value })}
        placeholder="api.example.com (comma-separated for multiple)"
      />

      {/* exp */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          label="exp (Expires In)"
          size="small"
          sx={{ flex: 1 }}
          value={claims.exp}
          onChange={(e) => setClaims({ exp: e.target.value })}
          placeholder="1h, 7d, 3600…"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  s/m/h/d/w
                </Typography>
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel>Preset</InputLabel>
          <Select
            label="Preset"
            value=""
            onChange={(e) => setClaims({ exp: e.target.value as string })}
            displayEmpty
          >
            <MenuItem value="">—</MenuItem>
            {DURATION_PRESETS.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* nbf */}
      <TextField
        label="nbf (Not Before)"
        size="small"
        fullWidth
        type="datetime-local"
        value={claims.nbf}
        onChange={(e) => setClaims({ nbf: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{ style: { fontSize: '0.8rem' } }}
      />

      {/* iat */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={claims.iatAuto}
            onChange={(e) => setClaims({ iatAuto: e.target.checked })}
          />
        }
        label={<Typography variant="caption">iat — auto (current time)</Typography>}
      />

      {/* jti */}
      <TextField
        label="jti (JWT ID)"
        size="small"
        fullWidth
        value={claims.jti}
        onChange={(e) => setClaims({ jti: e.target.value })}
        placeholder="Leave empty to skip"
        InputProps={{
          endAdornment: (
            <Tooltip title="Generate UUID">
              <Button
                size="small"
                sx={{ minWidth: 'auto', p: 0.5 }}
                onClick={() => setClaims({ jti: generateJTI() })}
              >
                <AutorenewIcon fontSize="small" />
              </Button>
            </Tooltip>
          ),
        }}
      />
    </Box>
  )
}
