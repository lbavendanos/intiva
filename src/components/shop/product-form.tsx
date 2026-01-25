'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

import type { Product } from '@/lib/shopify/types'
import { __, cn } from '@/lib/utils'
import { useMiniCart } from '@/hooks/use-mini-cart'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { addToCart } from '@/actions/cart'

type ProductFormProps = React.ComponentProps<'form'> & {
  product: Product
}

function createFormSchema(product: Product) {
  const schemaShape: Record<string, z.ZodString> = {}

  product.options.forEach((option) => {
    const optionName = option.name.toLowerCase()

    schemaShape[option.name] = z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? __('product.select_option', { option: optionName })
            : __('product.invalid_option', { option: optionName }),
      })
      .min(1, { error: __('product.select_option', { option: optionName }) })
  })

  return z.object(schemaShape)
}

function createDefaultValues(product: Product) {
  const defaults: Record<string, string> = {}

  product.options.forEach((option) => {
    if (option.values.length === 1) {
      defaults[option.name] = option.values[0]
    } else {
      defaults[option.name] = ''
    }
  })

  return defaults
}

export function ProductForm({
  product,
  className,
  ...props
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const { openMiniCart } = useMiniCart()
  const formSchema = createFormSchema(product)
  const defaultValues = createDefaultValues(product)

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const currentSelections = useWatch({ control: form.control }) as Record<
    string,
    string
  >

  const selectedVariant = product.variants.find((variant) =>
    variant.selectedOptions.every(
      ({ name, value }) => currentSelections[name] === value,
    ),
  )

  const hasRealOptions =
    product.options.length > 0 &&
    !(
      product.options.length === 1 &&
      product.options[0].name === 'Title' &&
      product.options[0].values.length === 1
    )

  const isAvailableForSale = hasRealOptions
    ? (selectedVariant?.availableForSale ?? false)
    : product.availableForSale

  const isSoldOut = hasRealOptions
    ? selectedVariant?.availableForSale === false
    : !product.availableForSale

  const checkValueAvailability = (
    optionName: string,
    optionValue: string,
  ): boolean => {
    return product.variants.some(
      (variant) =>
        variant.availableForSale &&
        variant.selectedOptions.every((option) => {
          if (option.name === optionName) {
            return option.value === optionValue
          }

          const selectedValue = currentSelections[option.name]
          return !selectedValue || selectedValue === option.value
        }),
    )
  }

  const handleSubmit = () => {
    if (!selectedVariant) return

    startTransition(async () => {
      const result = await addToCart(selectedVariant.id, 1)

      if (result.success) {
        openMiniCart()
      }
    })
  }

  return (
    <form
      id={`product-form-${product.handle}`}
      onSubmit={form.handleSubmit(handleSubmit)}
      className={className}
      {...props}
    >
      <FieldGroup>
        {hasRealOptions &&
          product.options.map((option) => (
            <Controller
              key={option.id}
              name={option.name}
              control={form.control}
              render={({ field, fieldState }) => {
                const isInvalid = fieldState.invalid

                return (
                  <FieldSet data-invalid={isInvalid}>
                    <FieldLegend variant="label">{option.name}</FieldLegend>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={isInvalid}
                      className="flex flex-wrap gap-3"
                    >
                      {option.values.map((value) => {
                        const optionId =
                          `${product.handle}-${option.name}-${value}`
                            .toLowerCase()
                            .replace(/\s+/g, '-')

                        const isValueAvailable = checkValueAvailability(
                          option.name,
                          value,
                        )

                        return (
                          <FieldLabel
                            key={value}
                            htmlFor={optionId}
                            className={cn(
                              'w-auto!',
                              !isValueAvailable && 'opacity-50',
                            )}
                          >
                            <Field
                              orientation="horizontal"
                              data-invalid={isInvalid}
                              data-unavailable={!isValueAvailable}
                            >
                              <FieldContent>
                                <FieldTitle
                                  className={cn(
                                    !isValueAvailable && 'line-through',
                                  )}
                                >
                                  {value}
                                </FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value={value}
                                id={optionId}
                                aria-invalid={isInvalid}
                                className="sr-only"
                              />
                            </Field>
                          </FieldLabel>
                        )
                      })}
                    </RadioGroup>
                    {isInvalid && <FieldError errors={[fieldState.error]} />}
                  </FieldSet>
                )
              }}
            />
          ))}

        {selectedVariant?.quantityAvailable !== null &&
          selectedVariant?.quantityAvailable !== undefined &&
          selectedVariant.quantityAvailable <= 5 &&
          selectedVariant.quantityAvailable > 0 && (
            <p className="text-sm text-amber-600">
              {__('product.stock_warning', {
                count: selectedVariant.quantityAvailable,
              })}
            </p>
          )}

        <Button
          type="submit"
          disabled={!isAvailableForSale || isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {__('product.adding')}
            </>
          ) : isSoldOut ? (
            __('product.sold_out')
          ) : (
            __('product.add_to_cart')
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
