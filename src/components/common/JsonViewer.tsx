import { Box, useTheme } from '@mui/material'

interface JsonViewerProps {
  data: unknown
  maxHeight?: number | string
}

function colorizeJson(json: string, isDark: boolean): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Simple tokenizer for syntax highlighting
  const regex = /("(?:[^"\\]|\\.)*")\s*:/g  // keys
  const valueRegex = /:\s*("(?:[^"\\]|\\.)*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

  const colors = isDark
    ? { key: '#79b8ff', string: '#9ecbff', number: '#f8c555', bool: '#f97583', null: '#f97583', punct: '#8b949e' }
    : { key: '#0550ae', string: '#0a3069', number: '#953800', bool: '#cf222e', null: '#cf222e', punct: '#636c76' }

  const lines = json.split('\n')
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = []
    let remaining = line
    let key = 0

    // Try to find key: value patterns
    const keyMatch = /^(\s*)("(?:[^"\\]|\\.)*")(\s*:\s*)(.*)/.exec(remaining)
    if (keyMatch) {
      parts.push(<span key={key++}>{keyMatch[1]}</span>)
      parts.push(<span key={key++} style={{ color: colors.key }}>{keyMatch[2]}</span>)
      parts.push(<span key={key++} style={{ color: colors.punct }}>{keyMatch[3]}</span>)
      remaining = keyMatch[4]!
    }

    // Color value
    const strMatch = /^("(?:[^"\\]|\\.)*")(,?)(\s*)$/.exec(remaining)
    const numMatch = /^(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(,?)(\s*)$/.exec(remaining)
    const boolMatch = /^(true|false)(,?)(\s*)$/.exec(remaining)
    const nullMatch = /^(null)(,?)(\s*)$/.exec(remaining)

    if (strMatch) {
      parts.push(<span key={key++} style={{ color: colors.string }}>{strMatch[1]}</span>)
      parts.push(<span key={key++} style={{ color: colors.punct }}>{strMatch[2]}</span>)
    } else if (numMatch) {
      parts.push(<span key={key++} style={{ color: colors.number }}>{numMatch[1]}</span>)
      parts.push(<span key={key++} style={{ color: colors.punct }}>{numMatch[2]}</span>)
    } else if (boolMatch) {
      parts.push(<span key={key++} style={{ color: colors.bool }}>{boolMatch[1]}</span>)
      parts.push(<span key={key++} style={{ color: colors.punct }}>{boolMatch[2]}</span>)
    } else if (nullMatch) {
      parts.push(<span key={key++} style={{ color: colors.null }}>{nullMatch[1]}</span>)
      parts.push(<span key={key++} style={{ color: colors.punct }}>{nullMatch[2]}</span>)
    } else if (remaining) {
      parts.push(<span key={key++} style={{ color: colors.punct }}>{remaining}</span>)
    }

    return (
      <div key={i}>
        {parts.length > 0 ? parts : <span>{line}</span>}
      </div>
    )
  })
}

export function JsonViewer({ data, maxHeight = 400 }: JsonViewerProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const json = JSON.stringify(data, null, 2)

  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 2,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.8rem',
        lineHeight: 1.6,
        overflowY: 'auto',
        overflowX: 'auto',
        maxHeight,
        whiteSpace: 'pre',
        bgcolor: 'transparent',
      }}
    >
      {colorizeJson(json, isDark)}
    </Box>
  )
}
