import {
  SignJWT,
  jwtVerify,
  importJWK,
  importPKCS8,
  importSPKI,
  decodeJwt,
  decodeProtectedHeader,
  type JWTPayload,
  type JWTHeaderParameters,
} from 'jose'
import type { AlgorithmId } from '@/stores/generateStore'
import type { StandardClaims, CustomClaim } from '@/stores/generateStore'
import { parseDuration, buildCustomPayload } from './claims'

export interface DecodedJWT {
  header: JWTHeaderParameters
  payload: JWTPayload & Record<string, unknown>
  signature: string
  parts: [string, string, string]
}

export function decodeToken(token: string): DecodedJWT {
  const trimmed = token.trim()
  const parts = trimmed.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT structure: expected 3 parts')

  const header = decodeProtectedHeader(trimmed) as JWTHeaderParameters
  const payload = decodeJwt(trimmed) as JWTPayload & Record<string, unknown>
  const signature = parts[2]!

  return { header, payload, signature, parts: [parts[0]!, parts[1]!, parts[2]!] }
}

export async function verifyToken(
  token: string,
  algorithm: string,
  secret: string,
  secretEncoding: 'utf8' | 'base64url',
  publicKeyPem: string
): Promise<void> {
  const trimmed = token.trim()
  const family = getAlgorithmFamily(algorithm)

  if (family === 'HMAC') {
    const keyBytes =
      secretEncoding === 'base64url'
        ? base64urlToUint8Array(secret)
        : new TextEncoder().encode(secret)
    await jwtVerify(trimmed, keyBytes)
  } else if (family === 'RSA' || family === 'RSA-PSS' || family === 'EC' || family === 'EdDSA') {
    const key = await importSPKI(publicKeyPem.trim(), algorithm)
    await jwtVerify(trimmed, key)
  } else if (algorithm === 'none') {
    // none tokens can't be verified with jose — just check structure
    const parts = trimmed.split('.')
    if (parts.length !== 3 || parts[2] !== '') {
      throw new Error('Invalid "none" algorithm token')
    }
  }
}

export async function generateToken(
  algorithm: AlgorithmId,
  secret: string,
  secretBase64: boolean,
  privateKeyPem: string,
  claims: StandardClaims,
  customClaims: CustomClaim[]
): Promise<string> {
  const payload = buildCustomPayload(customClaims)

  if (claims.iss) payload['iss'] = claims.iss
  if (claims.sub) payload['sub'] = claims.sub
  if (claims.aud) payload['aud'] = claims.aud.includes(',')
    ? claims.aud.split(',').map((s) => s.trim()).filter(Boolean)
    : claims.aud

  const now = Math.floor(Date.now() / 1000)
  if (claims.iatAuto) payload['iat'] = now

  if (claims.exp) {
    const secs = parseDuration(claims.exp)
    if (secs !== null) payload['exp'] = now + secs
  }

  if (claims.nbf) {
    const nbfDate = new Date(claims.nbf)
    payload['nbf'] = Math.floor(nbfDate.getTime() / 1000)
  }

  if (claims.jti) payload['jti'] = claims.jti

  if (algorithm === 'none') {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const body = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    return `${header}.${body}.`
  }

  const family = getAlgorithmFamily(algorithm)
  let signingKey: CryptoKey | Uint8Array

  if (family === 'HMAC') {
    signingKey = secretBase64
      ? base64urlToUint8Array(secret)
      : new TextEncoder().encode(secret)
  } else {
    signingKey = await importPKCS8(privateKeyPem.trim(), algorithm)
  }

  const jwt = new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: algorithm, typ: 'JWT' })

  return jwt.sign(signingKey)
}

export async function verifyWithJWK(
  token: string,
  algorithm: string,
  jwkString: string
): Promise<void> {
  const jwk = JSON.parse(jwkString)
  const key = await importJWK(jwk, algorithm)
  await jwtVerify(token.trim(), key)
}

export function getAlgorithmFamily(
  alg: string
): 'HMAC' | 'RSA' | 'RSA-PSS' | 'EC' | 'EdDSA' | 'none' {
  if (alg.startsWith('HS')) return 'HMAC'
  if (alg.startsWith('RS')) return 'RSA'
  if (alg.startsWith('PS')) return 'RSA-PSS'
  if (alg.startsWith('ES')) return 'EC'
  if (alg === 'EdDSA') return 'EdDSA'
  return 'none'
}

function base64urlToUint8Array(b64: string): Uint8Array {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/')
  const padLen = (4 - (padded.length % 4)) % 4
  const normalized = padded + '='.repeat(padLen)
  const binary = atob(normalized)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

export async function importPrivateKey(pem: string, alg: string): Promise<CryptoKey> {
  return importPKCS8(pem.trim(), alg)
}

export async function importPublicKey(pem: string, alg: string): Promise<CryptoKey> {
  return importSPKI(pem.trim(), alg)
}
