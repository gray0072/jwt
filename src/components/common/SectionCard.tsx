import { Paper, Box, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'

interface SectionCardProps {
  title: ReactNode
  action?: ReactNode
  children: ReactNode
  sx?: SxProps<Theme>
  noPadding?: boolean
}

export function SectionCard({ title, action, children, sx, noPadding }: SectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
          minHeight: 40,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title}
        </Typography>
        {action && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{action}</Box>}
      </Box>
      <Box sx={noPadding ? {} : { p: 2 }}>{children}</Box>
    </Paper>
  )
}
