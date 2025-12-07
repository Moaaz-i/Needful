import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the original NextAuth CSRF endpoint
    const baseUrl = request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/auth/csrf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('Cookie') || ''
      }
    })

    const data = await response.json()
    return NextResponse.json(data, {status: response.status})
  } catch (error) {
    return NextResponse.json({error: 'CSRF error'}, {status: 500})
  }
}
