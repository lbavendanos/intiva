'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

import { Product } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
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
            ? `Please select a ${optionName}`
            : `Invalid ${optionName}`,
      })
      .min(1, { error: `Please select a ${optionName}` })
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

  const handleSubmit = (data: FormValues) => {
    // TODO: Implement add to cart functionality
    console.log('Form submitted:', data)
    console.log('Product:', product.id)
    console.log('Selected variant:', selectedVariant?.id)
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
              Only {selectedVariant.quantityAvailable} left in stock
            </p>
          )}

        <Button type="submit" disabled={!isAvailableForSale} className="w-full">
          {isSoldOut ? 'Sold out' : 'Add to cart'}
        </Button>
      </FieldGroup>
    </form>
  )
}
