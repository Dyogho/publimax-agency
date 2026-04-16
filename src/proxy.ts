import { NextResponse, type NextRequest } from 'next/server'
// import { updateSession } from '@/lib/supabase/middleware'

export default async function proxy(request: NextRequest) {
  // Comentado temporalmente para pruebas sin login
  // return await updateSession(request)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
