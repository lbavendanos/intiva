import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { getUrlGenerator } from '@/lib/foundation/routing/url-generator'
import {
  getTranslator,
  type Locale,
  type Replacements,
  type TranslationKeys,
} from '@/lib/foundation/translation/translator'

/**
 * Utility for constructing className strings conditionally and merging Tailwind CSS classes.
 * Combines clsx for conditional class handling with tailwind-merge for deduplication.
 *
 * @param {ClassValue[]} inputs - Class values to merge (strings, objects, arrays, or falsy values).
 * @returns {string} A single merged className string with Tailwind conflicts resolved.
 *
 * @example
 * // Simple class concatenation
 * cn('px-4', 'py-2') // 'px-4 py-2'
 *
 * @example
 * // Conditional classes with objects
 * cn('btn', { 'btn-primary': isPrimary, 'btn-disabled': isDisabled })
 *
 * @example
 * // Tailwind conflict resolution (last value wins)
 * cn('px-2', 'px-4') // 'px-4'
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500'
 *
 * @example
 * // Mixed inputs with arrays and conditionals
 * cn('base-class', ['array-class'], isActive && 'active', { 'hidden': !isVisible })
 *
 * @example
 * // Component prop merging (common pattern)
 * cn('default-styles', className) // Allows className prop to override defaults
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Generate a url for the application.
 *
 * @param {string} path - The path to generate the url for.
 * @returns {URL} Returns the generated url.
 * @throws {Error} If NEXT_PUBLIC_APP_URL environment variable is not defined.
 *
 * @example
 * // Generate base URL
 * url() // URL { href: 'http://localhost:3000/' }
 *
 * @example
 * // Generate URL with path
 * url('/products') // URL { href: 'http://localhost:3000/products' }
 *
 * @example
 * // Generate URL and manipulate query params
 * const productUrl = url('/products')
 * productUrl.searchParams.set('page', '2')
 * productUrl.toString() // 'http://localhost:3000/products?page=2'
 */
export function url(path: string = '/'): URL {
  return getUrlGenerator().to(path)
}

/**
 * Translate a given key with optional replacements.
 *
 * @param {TranslationKeys} key - The translation key to look up.
 * @param {Replacements} replacements - Optional key-value pairs for placeholder replacements.
 * @param {Locale} locale - Optional locale to use for translation.
 * @returns {string} The translated string with replacements applied.
 *
 * @example
 * // Simple translation
 * __('cart.empty') // "Your cart is empty" or "Tu carrito está vacío"
 *
 * @example
 * // Translation with replacements
 * __('cart.title', { count: 3 }) // "Cart (3)" or "Carrito (3)"
 *
 * @example
 * // Translation with string replacement
 * __('cart.item.remove', { name: 'Product Name' }) // "Remove Product Name from cart"
 *
 * @example
 * // Translation with specific locale
 * __('cart.empty', {}, 'es') // "Tu carrito está vacío"
 */
export function __(
  key: TranslationKeys,
  replacements?: Replacements,
  locale?: Locale,
): string {
  return getTranslator().get(key, replacements, locale)
}
