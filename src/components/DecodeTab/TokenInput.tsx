import { useRef } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { CopyButton } from '@/components/common/CopyButton'
import { useDecodeStore } from '@/stores/decodeStore'

interface TokenInputProps {
  onTokenChange: (token: string) => void
}

export function TokenInput({ onTokenChange }: TokenInputProps) {
  const { rawToken, setRawToken, reset } = useDecodeStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (value: string) => {
    setRawToken(value)
    onTokenChange(value)
  }

  const handleClear = () => {
    reset()
    onTokenChange('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const text = e.dataTransfer.getData('text')
    if (text) handleChange(text.trim())
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Encoded Token
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {rawToken && <CopyButton text={rawToken} />}
          {rawToken && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              sx={{ fontSize: '0.75rem', py: 0.25 }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      <TextField
        inputRef={textareaRef}
        multiline
        minRows={8}
        maxRows={20}
        fullWidth
        placeholder="Paste a JWT here… (or drag & drop)"
        value={rawToken}
        onChange={(e) => handleChange(e.target.value)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        inputProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '0.78rem',
            lineHeight: 1.8,
            wordBreak: 'break-all',
          },
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'off',
        }}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            alignItems: 'flex-start',
          },
        }}
      />
    </Box>
  )
}
