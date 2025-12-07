import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the base URL from the request
    const baseUrl = request.nextUrl.origin
    const searchParams = request.nextUrl.searchParams
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    // Get the original request body as form data
    const formData = await request.formData()

    // Create a new URL for the original NextAuth endpoint
    const originalUrl = new URL(`${baseUrl}/api/auth/callback/credentials`)
    originalUrl.searchParams.set('callbackUrl', callbackUrl)

    // Forward all form data to the original endpoint
    const response = await fetch(originalUrl.toString(), {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('Cookie') || '',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData as any).toString(),
      redirect: 'manual'
    })

    // Handle redirect response (successful login)
    if (response.status === 302 || response.status === 303) {
      const location = response.headers.get('Location')
      if (location) {
        return NextResponse.redirect(location, response.status)
      }
    }

    // Handle error response
    const responseText = await response.text()

    // Try to parse as JSON first
    try {
      const jsonData = JSON.parse(responseText)
      return NextResponse.json(jsonData, {status: response.status})
    } catch {
      // If not JSON, return as error message
      if (response.status === 401 || response.status === 400) {
        return NextResponse.json(
          {error: responseText || 'Invalid credentials'},
          {status: 401}
        )
      }

      // Return the response as-is for other cases
      return new NextResponse(responseText, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/html'
        }
      })
    }
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      {
        error: 'Callback error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {status: 500}
    )
  }
}
