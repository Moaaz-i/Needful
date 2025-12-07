import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/auth/session`, {
      headers: {
        Cookie: request.headers.get('Cookie') || ''
      }
    })

    const data = await response.json()
    return NextResponse.json(data, {status: response.status})
  } catch (error) {
    return NextResponse.json({error: 'Session error'}, {status: 500})
  }
}
