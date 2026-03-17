import { create } from 'zustand'

export type KeyType = 'RSA' | 'EC' | 'OKP'
export type RsaSize = 2048 | 3072 | 4096
export type EcCurve = 'P-256' | 'P-384' | 'P-521'
export type KeyFormat = 'pem' | 'jwk'

export interface KeyPair {
  privateKeyPem: string
  publicKeyPem: string
  privateKeyJwk: object
  publicKeyJwk: object
}

interface KeygenState {
  keyType: KeyType
  rsaSize: RsaSize
  ecCurve: EcCurve
  keyPair: KeyPair | null
  generating: boolean
  error: string | null
  privateKeyFormat: KeyFormat
  publicKeyFormat: KeyFormat

  setKeyType: (t: KeyType) => void
  setRsaSize: (s: RsaSize) => void
  setEcCurve: (c: EcCurve) => void
  setGenerating: (v: boolean) => void
  setKeyPair: (kp: KeyPair | null) => void
  setError: (e: string | null) => void
  setPrivateKeyFormat: (f: KeyFormat) => void
  setPublicKeyFormat: (f: KeyFormat) => void
}

export const useKeygenStore = create<KeygenState>()((set) => ({
  keyType: 'RSA',
  rsaSize: 2048,
  ecCurve: 'P-256',
  keyPair: null,
  generating: false,
  error: null,
  privateKeyFormat: 'pem',
  publicKeyFormat: 'pem',

  setKeyType: (keyType) => set({ keyType, keyPair: null, error: null }),
  setRsaSize: (rsaSize) => set({ rsaSize }),
  setEcCurve: (ecCurve) => set({ ecCurve }),
  setGenerating: (generating) => set({ generating }),
  setKeyPair: (keyPair) => set({ keyPair }),
  setError: (error) => set({ error }),
  setPrivateKeyFormat: (privateKeyFormat) => set({ privateKeyFormat }),
  setPublicKeyFormat: (publicKeyFormat) => set({ publicKeyFormat }),
}))
