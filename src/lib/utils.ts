import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import {
  getTranslator,
  type Locale,
  type Replacements,
  type TranslationKeys,
} from '@/lib/translation/translator'

/**
 * Utility for constructing className strings conditionally and merging them with Tailwind CSS classes.
 *
 * @param {ClassValue[]} inputs - The classes to add or merged.
 * @returns {string} Returns a string of class names.
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
 */
export function url(path: string = '/'): URL {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error(
      'NEXT_PUBLIC_APP_URL environment variable is not defined. Please set it in your .env file.',
    )
  }

  return new URL(path, process.env.NEXT_PUBLIC_APP_URL)
}

/**
 * Translate a given key with optional replacements.
 * Similar to Laravel's __() helper function.
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
