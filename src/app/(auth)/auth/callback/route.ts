import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { url } from '@/lib/utils'
import { authorize } from '@/actions/auth'

export async function GET(request: NextRequest): Promise<void> {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')

  if (!code || !state) {
    redirect(url('/').toString())
  }

  await authorize(code, state)
}
