import { NextRequest, NextResponse } from 'next/server'
import { MsalService } from 'services/MsalService'

export async function POST(request: NextRequest) {
  const msalService = new MsalService()
  const json = await request.json()
  const code = json.code as string
  if (!code) {
    return NextResponse.json({error: 'code is not found'}, {status: 400})
  }

  const verifier = request.cookies.get('csrfToken')?.value
  if (!verifier) {
    return NextResponse.json({error: 'invalid request'}, {status: 400})
  }

  const result = await msalService.acquireTokenByCode(code, verifier)
  return NextResponse.json(result)
}
