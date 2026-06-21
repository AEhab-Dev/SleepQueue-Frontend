import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Proxy /api/* → FastAPI
  if (pathname.startsWith('/api/')) {
    const base =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
      'http://127.0.0.1:8000'

    const target = `${base}${pathname}${req.nextUrl.search ?? ''}`

    try {
      const forwarded = await fetch(target, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-host': req.nextUrl.host,
        },
        body:
          req.method !== 'GET' && req.method !== 'HEAD'
            ? await req.text()
            : undefined,
      })

      const data = await forwarded.text()

      return new NextResponse(data, {
        status: forwarded.status,
        headers: {
          'content-type':
            forwarded.headers.get('content-type') ?? 'application/json',
          'access-control-allow-origin': '*',
        },
      })
    } catch {
      return NextResponse.json(
        { error: 'Could not reach FastAPI backend' },
        { status: 502 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/(.*)',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}