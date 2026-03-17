import { createTheme, type PaletteMode } from '@mui/material'

export function buildTheme(mode: PaletteMode) {
  const dark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      background: {
        default: dark ? '#0d1117' : '#ffffff',
        paper: dark ? '#161b22' : '#f6f8fa',
      },
      primary: {
        main: dark ? '#58a6ff' : '#0969da',
      },
      secondary: {
        main: dark ? '#f78166' : '#cf222e',
      },
      success: {
        main: dark ? '#3fb950' : '#1a7f37',
      },
      error: {
        main: dark ? '#f85149' : '#cf222e',
      },
      warning: {
        main: dark ? '#d29922' : '#9a6700',
      },
      divider: dark ? '#30363d' : '#d0d7de',
      text: {
        primary: dark ? '#e6edf3' : '#1f2328',
        secondary: dark ? '#8b949e' : '#636c76',
      },
    },
    typography: {
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      fontSize: 14,
    },
    shape: {
      borderRadius: 6,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': { boxSizing: 'border-box' },
          body: { margin: 0 },
          '::-webkit-scrollbar': { width: '6px', height: '6px' },
          '::-webkit-scrollbar-track': { background: 'transparent' },
          '::-webkit-scrollbar-thumb': {
            background: dark ? '#30363d' : '#d0d7de',
            borderRadius: '3px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${dark ? '#30363d' : '#d0d7de'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 500 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 500 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: dark ? '#30363d' : '#d0d7de',
            },
          },
          input: {
            '&::placeholder': { opacity: 0.5 },
          },
        },
      },
    },
  })
}
