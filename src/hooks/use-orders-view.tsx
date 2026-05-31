'use client'

import { useSyncExternalStore } from 'react'

export type OrdersView = 'gallery' | 'list'

const STORAGE_KEY = 'intiva.orders-view'
const DEFAULT_VIEW: OrdersView = 'gallery'

function isOrdersView(value: unknown): value is OrdersView {
  return value === 'gallery' || value === 'list'
}

function getSnapshot(): OrdersView {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isOrdersView(stored) ? stored : DEFAULT_VIEW
  } catch {
    return DEFAULT_VIEW
  }
}

function getServerSnapshot(): OrdersView {
  return DEFAULT_VIEW
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange)
  return () => window.removeEventListener('storage', onStoreChange)
}

export function useOrdersView(): {
  view: OrdersView
  setView: (view: OrdersView) => void
} {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setView = (next: OrdersView) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
      // 'storage' event only fires across tabs; dispatch manually for same-tab updates.
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    } catch {
      // Ignore storage errors (private mode, quota, etc.)
    }
  }

  return { view, setView }
}
