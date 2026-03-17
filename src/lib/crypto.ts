import { generateKeyPair, exportJWK, exportPKCS8, exportSPKI } from 'jose'
import type { KeyPair, RsaSize, EcCurve } from '@/stores/keygenStore'

export async function generateRsaKeyPair(size: RsaSize): Promise<KeyPair> {
  const { privateKey, publicKey } = await generateKeyPair('RS256', {
    modulusLength: size,
    extractable: true,
  })
  return exportKeyPair(privateKey, publicKey)
}

export async function generateEcKeyPair(curve: EcCurve): Promise<KeyPair> {
  const algMap: Record<EcCurve, string> = {
    'P-256': 'ES256',
    'P-384': 'ES384',
    'P-521': 'ES512',
  }
  const { privateKey, publicKey } = await generateKeyPair(algMap[curve]!, {
    extractable: true,
  })
  return exportKeyPair(privateKey, publicKey)
}

export async function generateEdKeyPair(): Promise<KeyPair> {
  const { privateKey, publicKey } = await generateKeyPair('EdDSA', {
    crv: 'Ed25519',
    extractable: true,
  })
  return exportKeyPair(privateKey, publicKey)
}

async function exportKeyPair(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<KeyPair> {
  const [privateKeyPem, publicKeyPem, privateKeyJwk, publicKeyJwk] =
    await Promise.all([
      exportPKCS8(privateKey),
      exportSPKI(publicKey),
      exportJWK(privateKey),
      exportJWK(publicKey),
    ])

  return { privateKeyPem, publicKeyPem, privateKeyJwk, publicKeyJwk }
}

export function generateRandomSecret(bytes = 32): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}
