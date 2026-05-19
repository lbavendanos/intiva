const PERU_DIAL_CODE = '51'
const PERU_MOBILE_LENGTH = 9

/**
 * Input mask pattern for a Peruvian mobile number (9 digits, grouped).
 * Doubles as the field placeholder. `9` is the digit slot in Inputmask syntax.
 */
export const PERU_MOBILE_MASK = '999 999 999'

/**
 * Converts a local Peruvian mobile number to E.164 format for Shopify.
 *
 * @example toE164('987 654 321') // '+51987654321'
 */
export function toE164(local: string): string {
  const digits = local.replace(/\D/g, '')

  return `+${PERU_DIAL_CODE}${digits}`
}

/**
 * Formats a stored E.164 phone number for display.
 *
 * @example formatPhoneNumber('+51987654321') // '+51 987 654 321'
 */
export function formatPhoneNumber(value?: string | null): string {
  const digits = fromE164(value)

  if (digits.length !== PERU_MOBILE_LENGTH) return digits

  const grouped = digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')

  return `+${PERU_DIAL_CODE} ${grouped}`
}

/**
 * Strips the `+51` country prefix (and any formatting) from a stored phone
 * number so it can be shown in the local-only input.
 *
 * @example fromE164('+51987654321') // '987654321'
 */
export function fromE164(value?: string | null): string {
  if (!value) return ''

  const digits = value.replace(/\D/g, '')

  if (digits.startsWith(PERU_DIAL_CODE) && digits.length > PERU_MOBILE_LENGTH) {
    return digits.slice(PERU_DIAL_CODE.length)
  }

  return digits
}
