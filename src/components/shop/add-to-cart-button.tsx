'use client'

import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  variantId: string | null
  availableForSale: boolean
  disabled?: boolean
}

export function AddToCartButton({
  variantId,
  availableForSale,
  disabled = false,
}: AddToCartButtonProps) {
  const isDisabled = disabled || !variantId || !availableForSale

  const handleAddToCart = () => {
    if (!variantId) return
    // TODO: Implement cart functionality in Phase 3
    console.log('Add to cart:', variantId)
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      disabled={isDisabled}
      onClick={handleAddToCart}
    >
      {!availableForSale
        ? 'Agotado'
        : !variantId
          ? 'Selecciona una opción'
          : 'Agregar al carrito'}
    </Button>
  )
}
