import type { NextRequest } from 'next/server'

import { refresh } from '@/actions/auth'

export async function GET(request: NextRequest): Promise<void> {
  const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/'
  const safePath = redirectTo.startsWith('/') ? redirectTo : '/'

  await refresh(safePath)
}
