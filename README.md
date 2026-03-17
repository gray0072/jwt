# JWT Lab

**JWT Lab** is an open-source developer tool for generating, decoding, and validating JSON Web Tokens (JWT) — right in the browser, with no data leaving your machine.

> All processing happens client-side. Your secrets and tokens never touch a server.

---

## Features

- **Generate** JWTs with any algorithm — HS256/384/512, RS256/384/512, ES256/384/512, PS256/384/512, EdDSA
- **Decode** any JWT: inspect header, payload, and signature at a glance
- **Verify** tokens against a secret or public key with clear pass/fail feedback
- **Live editing** — modify header/payload fields and get an updated token instantly
- **Claim helpers** — auto-fill standard claims (`iat`, `exp`, `nbf`, `iss`, `sub`, `aud`, `jti`) with smart defaults
- **Key generation** — generate RSA / EC / OKP key pairs directly in the browser
- **Import/Export** keys in PEM and JWK formats
- **History** — recent tokens saved locally in your browser (localStorage)
- **Dark / Light theme** — follows system preference, toggleable manually
- **Copy to clipboard** with one click everywhere

## Supported Algorithms

| Family | Algorithms |
|--------|-----------|
| HMAC | HS256, HS384, HS512 |
| RSA | RS256, RS384, RS512 |
| RSA-PSS | PS256, PS384, PS512 |
| ECDSA | ES256, ES384, ES512 |
| EdDSA | Ed25519 |
| None | none (unsigned) |

## Tech Stack

- **React 18** + **TypeScript**
- **MUI v6** (Material UI) — component library & theming
- **Zustand** — lightweight global state
- **jose** — JWT implementation (Web Crypto API)
- **Vite** — build tool
- **GitHub Pages** — hosting

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/jwt-lab.git
cd jwt-lab
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

```bash
npm run build
npm run deploy   # pushes to gh-pages branch
```

## Contributing

Issues and PRs are welcome. The project is intentionally kept simple — no backend, no analytics, no tracking.

## License

MIT
