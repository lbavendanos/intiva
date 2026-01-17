import en from '@/lang/en.json'
import es from '@/lang/es.json'

type Locale = 'en' | 'es'

type TranslationKeys = keyof typeof en

type Replacements = Record<string, string | number>

type Dictionaries = Record<Locale, Record<string, string>>

/**
 * Translator class inspired by Laravel's Illuminate\Translation\Translator.
 * Implements a simplified version of the Illuminate\Contracts\Translation\Translator contract.
 *
 * @see https://github.com/illuminate/contracts/blob/12.x/Translation/Translator.php
 */
class Translator {
  /**
   * The available translation dictionaries.
   */
  private dictionaries: Dictionaries

  /**
   * The current locale.
   */
  private locale: Locale

  /**
   * The fallback locale.
   */
  private fallback: Locale

  /**
   * Create a new translator instance.
   *
   * @param {Dictionaries} dictionaries - The translation dictionaries.
   * @param {Locale} locale - The default locale.
   * @param {Locale} fallback - The fallback locale.
   */
  constructor(
    dictionaries: Dictionaries,
    locale: Locale = 'en',
    fallback: Locale = 'en',
  ) {
    this.dictionaries = dictionaries
    this.locale = locale
    this.fallback = fallback
  }

  /**
   * Determine if a translation exists for a given locale.
   *
   * @param {TranslationKeys} key - The translation key.
   * @param {Locale} locale - The locale to check.
   * @returns {boolean} True if the translation exists.
   */
  hasForLocale(key: TranslationKeys, locale?: Locale): boolean {
    return this.get(key, {}, locale) !== key
  }

  /**
   * Determine if a translation exists.
   *
   * @param {TranslationKeys} key - The translation key.
   * @param {Locale} locale - The locale to check.
   * @returns {boolean} True if the translation exists.
   */
  has(key: TranslationKeys, locale?: Locale): boolean {
    return this.hasForLocale(key, locale)
  }

  /**
   * Get the translation for the given key.
   *
   * @param {TranslationKeys} key - The translation key.
   * @param {Replacements} replace - The replacements to apply.
   * @param {Locale} locale - The locale to use.
   * @returns {string} The translated string.
   */
  get(
    key: TranslationKeys,
    replace: Replacements = {},
    locale?: Locale,
  ): string {
    const currentLocale = locale ?? this.locale
    const dictionary = this.dictionaries[currentLocale]

    let translation = dictionary[key]

    // Try fallback locale if translation not found
    if (translation === undefined && currentLocale !== this.fallback) {
      translation = this.dictionaries[this.fallback][key]
    }

    // Return key if no translation found
    if (translation === undefined) {
      return key
    }

    return this.makeReplacements(translation, replace)
  }

  /**
   * Get a translation according to an integer value.
   *
   * @param {TranslationKeys} key - The translation key.
   * @param {number | number[]} number - The number to use for pluralization.
   * @param {Replacements} replace - The replacements to apply.
   * @param {Locale} locale - The locale to use.
   * @returns {string} The translated string.
   */
  choice(
    key: TranslationKeys,
    number: number | number[],
    replace: Replacements = {},
    locale?: Locale,
  ): string {
    const count = Array.isArray(number) ? number.length : number
    const translation = this.get(key, {}, locale)

    // If no pipe character, return the translation with replacements
    if (!translation.includes('|')) {
      return this.makeReplacements(translation, { count, ...replace })
    }

    const segments = translation.split('|')
    const line = this.selectPluralForm(segments, count)

    return this.makeReplacements(line, { count, ...replace })
  }

  /**
   * Select the proper plural form based on the given number.
   *
   * @param {string[]} segments - The translation segments.
   * @param {number} number - The number to use for selection.
   * @returns {string} The selected translation segment.
   */
  private selectPluralForm(segments: string[], number: number): string {
    // Check for explicit number matches like {0}, {1}, or ranges like [2,*]
    for (const segment of segments) {
      const match = segment.match(/^\{(\d+)\}\s*(.*)$/)
      if (match && parseInt(match[1]) === number) {
        return match[2]
      }

      const rangeMatch = segment.match(/^\[(\d+),(\d+|\*)\]\s*(.*)$/)
      if (rangeMatch) {
        const from = parseInt(rangeMatch[1])
        const to = rangeMatch[2] === '*' ? Infinity : parseInt(rangeMatch[2])
        if (number >= from && number <= to) {
          return rangeMatch[3]
        }
      }
    }

    // Simple plural forms: first for singular, second for plural
    if (segments.length === 2) {
      return number === 1 ? segments[0] : segments[1]
    }

    // Return last segment as default
    return segments[segments.length - 1]
  }

  /**
   * Make the place-holder replacements on a translation.
   *
   * @param {string} translation - The translation string.
   * @param {Replacements} replace - The replacements to apply.
   * @returns {string} The translation with replacements.
   */
  private makeReplacements(translation: string, replace: Replacements): string {
    let result = translation

    Object.entries(replace).forEach(([placeholder, value]) => {
      // Replace :placeholder format (Laravel style)
      result = result.replace(new RegExp(`:${placeholder}`, 'g'), String(value))
    })

    return result
  }

  /**
   * Get the default locale being used.
   *
   * @returns {Locale} The current locale.
   */
  getLocale(): Locale {
    return this.locale
  }

  /**
   * Set the default locale.
   *
   * @param {Locale} locale - The locale to set.
   */
  setLocale(locale: Locale): void {
    this.locale = locale
  }

  /**
   * Get the fallback locale being used.
   *
   * @returns {Locale} The fallback locale.
   */
  getFallback(): Locale {
    return this.fallback
  }

  /**
   * Set the fallback locale.
   *
   * @param {Locale} fallback - The fallback locale to set.
   */
  setFallback(fallback: Locale): void {
    this.fallback = fallback
  }
}

/**
 * Parse the locale string and return a valid Locale.
 *
 * @param {string} locale - The locale string to parse.
 * @returns {Locale} The parsed locale.
 */
function parseLocale(locale?: string): Locale {
  if (locale === 'es' || locale === 'es-ES' || locale?.startsWith('es-')) {
    return 'es'
  }

  return 'en'
}

/**
 * The singleton translator instance.
 */
let translator: Translator | null = null

/**
 * Get the translator instance.
 * The translator's locale is updated on each call to reflect the current
 * NEXT_PUBLIC_APP_LOCALE environment variable.
 *
 * @returns {Translator} The translator instance.
 */
export function getTranslator(): Translator {
  if (!translator) {
    const locale = parseLocale(process.env.NEXT_PUBLIC_APP_LOCALE)

    translator = new Translator({ en, es }, locale)
  }

  return translator
}

/**
 * Reset the translator instance.
 * Useful for testing purposes.
 */
export function resetTranslator(): void {
  translator = null
}

export { Translator, type Locale, type TranslationKeys, type Replacements }
