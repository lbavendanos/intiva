import en from '@/lang/en.json'
import es from '@/lang/es.json'

type Locale = 'en' | 'es'

type TranslationKeys = keyof typeof en

type Replacements = Record<string, string | number>

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  es,
}

/**
 * Get the current locale from the environment variable.
 *
 * @returns {Locale} The current locale.
 */
export function getLocale(): Locale {
  const locale = process.env.NEXT_PUBLIC_APP_LOCALE

  if (locale === 'es' || locale === 'es-ES' || locale?.startsWith('es-')) {
    return 'es'
  }

  return 'en'
}

/**
 * Get the dictionary for a specific locale.
 *
 * @param {Locale} locale - The locale to get the dictionary for.
 * @returns {Record<string, string>} The dictionary for the locale.
 */
export function getDictionary(locale?: Locale): Record<string, string> {
  return dictionaries[locale ?? getLocale()]
}

/**
 * Translate a given key with optional replacements.
 * Similar to Laravel's __() helper function.
 *
 * @param {TranslationKeys} key - The translation key to look up.
 * @param {Replacements} replacements - Optional key-value pairs for placeholder replacements.
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
 */
export function __(key: TranslationKeys, replacements?: Replacements): string {
  const dictionary = getDictionary()
  let translation = dictionary[key] ?? key

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      translation = translation.replace(
        new RegExp(`:${placeholder}`, 'g'),
        String(value),
      )
    })
  }

  return translation
}
