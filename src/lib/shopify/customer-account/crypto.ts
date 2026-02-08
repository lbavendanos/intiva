import type { PKCEParams } from './types'

function generateRandomString(length: number): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)

  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)

  return base64UrlEncode(array.buffer)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return base64UrlEncode(digest)
}

export function generateState(): string {
  return generateRandomString(32)
}

export function generateNonce(): string {
  return generateRandomString(16)
}

export async function generatePKCEParams(): Promise<PKCEParams> {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateState()
  const nonce = generateNonce()

  return { codeVerifier, codeChallenge, state, nonce }
}
