import { Chip, type ChipProps } from '@mui/material'
import { ALGORITHM_COLORS } from '@/theme/tokens'

interface AlgorithmBadgeProps extends Omit<ChipProps, 'label'> {
  algorithm: string
}

export function AlgorithmBadge({ algorithm, size = 'small', ...rest }: AlgorithmBadgeProps) {
  const color = ALGORITHM_COLORS[algorithm] ?? '#8b949e'

  return (
    <Chip
      label={algorithm}
      size={size}
      sx={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: '0.7rem',
        bgcolor: `${color}22`,
        color: color,
        border: `1px solid ${color}44`,
        height: 20,
        '& .MuiChip-label': { px: 1 },
        ...rest.sx,
      }}
      {...rest}
    />
  )
}
