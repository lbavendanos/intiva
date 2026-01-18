import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getTranslator,
  resetTranslator,
  Translator,
} from '@/lib/foundation/translation/translator'

vi.mock('@/lang/en.json', () => ({
  default: {
    greeting: 'Hello',
    welcome: 'Welcome, :name!',
    items_count: 'You have :count items',
    'cart.title': 'Cart (:count)',
    'product.stock_warning': 'Only :count left in stock',
    simple_plural: 'item|items',
    explicit_zero: '{0} No items|{1} One item|items',
    range_plural: '[0,1] Few items|[2,10] Some items|[11,*] Many items',
    multiple_replacements: ':name has :count :item in :location',
    only_in_english: 'This is only in English',
  },
}))

vi.mock('@/lang/es.json', () => ({
  default: {
    greeting: 'Hola',
    welcome: 'Bienvenido, :name!',
    items_count: 'Tienes :count artículos',
    'cart.title': 'Carrito (:count)',
    'product.stock_warning': 'Solo quedan :count en stock',
    simple_plural: 'artículo|artículos',
    explicit_zero: '{0} Sin artículos|{1} Un artículo|artículos',
    range_plural:
      '[0,1] Pocos artículos|[2,10] Algunos artículos|[11,*] Muchos artículos',
  },
}))

type TestDictionaries = {
  en: Record<string, string>
  es: Record<string, string>
}

const testDictionaries: TestDictionaries = {
  en: {
    greeting: 'Hello',
    welcome: 'Welcome, :name!',
    items_count: 'You have :count items',
    'cart.title': 'Cart (:count)',
    'product.stock_warning': 'Only :count left in stock',
    simple_plural: 'item|items',
    explicit_zero: '{0} No items|{1} One item|items',
    range_plural: '[0,1] Few items|[2,10] Some items|[11,*] Many items',
    multiple_replacements: ':name has :count :item in :location',
    only_in_english: 'This is only in English',
  },
  es: {
    greeting: 'Hola',
    welcome: 'Bienvenido, :name!',
    items_count: 'Tienes :count artículos',
    'cart.title': 'Carrito (:count)',
    'product.stock_warning': 'Solo quedan :count en stock',
    simple_plural: 'artículo|artículos',
    explicit_zero: '{0} Sin artículos|{1} Un artículo|artículos',
    range_plural:
      '[0,1] Pocos artículos|[2,10] Algunos artículos|[11,*] Muchos artículos',
  },
}

describe('Translator', () => {
  describe('class', () => {
    describe('constructor', () => {
      it('should create instance with default locale', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.getLocale()).toBe('en')
        expect(translator.getFallback()).toBe('en')
      })

      it('should create instance with custom locale', () => {
        const translator = new Translator(testDictionaries, 'es')

        expect(translator.getLocale()).toBe('es')
      })

      it('should create instance with custom fallback', () => {
        const translator = new Translator(testDictionaries, 'es', 'en')

        expect(translator.getLocale()).toBe('es')
        expect(translator.getFallback()).toBe('en')
      })
    })

    describe('get', () => {
      it('should return translation for key', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('greeting' as never)

        expect(result).toBe('Hello')
      })

      it('should return translation for specific locale', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('greeting' as never, {}, 'es')

        expect(result).toBe('Hola')
      })

      it('should return key if translation not found', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('nonexistent.key' as never)

        expect(result).toBe('nonexistent.key')
      })

      it('should use fallback locale when translation not found', () => {
        const translator = new Translator(testDictionaries, 'es', 'en')

        const result = translator.get('only_in_english' as never)

        expect(result).toBe('This is only in English')
      })

      it('should return key when not found in current or fallback locale', () => {
        const translator = new Translator(testDictionaries, 'es', 'es')

        const result = translator.get('only_in_english' as never)

        expect(result).toBe('only_in_english')
      })

      it('should apply single replacement', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('welcome' as never, { name: 'John' })

        expect(result).toBe('Welcome, John!')
      })

      it('should apply multiple replacements', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('multiple_replacements' as never, {
          name: 'John',
          count: 5,
          item: 'apples',
          location: 'the cart',
        })

        expect(result).toBe('John has 5 apples in the cart')
      })

      it('should apply replacement with number value', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('items_count' as never, { count: 10 })

        expect(result).toBe('You have 10 items')
      })

      it('should handle nested keys', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.get('cart.title' as never, { count: 3 })

        expect(result).toBe('Cart (3)')
      })
    })

    describe('has', () => {
      it('should return true for existing key', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.has('greeting' as never)).toBe(true)
      })

      it('should return false for non-existing key', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.has('nonexistent.key' as never)).toBe(false)
      })

      it('should check in specific locale', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.has('only_in_english' as never, 'en')).toBe(true)
        expect(translator.has('only_in_english' as never, 'es')).toBe(true) // fallback
      })
    })

    describe('hasForLocale', () => {
      it('should return true for existing key in locale', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.hasForLocale('greeting' as never, 'es')).toBe(true)
      })

      it('should return false for non-existing key', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.hasForLocale('nonexistent' as never)).toBe(false)
      })
    })

    describe('choice', () => {
      it('should return singular form for 1', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('simple_plural' as never, 1)

        expect(result).toBe('item')
      })

      it('should return plural form for numbers other than 1', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.choice('simple_plural' as never, 0)).toBe('items')
        expect(translator.choice('simple_plural' as never, 2)).toBe('items')
        expect(translator.choice('simple_plural' as never, 10)).toBe('items')
      })

      it('should handle explicit zero form', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('explicit_zero' as never, 0)

        expect(result).toBe('No items')
      })

      it('should handle explicit one form', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('explicit_zero' as never, 1)

        expect(result).toBe('One item')
      })

      it('should handle range pluralization', () => {
        const translator = new Translator(testDictionaries)

        expect(translator.choice('range_plural' as never, 0)).toBe('Few items')
        expect(translator.choice('range_plural' as never, 1)).toBe('Few items')
        expect(translator.choice('range_plural' as never, 5)).toBe('Some items')
        expect(translator.choice('range_plural' as never, 10)).toBe(
          'Some items',
        )
        expect(translator.choice('range_plural' as never, 11)).toBe(
          'Many items',
        )
        expect(translator.choice('range_plural' as never, 100)).toBe(
          'Many items',
        )
      })

      it('should add count to replacements automatically', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('product.stock_warning' as never, 5)

        expect(result).toBe('Only 5 left in stock')
      })

      it('should handle array as number parameter', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('simple_plural' as never, [1, 2, 3])

        expect(result).toBe('items') // length is 3, so plural
      })

      it('should handle array with single item', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('simple_plural' as never, [1])

        expect(result).toBe('item') // length is 1, so singular
      })

      it('should apply additional replacements', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('cart.title' as never, 5, { count: 5 })

        expect(result).toBe('Cart (5)')
      })

      it('should work with specific locale', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('simple_plural' as never, 2, {}, 'es')

        expect(result).toBe('artículos')
      })

      it('should return translation without pipe as-is with count replacement', () => {
        const translator = new Translator(testDictionaries)

        const result = translator.choice('items_count' as never, 5)

        expect(result).toBe('You have 5 items')
      })
    })

    describe('getLocale / setLocale', () => {
      it('should get current locale', () => {
        const translator = new Translator(testDictionaries, 'es')

        expect(translator.getLocale()).toBe('es')
      })

      it('should set new locale', () => {
        const translator = new Translator(testDictionaries)

        translator.setLocale('es')

        expect(translator.getLocale()).toBe('es')
      })

      it('should use new locale for translations', () => {
        const translator = new Translator(testDictionaries)

        translator.setLocale('es')
        const result = translator.get('greeting' as never)

        expect(result).toBe('Hola')
      })
    })

    describe('getFallback / setFallback', () => {
      it('should get current fallback', () => {
        const translator = new Translator(testDictionaries, 'es', 'en')

        expect(translator.getFallback()).toBe('en')
      })

      it('should set new fallback', () => {
        const translator = new Translator(testDictionaries)

        translator.setFallback('es')

        expect(translator.getFallback()).toBe('es')
      })

      it('should use new fallback for missing translations', () => {
        const dictionaries = {
          en: { only_en: 'English only' },
          es: { only_es: 'Solo español' },
        }
        const translator = new Translator(
          dictionaries as TestDictionaries,
          'en',
          'es',
        )

        const result = translator.get('only_es' as never)

        expect(result).toBe('Solo español')
      })
    })
  })

  describe('getTranslator', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      resetTranslator()
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_APP_LOCALE: 'en-US',
      }
    })

    afterEach(() => {
      process.env = originalEnv
      resetTranslator()
    })

    it('should return a Translator instance', () => {
      const translator = getTranslator()

      expect(translator).toBeInstanceOf(Translator)
    })

    it('should parse en-US locale to en', () => {
      process.env.NEXT_PUBLIC_APP_LOCALE = 'en-US'

      const translator = getTranslator()

      expect(translator.getLocale()).toBe('en')
    })

    it('should parse es locale to es', () => {
      resetTranslator()
      process.env.NEXT_PUBLIC_APP_LOCALE = 'es'

      const translator = getTranslator()

      expect(translator.getLocale()).toBe('es')
    })

    it('should parse es-ES locale to es', () => {
      resetTranslator()
      process.env.NEXT_PUBLIC_APP_LOCALE = 'es-ES'

      const translator = getTranslator()

      expect(translator.getLocale()).toBe('es')
    })

    it('should parse es-MX locale to es', () => {
      resetTranslator()
      process.env.NEXT_PUBLIC_APP_LOCALE = 'es-MX'

      const translator = getTranslator()

      expect(translator.getLocale()).toBe('es')
    })

    it('should default to en for unknown locales', () => {
      resetTranslator()
      process.env.NEXT_PUBLIC_APP_LOCALE = 'fr-FR'

      const translator = getTranslator()

      expect(translator.getLocale()).toBe('en')
    })

    it('should return the same instance on subsequent calls', () => {
      const translator1 = getTranslator()
      const translator2 = getTranslator()

      expect(translator1).toBe(translator2)
    })

    it('should throw error when NEXT_PUBLIC_APP_LOCALE is not defined', () => {
      delete process.env.NEXT_PUBLIC_APP_LOCALE

      expect(() => getTranslator()).toThrow(
        'NEXT_PUBLIC_APP_LOCALE environment variable is not defined. Please set it in your .env file.',
      )
    })
  })

  describe('resetTranslator', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_APP_LOCALE: 'en-US',
      }
    })

    afterEach(() => {
      process.env = originalEnv
      resetTranslator()
    })

    it('should create a new instance after reset', () => {
      const translator1 = getTranslator()
      translator1.setLocale('es')

      resetTranslator()

      const translator2 = getTranslator()
      expect(translator2.getLocale()).toBe('en')
    })
  })
})
