import { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Button,
  Divider,
  Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { useAppStore } from '@/stores/appStore'
import { useDecodeStore } from '@/stores/decodeStore'
import { getHistory, clearHistory, removeFromHistory, type HistoryEntry } from '@/lib/history'
import { AlgorithmBadge } from '@/components/common/AlgorithmBadge'
import { formatRelative } from '@/lib/claims'

export function HistoryDrawer() {
  const { historyDrawerOpen, setHistoryDrawerOpen, setActiveTab } = useAppStore()
  const { setRawToken } = useDecodeStore()
  const [entries, setEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    if (historyDrawerOpen) {
      setEntries(getHistory())
    }
  }, [historyDrawerOpen])

  const handleLoad = (entry: HistoryEntry) => {
    setRawToken(entry.token)
    setActiveTab('decode')
    setHistoryDrawerOpen(false)
  }

  const handleRemove = (id: string) => {
    removeFromHistory(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const handleClearAll = () => {
    clearHistory()
    setEntries([])
  }

  return (
    <Drawer
      anchor="right"
      open={historyDrawerOpen}
      onClose={() => setHistoryDrawerOpen(false)}
      PaperProps={{ sx: { width: 340, bgcolor: 'background.default' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
          Token History
        </Typography>
        <Tooltip title="Clear all">
          <span>
            <IconButton
              size="small"
              onClick={handleClearAll}
              disabled={entries.length === 0}
              color="error"
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <IconButton size="small" onClick={() => setHistoryDrawerOpen(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />

      {entries.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No tokens yet. Decoded or generated tokens will appear here.
          </Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {entries.map((entry) => (
            <Box key={entry.id}>
              <ListItemButton onClick={() => handleLoad(entry)} sx={{ pr: 6, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <AlgorithmBadge algorithm={entry.algorithm} />
                      <Chip
                        label={entry.mode}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box component="span">
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          fontFamily: "'JetBrains Mono', monospace",
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'text.secondary',
                        }}
                      >
                        {entry.sub || entry.firstCustomKey || '—'}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.disabled">
                        {formatRelative(Math.floor(entry.timestamp / 1000))}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleRemove(entry.id) }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItemButton>
              <Divider component="li" />
            </Box>
          ))}
        </List>
      )}

      {entries.length > 0 && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearAll}
          >
            Clear All ({entries.length})
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
