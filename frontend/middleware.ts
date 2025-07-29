import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of all supported locales
const locales = ['ar', 'fr']

// Get the preferred locale from request headers or default to 'ar'
function getLocale(request: NextRequest) {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale) return pathnameLocale

  return 'ar' // Default locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // Redirect to the same pathname with locale prefixed
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname === '/' ? '' : pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next/static files
  // - _next/image files
  // - favicon.ico
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
