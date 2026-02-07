export type OAuthDiscoveryConfig = {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  end_session_endpoint: string
  userinfo_endpoint: string
  jwks_uri: string
  scopes_supported: string[]
  response_types_supported: string[]
  subject_types_supported: string[]
  id_token_signing_alg_values_supported: string[]
}

export type CustomerAccountApiConfig = {
  graphql_api: string
}

export type TokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  id_token: string
  token_type: string
}

export type SessionTokens = {
  accessToken: string
  refreshToken: string
  idToken: string
  expiresAt: number
}

export type PKCEParams = {
  codeVerifier: string
  codeChallenge: string
  state: string
  nonce: string
}
