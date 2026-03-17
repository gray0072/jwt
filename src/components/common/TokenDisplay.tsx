import { Box, Typography } from '@mui/material'
import { JWT_COLORS } from '@/theme/tokens'

interface TokenDisplayProps {
  token: string
  wrap?: boolean
}

export function TokenDisplay({ token, wrap = true }: TokenDisplayProps) {
  if (!token) return null

  const parts = token.split('.')
  const colors = [JWT_COLORS.header, JWT_COLORS.payload, JWT_COLORS.signature]

  return (
    <Box
      component="code"
      sx={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.78rem',
        lineHeight: 1.8,
        wordBreak: wrap ? 'break-all' : 'normal',
        whiteSpace: wrap ? 'normal' : 'nowrap',
        display: 'block',
      }}
    >
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && (
            <Typography
              component="span"
              sx={{
                color: JWT_COLORS.dot,
                fontFamily: 'inherit',
                fontSize: 'inherit',
              }}
            >
              .
            </Typography>
          )}
          <Typography
            component="span"
            sx={{
              color: colors[i] ?? JWT_COLORS.signature,
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {part}
          </Typography>
        </span>
      ))}
    </Box>
  )
}
