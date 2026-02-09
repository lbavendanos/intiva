import {
  CustomerAccountError,
  getClientId,
  getOAuthDiscoveryConfig,
} from './discovery'
import type { SessionTokens, TokenResponse } from './types'

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<SessionTokens> {
  const config = await getOAuthDiscoveryConfig()
  const clientId = getClientId()

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
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
      `Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new CustomerAccountError(
      `Token exchange failed with ${response.status}: ${text}`,
    )
  }

  const data = (await response.json()) as TokenResponse

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
  const config = await getOAuthDiscoveryConfig()
  const clientId = getClientId()

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
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
      `Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new CustomerAccountError(
      `Token refresh failed with ${response.status}: ${text}`,
    )
  }

  const data = (await response.json()) as Omit<TokenResponse, 'id_token'>

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
}
