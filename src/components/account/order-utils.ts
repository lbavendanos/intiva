export function getOrderUrl(order: { id: string }): string {
  return `/account/orders/${order.id.split('/').pop()}`
}

export function getPreviewCornerClass(index: number, total: number): string {
  if (total === 1) return 'rounded-lg'
  if (total === 2) return index === 0 ? 'rounded-l-lg' : 'rounded-r-lg'
  if (index === 0) return 'rounded-tl-lg'
  if (index === 1) return 'rounded-tr-lg'
  if (index === 2) return 'rounded-bl-lg'
  return 'rounded-br-lg'
}
