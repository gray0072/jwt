import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import HistoryIcon from '@mui/icons-material/History'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import BuildIcon from '@mui/icons-material/Build'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { useAppStore, type AppTab, type ThemeMode } from '@/stores/appStore'
import { JWT_COLORS } from '@/theme/tokens'

const TABS: { id: AppTab; label: string; icon: React.ReactElement }[] = [
  { id: 'decode', label: 'Decode / Verify', icon: <LockOpenIcon fontSize="small" /> },
  { id: 'generate', label: 'Generate', icon: <BuildIcon fontSize="small" /> },
  { id: 'keygen', label: 'Key Generator', icon: <VpnKeyIcon fontSize="small" /> },
]

const THEME_CYCLE: ThemeMode[] = ['system', 'dark', 'light']

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === 'dark') return <DarkModeIcon fontSize="small" />
  if (mode === 'light') return <LightModeIcon fontSize="small" />
  return <SettingsBrightnessIcon fontSize="small" />
}

export function AppHeader() {
  const { activeTab, setActiveTab, theme, setTheme, toggleHistoryDrawer } = useAppStore()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

  const handleThemeToggle = () => {
    const idx = THEME_CYCLE.indexOf(theme)
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]!)
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 52, sm: 56 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: JWT_COLORS.header }}>J</span>
            <span style={{ color: JWT_COLORS.payload }}>W</span>
            <span style={{ color: JWT_COLORS.signature }}>T</span>
          </Typography>
          {!isMobile && (
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ color: 'text.primary', letterSpacing: '-0.01em' }}
            >
              Lab
            </Typography>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v: AppTab) => setActiveTab(v)}
          sx={{
            flex: 1,
            minHeight: 0,
            '& .MuiTabs-indicator': { height: 2 },
            '& .MuiTab-root': {
              minHeight: 52,
              py: 0,
              minWidth: isMobile ? 'auto' : 120,
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={isMobile ? undefined : tab.label}
              icon={isMobile ? tab.icon : undefined}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <Tooltip title={`Theme: ${theme}`}>
            <IconButton size="small" onClick={handleThemeToggle} color="inherit">
              <ThemeIcon mode={theme} />
            </IconButton>
          </Tooltip>
          <Tooltip title="History">
            <IconButton size="small" onClick={toggleHistoryDrawer} color="inherit">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
