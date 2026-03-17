import { useMemo, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Box, Fade, useMediaQuery } from '@mui/material'
import { buildTheme } from '@/theme/theme'
import { AppHeader } from '@/components/Layout/AppHeader'
import { HistoryDrawer } from '@/components/Layout/HistoryDrawer'
import { DecodeTab } from '@/components/DecodeTab'
import { GenerateTab } from '@/components/GenerateTab'
import { KeygenTab } from '@/components/KeygenTab'
import { useAppStore } from '@/stores/appStore'
import type { PaletteMode } from '@mui/material'

export default function App() {
  const { theme: themeMode, activeTab } = useAppStore()
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const resolvedMode: PaletteMode = useMemo(() => {
    if (themeMode === 'system') return prefersDark ? 'dark' : 'light'
    return themeMode
  }, [themeMode, prefersDark])

  const muiTheme = useMemo(() => buildTheme(resolvedMode), [resolvedMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        useAppStore.getState().toggleHistoryDrawer()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <AppHeader />

        <Box sx={{ flex: 1, maxWidth: 1280, width: '100%', mx: 'auto' }}>
          <Fade in={activeTab === 'decode'} unmountOnExit mountOnEnter timeout={200}>
            <Box sx={{ display: activeTab === 'decode' ? 'block' : 'none' }}>
              <DecodeTab />
            </Box>
          </Fade>
          <Fade in={activeTab === 'generate'} unmountOnExit mountOnEnter timeout={200}>
            <Box sx={{ display: activeTab === 'generate' ? 'block' : 'none' }}>
              <GenerateTab />
            </Box>
          </Fade>
          <Fade in={activeTab === 'keygen'} unmountOnExit mountOnEnter timeout={200}>
            <Box sx={{ display: activeTab === 'keygen' ? 'block' : 'none' }}>
              <KeygenTab />
            </Box>
          </Fade>
        </Box>

        <HistoryDrawer />
      </Box>
    </ThemeProvider>
  )
}
