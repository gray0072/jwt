import { create } from 'zustand'

export type VerificationStatus = 'idle' | 'valid' | 'invalid' | 'error'
export type SecretEncoding = 'utf8' | 'base64url'

interface DecodeState {
  rawToken: string
  decodedHeader: Record<string, unknown> | null
  decodedPayload: Record<string, unknown> | null
  decodeError: string | null
  verificationSecret: string
  secretEncoding: SecretEncoding
  publicKey: string
  verificationStatus: VerificationStatus
  verificationError: string | null

  setRawToken: (token: string) => void
  setDecoded: (
    header: Record<string, unknown> | null,
    payload: Record<string, unknown> | null,
    error: string | null
  ) => void
  setVerificationSecret: (secret: string) => void
  setSecretEncoding: (encoding: SecretEncoding) => void
  setPublicKey: (key: string) => void
  setVerificationStatus: (
    status: VerificationStatus,
    error: string | null
  ) => void
  reset: () => void
}

export const useDecodeStore = create<DecodeState>()((set) => ({
  rawToken: '',
  decodedHeader: null,
  decodedPayload: null,
  decodeError: null,
  verificationSecret: '',
  secretEncoding: 'utf8',
  publicKey: '',
  verificationStatus: 'idle',
  verificationError: null,

  setRawToken: (rawToken) => set({ rawToken }),
  setDecoded: (decodedHeader, decodedPayload, decodeError) =>
    set({ decodedHeader, decodedPayload, decodeError, verificationStatus: 'idle', verificationError: null }),
  setVerificationSecret: (verificationSecret) => set({ verificationSecret }),
  setSecretEncoding: (secretEncoding) => set({ secretEncoding }),
  setPublicKey: (publicKey) => set({ publicKey }),
  setVerificationStatus: (verificationStatus, verificationError) =>
    set({ verificationStatus, verificationError }),
  reset: () =>
    set({
      rawToken: '',
      decodedHeader: null,
      decodedPayload: null,
      decodeError: null,
      verificationStatus: 'idle',
      verificationError: null,
    }),
}))
