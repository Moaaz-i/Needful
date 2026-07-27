import Api from "@/app/_api/api";
import { login } from "@/app/_api/signup";
import { config } from "@/lib/config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.email && credentials?.password) {
            const result = await login({
              email: credentials.email,
              password: credentials.password,
            });

            console.log(result.token);

            if (result.token) {
              // Verify token and get user data from verifyToken endpoint using Api
              try {
                const api = Api(config.apiUrl);
                const verifyResponse = await api.get("/auth/verifyToken");
                if (
                  verifyResponse.data.message === "verified" &&
                  verifyResponse.data.decoded
                ) {
                  const decoded = verifyResponse.data.decoded;
                  return {
                    id: decoded.id,
                    name: decoded.name,
                    email: credentials.email, // Use email from credentials since verifyToken doesn't return it
                    role: decoded.role,
                    accessToken: result.token,
                  };
                }
              } catch (verifyError) {
                // Fallback to basic user data if verifyToken fails
                return {
                  id: result.user?.id,
                  name: result.user?.name || "",
                  email: credentials.email,
                  role: result.user?.role || "user",
                  accessToken: result.token,
                };
              }
            }
          }
          return null;
        } catch (error: any) {
          if (error.response) {
            // Throw custom error message from backend
            throw new Error(
              error.response.data.message || "Invalid credentials",
            );
          }
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.user = token.user;
      }
      return session;
    },
  },
});

export { handler as GET, handler, handler as POST };
