import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {login, signup} from '@/app/_api/signup'
import {cookies} from 'next/headers'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        try {
          if (credentials?.email && credentials?.password) {
            const result = await login({
              email: credentials.email,
              password: credentials.password
            })
            const user = result.user

            if (result.token && result.user) {
              const accessToken = (await cookies()).get('accessToken')?.value
              if (!accessToken) {
                console.error('Access token not found in cookies')
                return null
              }

              if (result.token !== accessToken) {
                console.error('Access token does not match')
                return null
              }

              return {
                id: user?._id || result?.user?._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                accessToken
              }
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({session, token}) {
      if (token.accessToken) {
        session.user = token.user
      }
      return session
    }
  }
})

export {handler as GET, handler as POST}
