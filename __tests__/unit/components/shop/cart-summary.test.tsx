import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'

import { CartSummary } from '@/components/shop/cart-summary'
import type { Cart } from '@/lib/shopify/types'

const mockCart: Cart = {
  id: 'gid://shopify/Cart/123',
  checkoutUrl: 'https://store.myshopify.com/checkouts/123',
  totalQuantity: 3,
  lines: [
    {
      id: 'gid://shopify/CartLine/1',
      quantity: 2,
      merchandise: {
        id: 'gid://shopify/ProductVariant/1',
        title: 'Small',
        selectedOptions: [{ name: 'Size', value: 'Small' }],
        product: {
          id: 'gid://shopify/Product/1',
          title: 'Test Product',
          handle: 'test-product',
          featuredImage: null,
        },
        price: { amount: '29.99', currencyCode: 'USD' },
        compareAtPrice: null,
      },
      cost: {
        totalAmount: { amount: '59.98', currencyCode: 'USD' },
        amountPerQuantity: { amount: '29.99', currencyCode: 'USD' },
        compareAtAmountPerQuantity: null,
      },
    },
    {
      id: 'gid://shopify/CartLine/2',
      quantity: 1,
      merchandise: {
        id: 'gid://shopify/ProductVariant/2',
        title: 'Default',
        selectedOptions: [],
        product: {
          id: 'gid://shopify/Product/2',
          title: 'Another Product',
          handle: 'another-product',
          featuredImage: null,
        },
        price: { amount: '19.99', currencyCode: 'USD' },
        compareAtPrice: null,
      },
      cost: {
        totalAmount: { amount: '19.99', currencyCode: 'USD' },
        amountPerQuantity: { amount: '19.99', currencyCode: 'USD' },
        compareAtAmountPerQuantity: null,
      },
    },
  ],
  cost: {
    subtotalAmount: { amount: '79.97', currencyCode: 'USD' },
    totalAmount: { amount: '79.97', currencyCode: 'USD' },
  },
}

describe('CartSummary', () => {
  beforeEach(() => {
    process.env.APP_LOCALE = 'en-US'
  })

  it('should render subtotal', () => {
    render(<CartSummary cart={mockCart} />)

    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    // Both subtotal and total show $79.97
    expect(screen.getAllByText('$79.97')).toHaveLength(2)
  })

  it('should render shipping info', () => {
    render(<CartSummary cart={mockCart} />)

    expect(screen.getByText('Envío')).toBeInTheDocument()
    expect(screen.getByText('Calculado en checkout')).toBeInTheDocument()
  })

  it('should render total', () => {
    render(<CartSummary cart={mockCart} />)

    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('should render checkout button with correct link', () => {
    render(<CartSummary cart={mockCart} />)

    const checkoutLink = screen.getByRole('link', { name: 'Finalizar compra' })
    expect(checkoutLink).toBeInTheDocument()
    expect(checkoutLink).toHaveAttribute(
      'href',
      'https://store.myshopify.com/checkouts/123'
    )
  })

  it('should render tax info', () => {
    render(<CartSummary cart={mockCart} />)

    expect(
      screen.getByText('Impuestos y envío calculados en el checkout')
    ).toBeInTheDocument()
  })

  it('should have data-testid for testing', () => {
    render(<CartSummary cart={mockCart} />)

    expect(screen.getByTestId('cart-summary')).toBeInTheDocument()
  })
})
