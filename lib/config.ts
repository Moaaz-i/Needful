// Environment configuration
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.routemisr.com',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

// API endpoints
export const apiEndpoints = {
  auth: {
    signin: `${config.apiUrl}/api/v1/auth/signin`,
    signup: `${config.apiUrl}/api/v1/auth/signup`
  },
  base: `${config.apiUrl}/api/v1`
}
