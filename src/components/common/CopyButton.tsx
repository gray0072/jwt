import { useState } from 'react'
import { IconButton, Tooltip, type IconButtonProps } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface CopyButtonProps extends Omit<IconButtonProps, 'onClick'> {
  text: string
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
}

export function CopyButton({ text, tooltipPlacement = 'top', size = 'small', ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback
    }
  }

  return (
    <Tooltip
      title={copied ? '✓ Copied!' : 'Copy'}
      placement={tooltipPlacement}
    >
      <IconButton onClick={handleCopy} size={size} {...rest}>
        {copied ? (
          <CheckIcon fontSize="inherit" sx={{ color: 'success.main' }} />
        ) : (
          <ContentCopyIcon fontSize="inherit" />
        )}
      </IconButton>
    </Tooltip>
  )
}
