import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {login, signup} from '@/app/_api/signup'
import {config} from '@/lib/config'

const handler = NextAuth({
  secret:
    process.env.NEXTAUTH_SECRET ||
    'fYg1gZ+vYQAeYVyRWWn8oRS5xfuQcIifPJx9Zyp7Vibc=',
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

            if (result.token && result.user) {
              const user = result.user
              return {
                id: user._id || user.email, // Use _id if available, fallback to email
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: result.token
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
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.accessToken = user.accessToken
        token.user = user
      }
      return token
    },
    async session({session, token}) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
        session.user = token.user
      }
      return session
    }
  }
})

export {handler as GET, handler as POST}
