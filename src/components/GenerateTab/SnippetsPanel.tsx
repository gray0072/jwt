import { Box, Tabs, Tab, TextField, Select, MenuItem, FormControl, Typography, Paper } from '@mui/material'
import { useGenerateStore, type HttpMethod } from '@/stores/generateStore'
import { buildSnippet, SNIPPET_TABS } from '@/lib/snippets'
import { CopyButton } from '@/components/common/CopyButton'

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

interface SnippetsPanelProps {
  token: string
}

export function SnippetsPanel({ token }: SnippetsPanelProps) {
  const {
    snippetsUrl,
    snippetsMethod,
    snippetsBody,
    activeSnippetTab,
    setSnippetsUrl,
    setSnippetsMethod,
    setSnippetsBody,
    setActiveSnippetTab,
  } = useGenerateStore()

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(snippetsMethod)

  if (!token) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.disabled">
          Generate a token to see code snippets.
        </Typography>
      </Box>
    )
  }

  const snippet = buildSnippet(activeSnippetTab, {
    token,
    url: snippetsUrl,
    method: snippetsMethod,
    body: snippetsBody,
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* URL + Method */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ width: 110, flexShrink: 0 }}>
          <Select
            value={snippetsMethod}
            onChange={(e) => setSnippetsMethod(e.target.value as HttpMethod)}
            sx={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.8rem' }}
          >
            {HTTP_METHODS.map((m) => (
              <MenuItem key={m} value={m} sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          fullWidth
          value={snippetsUrl}
          onChange={(e) => setSnippetsUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' } }}
        />
      </Box>

      {/* Body */}
      {hasBody && (
        <TextField
          label="Request Body (JSON)"
          size="small"
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          value={snippetsBody}
          onChange={(e) => setSnippetsBody(e.target.value)}
          inputProps={{ style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' } }}
        />
      )}

      {/* Language tabs */}
      <Tabs
        value={activeSnippetTab}
        onChange={(_, v) => setActiveSnippetTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 32,
          '& .MuiTab-root': { minHeight: 32, fontSize: '0.75rem', py: 0, px: 1.5 },
          '& .MuiTabs-indicator': { height: 2 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {SNIPPET_TABS.map((tab) => (
          <Tab key={tab.id} value={tab.id} label={tab.label} />
        ))}
      </Tabs>

      {/* Code block */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          bgcolor: 'action.hover',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1 }}>
          <CopyButton text={snippet} size="small" />
        </Box>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            pr: 5,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '0.76rem',
            lineHeight: 1.65,
            overflowX: 'auto',
            whiteSpace: 'pre',
            maxHeight: 320,
            overflowY: 'auto',
            color: 'text.primary',
          }}
        >
          {snippet}
        </Box>
      </Paper>
    </Box>
  )
}
