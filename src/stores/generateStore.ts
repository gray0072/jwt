import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AlgorithmId =
  | 'HS256' | 'HS384' | 'HS512'
  | 'RS256' | 'RS384' | 'RS512'
  | 'PS256' | 'PS384' | 'PS512'
  | 'ES256' | 'ES384' | 'ES512'
  | 'EdDSA'
  | 'none'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type SnippetLang = 'curl' | 'fetch' | 'axios' | 'nodejs' | 'python' | 'go' | 'httpie'

export interface CustomClaim {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
}

export interface StandardClaims {
  iss: string
  sub: string
  aud: string
  exp: string        // duration string like '1h', '24h', '7d', or '' for none
  nbf: string        // ISO datetime or ''
  iatAuto: boolean
  jti: string
}

interface GenerateState {
  algorithm: AlgorithmId
  secret: string
  secretVisible: boolean
  secretBase64: boolean
  privateKey: string
  claims: StandardClaims
  customClaims: CustomClaim[]
  generatedToken: string | null
  generateError: string | null
  snippetsUrl: string
  snippetsMethod: HttpMethod
  snippetsBody: string
  activeSnippetTab: SnippetLang

  setAlgorithm: (alg: AlgorithmId) => void
  setSecret: (s: string) => void
  setSecretVisible: (v: boolean) => void
  setSecretBase64: (v: boolean) => void
  setPrivateKey: (k: string) => void
  setClaims: (claims: Partial<StandardClaims>) => void
  setCustomClaims: (claims: CustomClaim[]) => void
  setGeneratedToken: (token: string | null, error: string | null) => void
  setSnippetsUrl: (url: string) => void
  setSnippetsMethod: (method: HttpMethod) => void
  setSnippetsBody: (body: string) => void
  setActiveSnippetTab: (tab: SnippetLang) => void
  reset: () => void
}

const defaultClaims: StandardClaims = {
  iss: '',
  sub: '',
  aud: '',
  exp: '1h',
  nbf: '',
  iatAuto: true,
  jti: '',
}

export const useGenerateStore = create<GenerateState>()(
  persist(
    (set) => ({
      algorithm: 'HS256',
      secret: 'your-256-bit-secret',
      secretVisible: false,
      secretBase64: false,
      privateKey: '',
      claims: defaultClaims,
      customClaims: [],
      generatedToken: null,
      generateError: null,
      snippetsUrl: 'https://api.example.com/endpoint',
      snippetsMethod: 'GET',
      snippetsBody: '{}',
      activeSnippetTab: 'curl',

      setAlgorithm: (algorithm) => set({ algorithm }),
      setSecret: (secret) => set({ secret }),
      setSecretVisible: (secretVisible) => set({ secretVisible }),
      setSecretBase64: (secretBase64) => set({ secretBase64 }),
      setPrivateKey: (privateKey) => set({ privateKey }),
      setClaims: (partial) =>
        set((s) => ({ claims: { ...s.claims, ...partial } })),
      setCustomClaims: (customClaims) => set({ customClaims }),
      setGeneratedToken: (generatedToken, generateError) =>
        set({ generatedToken, generateError }),
      setSnippetsUrl: (snippetsUrl) => set({ snippetsUrl }),
      setSnippetsMethod: (snippetsMethod) => set({ snippetsMethod }),
      setSnippetsBody: (snippetsBody) => set({ snippetsBody }),
      setActiveSnippetTab: (activeSnippetTab) => set({ activeSnippetTab }),
      reset: () =>
        set({
          algorithm: 'HS256',
          secret: 'your-256-bit-secret',
          secretBase64: false,
          privateKey: '',
          claims: defaultClaims,
          customClaims: [],
          generatedToken: null,
          generateError: null,
        }),
    }),
    {
      name: 'jwt-lab-generate',
      partialize: (s) => ({
        algorithm: s.algorithm,
        secret: s.secret,
        secretBase64: s.secretBase64,
        claims: s.claims,
        customClaims: s.customClaims,
        snippetsUrl: s.snippetsUrl,
        snippetsMethod: s.snippetsMethod,
      }),
    }
  )
)
