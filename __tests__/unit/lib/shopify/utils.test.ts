import { describe, expect, it } from 'vitest'

import { extractNodesFromEdges } from '@/lib/shopify/utils'

describe('extractNodesFromEdges', () => {
  it('should extract nodes from edges array', () => {
    const connection = {
      edges: [
        { node: { id: '1', name: 'Product 1' } },
        { node: { id: '2', name: 'Product 2' } },
      ],
    }

    const result = extractNodesFromEdges(connection)

    expect(result).toEqual([
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
    ])
  })

  it('should return empty array for undefined connection', () => {
    const result = extractNodesFromEdges(undefined)
    expect(result).toEqual([])
  })

  it('should return empty array for null connection', () => {
    const result = extractNodesFromEdges(null)
    expect(result).toEqual([])
  })

  it('should return empty array for connection without edges', () => {
    const result = extractNodesFromEdges({ edges: [] })
    expect(result).toEqual([])
  })
})
