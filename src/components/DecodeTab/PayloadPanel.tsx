import { Box, Typography, Chip, Divider } from '@mui/material'
import type { JWTPayload } from 'jose'
import { SectionCard } from '@/components/common/SectionCard'
import { JsonViewer } from '@/components/common/JsonViewer'
import { CopyButton } from '@/components/common/CopyButton'
import { formatRelative, formatDate } from '@/lib/claims'

const STANDARD_CLAIMS = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti']

interface PayloadPanelProps {
  payload: (JWTPayload & Record<string, unknown>) | null
}

function ClaimRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, py: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          color: '#79b8ff',
          flexShrink: 0,
          width: 40,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-word', flex: 1 }}>
        {value}
      </Typography>
    </Box>
  )
}

function TimestampValue({ unix, label }: { unix: number; label: string }) {
  const now = Math.floor(Date.now() / 1000)
  const isExpired = label === 'exp' && unix < now
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="body2">{formatDate(unix)}</Typography>
      <Chip
        label={formatRelative(unix)}
        size="small"
        color={isExpired ? 'error' : 'default'}
        variant="outlined"
        sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
      />
    </Box>
  )
}

export function PayloadPanel({ payload }: PayloadPanelProps) {
  if (!payload) {
    return (
      <SectionCard noPadding title={<Typography variant="subtitle2" fontWeight={600} sx={{ color: '#79b8ff' }}>Payload</Typography>}>
        <Typography variant="body2" color="text.disabled" sx={{ p: 2 }}>—</Typography>
      </SectionCard>
    )
  }

  const now = Math.floor(Date.now() / 1000)
  const isExpired = typeof payload.exp === 'number' && payload.exp < now
  const customClaims = Object.entries(payload).filter(([k]) => !STANDARD_CLAIMS.includes(k))

  return (
    <SectionCard
      noPadding
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#79b8ff' }}>
            Payload
          </Typography>
          {isExpired && (
            <Chip
              label="EXPIRED"
              size="small"
              color="warning"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, '& .MuiChip-label': { px: 0.75 } }}
            />
          )}
        </Box>
      }
      action={<CopyButton text={JSON.stringify(payload, null, 2)} tooltipPlacement="left" />}
    >
      {/* Standard claims */}
      <Box sx={{ p: 2, pb: customClaims.length > 0 ? 1 : 2 }}>
        {payload.iss && <ClaimRow label="iss" value={String(payload.iss)} />}
        {payload.sub && <ClaimRow label="sub" value={String(payload.sub)} />}
        {payload.aud && (
          <ClaimRow
            label="aud"
            value={Array.isArray(payload.aud) ? payload.aud.join(', ') : String(payload.aud)}
          />
        )}
        {typeof payload.iat === 'number' && (
          <ClaimRow label="iat" value={<TimestampValue unix={payload.iat} label="iat" />} />
        )}
        {typeof payload.exp === 'number' && (
          <ClaimRow label="exp" value={<TimestampValue unix={payload.exp} label="exp" />} />
        )}
        {typeof payload.nbf === 'number' && (
          <ClaimRow label="nbf" value={<TimestampValue unix={payload.nbf} label="nbf" />} />
        )}
        {payload.jti && <ClaimRow label="jti" value={String(payload.jti)} />}
      </Box>

      {/* Custom claims */}
      {customClaims.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2, pt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Custom claims
            </Typography>
            <JsonViewer
              data={Object.fromEntries(customClaims)}
              maxHeight={200}
            />
          </Box>
        </>
      )}
    </SectionCard>
  )
}
