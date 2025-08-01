// middleware.ts (in the root of your project)
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin') && 
            !req.nextUrl.pathname.startsWith('/admin/login')) {
          return token?.role === 'admin'
        }
        
        // Protect API routes (except public ones)
        if (req.nextUrl.pathname.startsWith('/api') && 
            !req.nextUrl.pathname.startsWith('/api/auth') &&
            !req.nextUrl.pathname.startsWith('/api/registrations') && 
            req.method === 'POST') {
          // Allow POST to registrations (public registration)
          if (req.nextUrl.pathname === '/api/registrations') {
            return true
          }
        }
        
        // Protect dashboard and registrations management
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/registrations')) {
          return token?.role === 'admin'
        }
        // Protect user management - only admins can access
        if (req.nextUrl.pathname.startsWith('/admin/users')) {
          return token?.role === 'admin'
        }

        // Protect user API routes - only admins can access
        if (req.nextUrl.pathname.startsWith('/api/users')) {
          return token?.role === 'admin'
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/registrations/:path*',
    '/api/dashboard/:path*',
    '/api/registrations/:path*'
  ]
}