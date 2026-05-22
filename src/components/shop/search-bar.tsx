'use client'

import type { SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'

import { __ } from '@/lib/utils'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

type SearchBarProps = {
  initialQuery?: string
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const router = useRouter()

  // The query lives in the URL, so submitting just navigates: the page reads
  // `?q=` on the server and renders the matching results.
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const query = String(formData.get('q') ?? '').trim()

    if (!query) {
      return
    }

    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          defaultValue={initialQuery}
          autoComplete="off"
          placeholder={__('search.placeholder')}
          aria-label={__('search.label')}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" variant="default">
            {__('search.submit')}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
