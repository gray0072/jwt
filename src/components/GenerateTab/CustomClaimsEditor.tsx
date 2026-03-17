import { Box, TextField, Select, MenuItem, IconButton, Button, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { v4 as uuidv4 } from 'uuid'
import { useGenerateStore, type CustomClaim } from '@/stores/generateStore'

const VALUE_TYPES: CustomClaim['type'][] = ['string', 'number', 'boolean', 'json']

export function CustomClaimsEditor() {
  const { customClaims, setCustomClaims } = useGenerateStore()

  const addClaim = () => {
    setCustomClaims([
      ...customClaims,
      { id: uuidv4(), key: '', value: '', type: 'string' },
    ])
  }

  const updateClaim = (id: string, patch: Partial<CustomClaim>) => {
    setCustomClaims(customClaims.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const removeClaim = (id: string) => {
    setCustomClaims(customClaims.filter((c) => c.id !== id))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {customClaims.length === 0 && (
        <Typography variant="caption" color="text.disabled">
          No custom claims yet.
        </Typography>
      )}

      {customClaims.map((claim) => (
        <Box key={claim.id} sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
          <TextField
            size="small"
            placeholder="key"
            value={claim.key}
            onChange={(e) => updateClaim(claim.id, { key: e.target.value })}
            sx={{ width: 120, flexShrink: 0 }}
            inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' } }}
          />

          {claim.type === 'boolean' ? (
            <Select
              size="small"
              value={claim.value || 'true'}
              onChange={(e) => updateClaim(claim.id, { value: e.target.value as string })}
              sx={{ flex: 1, fontSize: '0.8rem' }}
            >
              <MenuItem value="true">true</MenuItem>
              <MenuItem value="false">false</MenuItem>
            </Select>
          ) : (
            <TextField
              size="small"
              placeholder="value"
              value={claim.value}
              onChange={(e) => updateClaim(claim.id, { value: e.target.value })}
              sx={{ flex: 1 }}
              multiline={claim.type === 'json'}
              minRows={claim.type === 'json' ? 2 : 1}
              inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' } }}
            />
          )}

          <Select
            size="small"
            value={claim.type}
            onChange={(e) => updateClaim(claim.id, { type: e.target.value as CustomClaim['type'] })}
            sx={{ width: 90, fontSize: '0.78rem', flexShrink: 0 }}
          >
            {VALUE_TYPES.map((t) => (
              <MenuItem key={t} value={t} sx={{ fontSize: '0.78rem' }}>
                {t}
              </MenuItem>
            ))}
          </Select>

          <IconButton size="small" onClick={() => removeClaim(claim.id)} color="error" sx={{ mt: 0.25 }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={addClaim}
        sx={{ alignSelf: 'flex-start', fontSize: '0.78rem' }}
      >
        Add Claim
      </Button>
    </Box>
  )
}
