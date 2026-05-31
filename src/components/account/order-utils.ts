export function getOrderUrl(order: { id: string }): string {
  return `/account/orders/${order.id.split('/').pop()}`
}
