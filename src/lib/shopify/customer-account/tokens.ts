import {
  CustomerAccountError,
  getClientId,
  getOAuthDiscoveryConfig,
} from './discovery'
import type { SessionTokens } from './types'

type TokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  id_token?: string
  token_type: string
}

async function tokenRequest(
  params: Record<string, string>,
  context: string,
): Promise<TokenResponse> {
  const config = await getOAuthDiscoveryConfig()
  const body = new URLSearchParams({
    client_id: getClientId(),
    ...params,
  })

  let response: Response

  try {
    response = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
  } catch (error) {
    throw new CustomerAccountError(
      `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new CustomerAccountError(
      `${context} failed with ${response.status}: ${text}`,
    )
  }

  return (await response.json()) as TokenResponse
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<SessionTokens> {
  const data = await tokenRequest(
    {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    },
    'Token exchange',
  )

  if (!data.id_token) {
    throw new CustomerAccountError('Token exchange response missing id_token')
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<Omit<SessionTokens, 'idToken'>> {
  const data = await tokenRequest(
    {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    'Token refresh',
  )

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
}
