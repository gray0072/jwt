import type { HttpMethod, SnippetLang } from '@/stores/generateStore'

interface SnippetContext {
  token: string
  url: string
  method: HttpMethod
  body: string
}

function truncateToken(token: string): string {
  if (token.length <= 40) return token
  return token.slice(0, 20) + '...' + token.slice(-10)
}

export function buildSnippet(lang: SnippetLang, ctx: SnippetContext): string {
  const { token, url, method, body } = ctx
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method) && body.trim()
  const bodyJson = hasBody ? body : null

  switch (lang) {
    case 'curl':
      return buildCurl(token, url, method, bodyJson)
    case 'fetch':
      return buildFetch(token, url, method, bodyJson)
    case 'axios':
      return buildAxios(token, url, method, bodyJson)
    case 'nodejs':
      return buildNodejs(token, url, method, bodyJson)
    case 'python':
      return buildPython(token, url, method, bodyJson)
    case 'go':
      return buildGo(token, url, method, bodyJson)
    case 'httpie':
      return buildHttpie(token, url, method, bodyJson)
  }
}

function buildCurl(token: string, url: string, method: HttpMethod, body: string | null): string {
  const lines = [
    `curl -X ${method} '${url}' \\`,
    `  -H 'Authorization: Bearer ${token}'`,
  ]
  if (body) {
    lines[lines.length - 1] += ' \\'
    lines.push(`  -H 'Content-Type: application/json' \\`)
    lines.push(`  -d '${body}'`)
  }
  return lines.join('\n')
}

function buildFetch(token: string, url: string, method: HttpMethod, body: string | null): string {
  const bodyPart = body
    ? `  body: JSON.stringify(${body}),\n`
    : ''
  const contentType = body ? `    'Content-Type': 'application/json',\n` : ''
  return `const response = await fetch('${url}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer ${token}',
${contentType}  },
${bodyPart}});

const data = await response.json();
console.log(data);`
}

function buildAxios(token: string, url: string, method: HttpMethod, body: string | null): string {
  const methodLower = method.toLowerCase()
  const hasBody = body && ['post', 'put', 'patch'].includes(methodLower)
  const bodyArg = hasBody ? `\n  ${body},` : ''
  return `import axios from 'axios';

const response = await axios.${methodLower}('${url}',${bodyArg}
  {
    headers: {
      Authorization: \`Bearer ${token}\`,${hasBody ? "\n      'Content-Type': 'application/json'," : ''}
    },
  }
);

console.log(response.data);`
}

function buildNodejs(token: string, url: string, method: HttpMethod, body: string | null): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    parsed = new URL('https://api.example.com/endpoint')
  }
  const bodyStr = body ? `\nconst body = JSON.stringify(${body});\n` : ''
  const contentLengthLine = body ? `\n  'Content-Length': Buffer.byteLength(body),` : ''
  const contentTypeLine = body ? `\n  'Content-Type': 'application/json',` : ''
  const reqEndLine = body ? `req.write(body);\n` : ''

  return `const https = require('https');
${bodyStr}
const options = {
  hostname: '${parsed.hostname}',
  path: '${parsed.pathname}${parsed.search}',
  method: '${method}',
  headers: {
    'Authorization': 'Bearer ${token}',${contentTypeLine}${contentLengthLine}
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});

req.on('error', console.error);
${reqEndLine}req.end();`
}

function buildPython(token: string, url: string, method: HttpMethod, body: string | null): string {
  const methodLower = method.toLowerCase()
  const bodyArg = body ? `, json=${body}` : ''
  return `import requests

headers = {
    "Authorization": f"Bearer ${token}",${body ? '\n    "Content-Type": "application/json",' : ''}
}

response = requests.${methodLower}(
    "${url}",
    headers=headers,${bodyArg}
)

print(response.json())`
}

function buildGo(token: string, url: string, method: HttpMethod, body: string | null): string {
  const bodyImport = body ? '\n\t"bytes"\n\t"encoding/json"' : ''
  const bodySetup = body
    ? `\n\tbody, _ := json.Marshal(${body})\n\treq, err := http.NewRequest("${method}", "${url}", bytes.NewBuffer(body))\n\treq.Header.Set("Content-Type", "application/json")`
    : `\n\treq, err := http.NewRequest("${method}", "${url}", nil)`
  return `package main

import (
\t"fmt"
\t"io"
\t"net/http"${bodyImport}
)

func main() {${bodySetup}
\tif err != nil {
\t\tpanic(err)
\t}

\treq.Header.Set("Authorization", "Bearer ${token}")

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\trespBody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(respBody))
}`
}

function buildHttpie(token: string, url: string, method: HttpMethod, body: string | null): string {
  const bodyPart = body ? ` \\\n  '${body}'` : ''
  return `http ${method} '${url}' \\
  Authorization:"Bearer ${token}"${bodyPart}`
}

export const SNIPPET_TABS: { id: SnippetLang; label: string; language: string }[] = [
  { id: 'curl', label: 'cURL', language: 'bash' },
  { id: 'fetch', label: 'Fetch', language: 'javascript' },
  { id: 'axios', label: 'Axios', language: 'javascript' },
  { id: 'nodejs', label: 'Node.js', language: 'javascript' },
  { id: 'python', label: 'Python', language: 'python' },
  { id: 'go', label: 'Go', language: 'go' },
  { id: 'httpie', label: 'HTTPie', language: 'bash' },
]

export { truncateToken }
