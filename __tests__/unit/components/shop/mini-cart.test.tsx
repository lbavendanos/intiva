import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Cart } from '@/lib/shopify/types'
import { MiniCart } from '@/components/shop/mini-cart'

vi.mock('@/lib/actions/cart', () => ({
  updateCartItem: vi.fn(() => Promise.resolve({ success: true, cart: null })),
  removeFromCart: vi.fn(() => Promise.resolve({ success: true, cart: null })),
}))

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

describe('MiniCart', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_LOCALE = 'en-US'
    vi.clearAllMocks()
  })

  it('should render cart button', () => {
    render(<MiniCart cart={null} />)

    const cartButton = screen.getByTestId('cart-button')
    expect(cartButton).toBeInTheDocument()
  })

  it('should have accessible label with item count', () => {
    render(<MiniCart cart={mockCart} />)

    const cartButton = screen.getByRole('button', {
      name: 'Carrito de compras, 3 artículos',
    })
    expect(cartButton).toBeInTheDocument()
  })

  it('should show item count badge when cart has items', () => {
    render(<MiniCart cart={mockCart} />)

    const badge = screen.getByTestId('cart-count')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('3')
  })

  it('should not show badge when cart is empty', () => {
    render(<MiniCart cart={null} />)

    expect(screen.queryByTestId('cart-count')).not.toBeInTheDocument()
  })

  it('should show 99+ when item count exceeds 99', () => {
    const largeCart = {
      ...mockCart,
      totalQuantity: 150,
    }

    render(<MiniCart cart={largeCart} />)

    const badge = screen.getByTestId('cart-count')
    expect(badge).toHaveTextContent('99+')
  })

  it('should open sheet when cart button is clicked', async () => {
    const user = userEvent.setup()

    render(<MiniCart cart={mockCart} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Carrito (3)')).toBeInTheDocument()
  })

  it('should show empty cart message when cart is null', async () => {
    const user = userEvent.setup()

    render(<MiniCart cart={null} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('should show empty cart message when cart has no lines', async () => {
    const user = userEvent.setup()
    const emptyCart: Cart = {
      ...mockCart,
      totalQuantity: 0,
      lines: [],
    }

    render(<MiniCart cart={emptyCart} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('should show continue shopping button when empty', async () => {
    const user = userEvent.setup()

    render(<MiniCart cart={null} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    expect(
      screen.getByRole('button', { name: 'Continuar comprando' }),
    ).toBeInTheDocument()
  })

  it('should render cart items when cart has lines', async () => {
    const user = userEvent.setup()

    render(<MiniCart cart={mockCart} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    expect(screen.getByTestId('cart-items')).toBeInTheDocument()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
  })

  it('should render cart summary when cart has items', async () => {
    const user = userEvent.setup()

    render(<MiniCart cart={mockCart} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    expect(screen.getByTestId('cart-summary')).toBeInTheDocument()
  })

  it('should close sheet when continue shopping is clicked', async () => {
    const user = userEvent.setup()

    render(<MiniCart cart={null} />)

    const cartButton = screen.getByTestId('cart-button')
    await user.click(cartButton)

    const continueButton = screen.getByRole('button', {
      name: 'Continuar comprando',
    })
    await user.click(continueButton)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
