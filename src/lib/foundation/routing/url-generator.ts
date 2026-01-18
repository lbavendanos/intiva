/**
 * UrlGenerator class inspired by Laravel's Illuminate\Routing\UrlGenerator.
 * Implements a simplified version of the Illuminate\Contracts\Routing\UrlGenerator contract.
 *
 * @see https://github.com/illuminate/contracts/blob/12.x/Routing/UrlGenerator.php
 */
class UrlGenerator {
  /**
   * The root URL for the application.
   */
  private root: string

  /**
   * Create a new URL generator instance.
   *
   * @param {string} root - The root URL for the application.
   */
  constructor(root: string) {
    this.root = root
  }

  /**
   * Generate an absolute URL to the given path.
   *
   * @param {string} path - The path to generate the URL for.
   * @returns {URL} The generated URL.
   */
  to(path: string = '/'): URL {
    return new URL(path, this.root)
  }

  /**
   * Get the root URL for the application.
   *
   * @returns {string} The root URL.
   */
  getRoot(): string {
    return this.root
  }

  /**
   * Set the root URL for the application.
   *
   * @param {string} root - The root URL to set.
   */
  setRoot(root: string): void {
    this.root = root
  }
}

/**
 * The singleton URL generator instance.
 */
let urlGenerator: UrlGenerator | null = null

/**
 * Get the URL generator instance.
 *
 * @returns {UrlGenerator} The URL generator instance.
 * @throws {Error} If NEXT_PUBLIC_APP_URL environment variable is not defined.
 */
export function getUrlGenerator(): UrlGenerator {
  if (!urlGenerator) {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error(
        'NEXT_PUBLIC_APP_URL environment variable is not defined. Please set it in your .env file.',
      )
    }

    urlGenerator = new UrlGenerator(process.env.NEXT_PUBLIC_APP_URL)
  }

  return urlGenerator
}

/**
 * Reset the URL generator instance.
 * Useful for testing purposes.
 */
export function resetUrlGenerator(): void {
  urlGenerator = null
}

export { UrlGenerator }
