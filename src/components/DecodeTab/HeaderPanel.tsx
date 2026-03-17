import { Box, Typography } from '@mui/material'
import { SectionCard } from '@/components/common/SectionCard'
import { JsonViewer } from '@/components/common/JsonViewer'
import { CopyButton } from '@/components/common/CopyButton'
import { AlgorithmBadge } from '@/components/common/AlgorithmBadge'

interface HeaderPanelProps {
  header: Record<string, unknown> | null
}

export function HeaderPanel({ header }: HeaderPanelProps) {
  const alg = header?.alg as string | undefined
  const typ = header?.typ as string | undefined

  return (
    <SectionCard
      noPadding
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#f97583' }}>
            Header
          </Typography>
          {alg && <AlgorithmBadge algorithm={alg} />}
          {typ && (
            <Typography variant="caption" color="text.secondary">
              {typ}
            </Typography>
          )}
        </Box>
      }
      action={
        header ? (
          <CopyButton text={JSON.stringify(header, null, 2)} tooltipPlacement="left" />
        ) : null
      }
    >
      {header ? (
        <JsonViewer data={header} maxHeight={200} />
      ) : (
        <Typography variant="body2" color="text.disabled" sx={{ p: 2 }}>
          —
        </Typography>
      )}
    </SectionCard>
  )
}
