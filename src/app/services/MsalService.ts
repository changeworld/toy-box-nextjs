import { AuthenticationResult, ConfidentialClientApplication, Configuration, CryptoProvider, LogLevel } from '@azure/msal-node'

export class MsalService {
  private config: Configuration = {
    auth: {
      clientId: process.env.CLIENT_ID ?? '',
      authority: (process.env.CLOUD_INSTANCE ?? '') + (process.env.TENANT_ID ?? ''),
      clientSecret: process.env.CLIENT_SECRET
    },
    system: {
      loggerOptions: {
        piiLoggingEnabled: false,
        logLevel: LogLevel.Info
      }
    }
  }

  private msalInstance: ConfidentialClientApplication = new ConfidentialClientApplication(this.config)
  private msalCryptProvider: CryptoProvider = new CryptoProvider()
  private redirectUri: string = process.env.REDIRECT_URI ?? ''

  public getCryptoCodeVerifier = async(): Promise<{verifier: string, challenge: string, state: string}> => {
    const csrfToken = this.msalCryptProvider.createNewGuid()
    const {verifier, challenge} = await this.msalCryptProvider.generatePkceCodes()
    const state = this.msalCryptProvider.base64Encode(
      JSON.stringify({
        csrfToken,
        redirectTo: '/'
      })
    )
    return {verifier, challenge, state}
  }

  public getAuthCodeUrl = async(challenge: string, state: string, scopes?: string[]): Promise<string> => {
    const redirectUrl = await this.msalInstance.getAuthCodeUrl({
      redirectUri: this.redirectUri,
      codeChallengeMethod: 'S256',
      codeChallenge: challenge,
      responseMode: 'query',
      state,
      scopes: scopes ?? []
    })
    return redirectUrl
  }

  public acquireTokenByCode = async(code: string, verifier: string, scopes?: string[]): Promise<AuthenticationResult> => {
    return await this.msalInstance.acquireTokenByCode({
      code: code,
      codeVerifier: verifier,
      redirectUri: this.redirectUri,
      scopes: scopes ?? []
    })
  }
}
