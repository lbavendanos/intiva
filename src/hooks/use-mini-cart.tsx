'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type MiniCartContextValue = {
  isOpen: boolean
  openMiniCart: () => void
  closeMiniCart: () => void
  setIsOpen: (open: boolean) => void
}

const MiniCartContext = createContext<MiniCartContextValue | null>(null)

type MiniCartProviderProps = {
  children: ReactNode
}

export function MiniCartProvider({ children }: MiniCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openMiniCart = () => setIsOpen(true)
  const closeMiniCart = () => setIsOpen(false)

  return (
    <MiniCartContext.Provider
      value={{ isOpen, openMiniCart, closeMiniCart, setIsOpen }}
    >
      {children}
    </MiniCartContext.Provider>
  )
}

export function useMiniCart(): MiniCartContextValue {
  const context = useContext(MiniCartContext)

  if (!context) {
    throw new Error('useMiniCart must be used within a MiniCartProvider')
  }

  return context
}
