import { NextResponse } from 'next/server'
import { MsalService } from 'services/MsalService'

export async function GET() {
  const msalService = new MsalService()
  const {verifier, challenge, state} = await msalService.getCryptoCodeVerifier()
  const redirectUrl = await msalService.getAuthCodeUrl(challenge, state)
  return NextResponse.json({redirect_url: redirectUrl}, {status: 200, headers: {'Set-Cookie': `csrfToken=${verifier}`}})
}
