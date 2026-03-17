import { Chip, type ChipProps } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import type { VerificationStatus } from '@/stores/decodeStore'

interface StatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: VerificationStatus
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; color: ChipProps['color']; icon: React.ReactElement }
> = {
  idle: {
    label: 'Not Verified',
    color: 'default',
    icon: <HelpOutlineIcon />,
  },
  valid: {
    label: 'Valid',
    color: 'success',
    icon: <CheckCircleOutlineIcon />,
  },
  invalid: {
    label: 'Invalid',
    color: 'error',
    icon: <CancelOutlinedIcon />,
  },
  error: {
    label: 'Error',
    color: 'warning',
    icon: <ErrorOutlineIcon />,
  },
}

export function StatusChip({ status, size = 'small', ...rest }: StatusChipProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600, ...rest.sx }}
      {...rest}
    />
  )
}
