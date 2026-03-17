# JWT Lab — Task Description & UI Specification

## Project Goal

Build a single-page developer tool called **JWT Lab** for generating, decoding, and verifying JWTs.
Stack: React 18 + TypeScript + MUI v6 + Zustand + jose + Vite.
Deploy target: GitHub Pages.

---

## Functional Requirements

### 1. Modes (tabs at the top level)

| Tab | Purpose |
|-----|---------|
| **Decode / Verify** | Paste a token → see header, payload, signature status |
| **Generate** | Build a token from scratch by filling in claims + choosing algorithm |
| **Key Generator** | Generate RSA / EC / OKP key pairs in PEM or JWK |

---

### 2. Decode / Verify Tab

**Layout: two columns (left | right)**

**Left column — Token Input**
- Large `<textarea>` / `<MonacoEditor>` (monospace, syntax-highlighted in JWT color scheme: header=pink, payload=blue, signature=orange, dots=gray)
- Paste area with drag-and-drop support
- Button: `Clear`
- Button: `Copy`
- Token is parsed on every keystroke (debounced 150ms)

**Right column — Decoded Output (three expandable sections)**

1. **Header** — JSON viewer (read-only, pretty-printed, with copy button)
   - Show algorithm badge (e.g. `HS256`) and token type (`JWT`)

2. **Payload** — JSON viewer
   - Standard claims rendered with icons and human-readable values:
     - `exp` → expiry countdown / "expired X ago"
     - `iat` → "issued X ago"
     - `nbf` → "not valid before X"
   - Custom claims shown as raw JSON below standard ones

3. **Signature** — Verification panel
   - Algorithm auto-detected from header
   - Input field for secret (HMAC) or public key (PEM / JWK) with a toggle for base64url-encoded secrets
   - Status chip: `✓ Valid` (green) / `✗ Invalid` (red) / `⚠ Not Verified` (gray)
   - For RS/EC/EdDSA: textarea for public key (PEM), with a "Paste JWK" toggle
   - Error message shown below if verification fails with reason

---

### 3. Generate Tab

**Layout: two columns (left: form | right: live token output)**

**Left column — Token Builder**

Section A: **Algorithm & Secret / Key**
- Dropdown: algorithm family (HMAC / RSA / EC / EdDSA / none)
- Sub-dropdown: specific algorithm (e.g. HS256, HS384, HS512)
- For HMAC:
  - Text input: secret (with eye toggle to show/hide, and "Generate random" button)
  - Checkbox: "Secret is base64url encoded"
- For RSA / EC / EdDSA:
  - Textarea: private key (PEM or JWK)
  - Link: "Go to Key Generator →"

Section B: **Standard Claims**
- `iss` — text input
- `sub` — text input
- `aud` — text input (comma-separated → array)
- `exp` — duration picker ("1h", "24h", "7d", or custom datetime) with "None" option
- `nbf` — datetime picker with "Now" shortcut
- `iat` — auto (now) with override toggle
- `jti` — text input with "Generate UUID" button

Section C: **Custom Claims**
- Key-value editor: rows of (key input | value input | type selector [string / number / boolean / JSON] | delete button)
- Button: `Add Claim`

Section D: **Actions**
- Button: `Generate Token` (primary)
- Button: `Reset`

**Right column — Live Output**
- Same color-coded JWT display as Decode tab
- Sections collapsed by default, expandable inline
- Copy button (full token)
- Button: `Send to Decode tab` (loads this token into Decode/Verify)
- Token auto-regenerates when form changes (debounced 300ms), or on explicit Generate click

**Code Snippets panel** (below the token output)
- MUI `Tabs` row with language/tool options:

| Tab | Description |
|-----|-------------|
| `cURL` | Authorization header in a shell curl command |
| `Fetch` | Browser `fetch()` with Authorization header |
| `Axios` | axios request with `Authorization: Bearer` |
| `Node.js` | Native `https` module request |
| `Python` | `requests` library |
| `Go` | `net/http` with header set |
| `HTTPie` | `http` CLI tool command |

- Each snippet is a syntax-highlighted code block (use MUI `Box` with monospace font + custom token coloring, or a lightweight highlighter like `highlight.js`)
- The JWT token in each snippet is truncated visually (`eyJ...abc`) but copied in full
- Copy button per snippet (top-right corner of code block)
- Snippet has a configurable **URL input** (text field above the tabs, default `https://api.example.com/endpoint`) — changing it live-updates all snippets
- Snippet has a configurable **HTTP method** selector (`GET` / `POST` / `PUT` / `PATCH` / `DELETE`), default `GET`
- For `POST`/`PUT`/`PATCH`: a **Body** textarea appears (JSON, default `{}`) that gets included in the snippet
- Snippets are only shown when a valid token exists; otherwise a muted placeholder "Generate a token to see code snippets"

**Example snippets** (token = `<JWT>`, url = `https://api.example.com/endpoint`):

```bash
# cURL
curl -X GET https://api.example.com/endpoint \
  -H "Authorization: Bearer <JWT>"
```

```js
// Fetch
const response = await fetch('https://api.example.com/endpoint', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <JWT>',
    'Content-Type': 'application/json',
  },
});
const data = await response.json();
```

```js
// Axios
import axios from 'axios';

const response = await axios.get('https://api.example.com/endpoint', {
  headers: {
    Authorization: `Bearer <JWT>`,
  },
});
```

```js
// Node.js (https)
const https = require('https');

const options = {
  hostname: 'api.example.com',
  path: '/endpoint',
  method: 'GET',
  headers: {
    Authorization: 'Bearer <JWT>',
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
req.end();
```

```python
# Python (requests)
import requests

headers = {"Authorization": "Bearer <JWT>"}
response = requests.get("https://api.example.com/endpoint", headers=headers)
print(response.json())
```

```go
// Go
req, _ := http.NewRequest("GET", "https://api.example.com/endpoint", nil)
req.Header.Set("Authorization", "Bearer <JWT>")
client := &http.Client{}
resp, _ := client.Do(req)
defer resp.Body.Close()
```

```bash
# HTTPie
http GET https://api.example.com/endpoint \
  Authorization:"Bearer <JWT>"
```

---

### 4. Key Generator Tab

**Layout: single centered column, max-width 800px**

- Dropdown: Key Type (`RSA`, `EC`, `EdDSA / OKP`)
- For RSA: key size selector (2048 / 3072 / 4096)
- For EC: curve selector (P-256, P-384, P-521)
- For EdDSA: curve (Ed25519 fixed)
- Button: `Generate Key Pair`
- Output: two panels side by side
  - **Private Key** — PEM textarea + "Copy" + format toggle (PEM | JWK)
  - **Public Key** — PEM textarea + "Copy" + format toggle (PEM | JWK)
- Warning banner: "Private keys are generated in your browser and never transmitted."

---

### 5. History (sidebar / drawer)

- Collapsible right drawer (icon button in header)
- List of recently decoded/generated tokens (stored in localStorage)
- Each entry shows: algorithm badge, `sub` or first custom claim, timestamp
- Click to load into Decode tab
- Button: `Clear History`
- Max 50 entries, FIFO

---

## UI / UX Design Specification

### Theme

- **Default**: system preference (`prefers-color-scheme`)
- Toggle button in top-right header (sun/moon icon)
- MUI `createTheme` with custom palette:

**Dark palette**
```
background.default: #0d1117  (GitHub-dark style)
background.paper:  #161b22
primary:           #58a6ff
secondary:         #f78166
success:           #3fb950
error:             #f85149
text.primary:      #e6edf3
text.secondary:    #8b949e
```

**Light palette**
```
background.default: #ffffff
background.paper:  #f6f8fa
primary:           #0969da
secondary:         #cf222e
success:           #1a7f37
error:             #cf222e
text.primary:      #1f2328
text.secondary:    #636c76
```

### Typography

- Font family: `'Inter', 'Segoe UI', sans-serif` for UI
- Monospace: `'JetBrains Mono', 'Fira Code', monospace` for tokens, keys, JSON

### JWT Color Coding (both themes)

- Header segment: `#f97583` (pink/red)
- Payload segment: `#79b8ff` (blue)
- Signature segment: `#ffab70` (orange)
- Dots separator: `#8b949e` (gray)

### Layout

- Top `<AppBar>`: logo ("JWT Lab"), tab navigation, theme toggle, history drawer button
- Main content: full-height, two-column where specified, responsive (single column on mobile)
- Max content width: `1280px`, centered
- Consistent `16px` gutter / spacing

### Interactions

- All copy actions show a brief `✓ Copied!` tooltip (MUI Tooltip with 1.5s auto-hide)
- Invalid JSON in payload/header → red border + inline error message
- Expired token → yellow warning chip in Payload section header
- Smooth tab transitions (MUI Tabs with `Fade`)
- Keyboard shortcuts:
  - `Ctrl+Enter` — Generate token (in Generate tab)
  - `Ctrl+K` — Focus token input (in Decode tab)
  - `Ctrl+Shift+H` — Toggle history drawer

---

## State Management (Zustand)

```
useAppStore
  theme: 'light' | 'dark' | 'system'
  activeTab: 'decode' | 'generate' | 'keygen'
  historyDrawerOpen: boolean

useDecodeStore
  rawToken: string
  decodedHeader: object | null
  decodedPayload: object | null
  verificationSecret: string
  secretEncoding: 'utf8' | 'base64url'
  verificationStatus: 'idle' | 'valid' | 'invalid' | 'error'
  verificationError: string | null

useGenerateStore
  algorithm: AlgorithmId
  secret: string
  privateKey: string
  claims: StandardClaims
  customClaims: CustomClaim[]
  generatedToken: string | null
  error: string | null
  snippetsUrl: string          // default 'https://api.example.com/endpoint'
  snippetsMethod: HttpMethod   // 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  snippetsBody: string         // JSON string, shown only for POST/PUT/PATCH
  activeSnippetTab: SnippetLang  // 'curl' | 'fetch' | 'axios' | 'nodejs' | 'python' | 'go' | 'httpie'

useKeygenStore
  keyType: 'RSA' | 'EC' | 'OKP'
  rsaSize: 2048 | 3072 | 4096
  ecCurve: 'P-256' | 'P-384' | 'P-521'
  publicKey: { pem: string; jwk: object } | null
  privateKey: { pem: string; jwk: object } | null
  generating: boolean
```

---

## Project Structure

```
src/
  components/
    Layout/         AppBar, HistoryDrawer
    DecodeTab/      TokenInput, HeaderPanel, PayloadPanel, SignaturePanel
    GenerateTab/    AlgorithmPicker, ClaimsForm, CustomClaimsEditor, TokenOutput
    KeygenTab/      KeyTypeForm, KeyOutput
    common/         JsonViewer, CopyButton, AlgorithmBadge, StatusChip
  stores/           appStore, decodeStore, generateStore, keygenStore
  lib/
    jwt.ts          encode / decode / verify wrappers around `jose`
    crypto.ts       key generation wrappers
    claims.ts       claim helpers (exp calculation, UUID gen)
    history.ts      localStorage read/write
  theme/
    theme.ts        MUI theme factory
    tokens.ts       JWT color constants
  App.tsx
  main.tsx
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "@mui/material": "^6",
    "@mui/icons-material": "^6",
    "@emotion/react": "^11",
    "@emotion/styled": "^11",
    "zustand": "^5",
    "jose": "^5",
    "uuid": "^9"
  },
  "devDependencies": {
    "typescript": "^5",
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "gh-pages": "^6"
  }
}
```

---

## Deployment

- `vite.config.ts`: set `base: '/jwt-lab/'`
- `package.json` scripts:
  ```json
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
  ```
- GitHub Actions workflow (`.github/workflows/deploy.yml`): build and deploy on push to `main`

---

## Out of Scope (v1)

- Token refresh / rotation simulation
- Server-side proxy for any operation
- User accounts or cloud storage
- Snippet customization beyond URL / method / body (e.g. custom headers, auth schemes) — v2
