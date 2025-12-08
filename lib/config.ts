// Environment configuration
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || getBaseUrl(),
  nextAuthUrl: process.env.NEXTAUTH_URL || getBaseUrl()
}

// Function to dynamically get the base URL
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin
  } else {
    // Server-side: try to determine from environment or fallback
    return process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.routemisr.com'
  }
}

// API endpoints
export const apiEndpoints = {
  auth: {
    signin: `${config.apiUrl}/api/v1/auth/signin`,
    signup: `${config.apiUrl}/api/v1/auth/signup`
  },
  base: `${config.apiUrl}/api/v1`
}
