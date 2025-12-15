import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {handler} from '../[...nextauth]/route'
import '@/lib/next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(handler)

    if (!session || !session.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // Type the session user properly
    const user = session.user as {
      id: string
      name: string
      email: string
      phone?: string
      role?: string
    }

    // Return user data in the expected format
    return NextResponse.json({
      message: 'Token verified successfully',
      user: {
        id: user.id || user.email,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        phone: user.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
