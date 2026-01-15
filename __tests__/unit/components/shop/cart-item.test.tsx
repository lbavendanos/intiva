import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CartLineItem } from '@/lib/shopify/types'
import { CartItem } from '@/components/shop/cart-item'

vi.mock('@/lib/actions/cart', () => ({
  updateCartItem: vi.fn(() => Promise.resolve({ success: true, cart: null })),
  removeFromCart: vi.fn(() => Promise.resolve({ success: true, cart: null })),
}))

const mockItem: CartLineItem = {
  id: 'gid://shopify/CartLine/1',
  quantity: 2,
  merchandise: {
    id: 'gid://shopify/ProductVariant/1',
    title: 'Small / Red',
    selectedOptions: [
      { name: 'Size', value: 'Small' },
      { name: 'Color', value: 'Red' },
    ],
    product: {
      id: 'gid://shopify/Product/1',
      title: 'Test Product',
      handle: 'test-product',
      featuredImage: {
        url: 'https://example.com/image.jpg',
        altText: 'Test image',
        width: 800,
        height: 600,
      },
    },
    price: { amount: '29.99', currencyCode: 'USD' },
    compareAtPrice: null,
  },
  cost: {
    totalAmount: { amount: '59.98', currencyCode: 'USD' },
    amountPerQuantity: { amount: '29.99', currencyCode: 'USD' },
    compareAtAmountPerQuantity: null,
  },
}

describe('CartItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.APP_LOCALE = 'en-US'
  })

  it('should render product title', () => {
    render(<CartItem item={mockItem} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('should render variant options', () => {
    render(<CartItem item={mockItem} />)

    expect(screen.getByText('Small / Red')).toBeInTheDocument()
  })

  it('should render quantity', () => {
    render(<CartItem item={mockItem} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should render total price', () => {
    render(<CartItem item={mockItem} />)

    // Price is formatted as currency
    expect(screen.getByText('$59.98')).toBeInTheDocument()
  })

  it('should render product image', () => {
    render(<CartItem item={mockItem} />)

    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
  })

  it('should render placeholder when no image', () => {
    const itemWithoutImage = {
      ...mockItem,
      merchandise: {
        ...mockItem.merchandise,
        product: {
          ...mockItem.merchandise.product,
          featuredImage: null,
        },
      },
    }

    render(<CartItem item={itemWithoutImage} />)

    expect(screen.getByText('Sin imagen')).toBeInTheDocument()
  })

  it('should have link to product page', () => {
    render(<CartItem item={mockItem} />)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/products/test-product')
  })

  it('should have remove button with accessible label', () => {
    render(<CartItem item={mockItem} />)

    const removeButton = screen.getByRole('button', {
      name: 'Eliminar Test Product del carrito',
    })
    expect(removeButton).toBeInTheDocument()
  })

  it('should have quantity control buttons', () => {
    render(<CartItem item={mockItem} />)

    expect(
      screen.getByRole('button', { name: 'Disminuir cantidad' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Aumentar cantidad' }),
    ).toBeInTheDocument()
  })

  it('should disable decrease button when quantity is 1', () => {
    const itemWithQuantityOne = {
      ...mockItem,
      quantity: 1,
    }

    render(<CartItem item={itemWithQuantityOne} />)

    const decreaseButton = screen.getByRole('button', {
      name: 'Disminuir cantidad',
    })
    expect(decreaseButton).toBeDisabled()
  })

  it('should call updateCartItem when increase button is clicked', async () => {
    const { updateCartItem } = await import('@/lib/actions/cart')
    const user = userEvent.setup()

    render(<CartItem item={mockItem} />)

    const increaseButton = screen.getByRole('button', {
      name: 'Aumentar cantidad',
    })
    await user.click(increaseButton)

    expect(updateCartItem).toHaveBeenCalledWith('gid://shopify/CartLine/1', 3)
  })

  it('should call updateCartItem when decrease button is clicked', async () => {
    const { updateCartItem } = await import('@/lib/actions/cart')
    const user = userEvent.setup()

    render(<CartItem item={mockItem} />)

    const decreaseButton = screen.getByRole('button', {
      name: 'Disminuir cantidad',
    })
    await user.click(decreaseButton)

    expect(updateCartItem).toHaveBeenCalledWith('gid://shopify/CartLine/1', 1)
  })

  it('should call removeFromCart when remove button is clicked', async () => {
    const { removeFromCart } = await import('@/lib/actions/cart')
    const user = userEvent.setup()

    render(<CartItem item={mockItem} />)

    const removeButton = screen.getByRole('button', {
      name: 'Eliminar Test Product del carrito',
    })
    await user.click(removeButton)

    expect(removeFromCart).toHaveBeenCalledWith('gid://shopify/CartLine/1')
  })
})
