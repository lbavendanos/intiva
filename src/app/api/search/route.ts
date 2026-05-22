import { NextResponse, type NextRequest } from 'next/server'

import { searchProducts } from '@/lib/loaders/products'

const SEARCH_RESULT_LIMIT = 8
const MIN_QUERY_LENGTH = 2

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ products: [] })
  }

  const products = await searchProducts(query, SEARCH_RESULT_LIMIT)

  return NextResponse.json({ products })
}
