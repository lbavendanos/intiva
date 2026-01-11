'use client'

import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

import { Product, ProductVariant } from '@/lib/shopify/types'
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

type OptionAvailability = Record<string, Record<string, boolean>>

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

function createOptionAvailability(
  variants: ProductVariant[],
): OptionAvailability {
  const availability: OptionAvailability = {}

  variants.forEach((variant) => {
    variant.selectedOptions.forEach(({ name, value }) => {
      if (!availability[name]) {
        availability[name] = {}
      }

      if (variant.availableForSale) {
        availability[name][value] = true
      } else if (availability[name][value] === undefined) {
        availability[name][value] = false
      }
    })
  })

  return availability
}

function isOptionValueAvailable(
  optionAvailability: OptionAvailability,
  optionName: string,
  optionValue: string,
): boolean {
  return optionAvailability[optionName]?.[optionValue] ?? false
}

function findVariantBySelectedOptions(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
): ProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      ({ name, value }) => selectedOptions[name] === value,
    ),
  )
}

export function ProductForm({
  product,
  className,
  ...props
}: ProductFormProps) {
  const formSchema = useMemo(() => createFormSchema(product), [product])
  const defaultValues = useMemo(() => createDefaultValues(product), [product])

  const optionAvailability = useMemo(
    () => createOptionAvailability(product.variants),
    [product.variants],
  )

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const selectedOptions = useWatch({ control: form.control }) as Record<
    string,
    string
  >

  const selectedVariant = useMemo(
    () => findVariantBySelectedOptions(product.variants, selectedOptions),
    [product.variants, selectedOptions],
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
                    >
                      {option.values.map((value) => {
                        const optionId =
                          `${product.handle}-${option.name}-${value}`
                            .toLowerCase()
                            .replace(/\s+/g, '-')

                        const isValueAvailable = isOptionValueAvailable(
                          optionAvailability,
                          option.name,
                          value,
                        )

                        return (
                          <FieldLabel
                            key={value}
                            htmlFor={optionId}
                            className={cn(!isValueAvailable && 'opacity-50')}
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

        <Button type="submit" disabled={!isAvailableForSale} className="w-full">
          {isSoldOut ? 'Sold out' : 'Add to cart'}
        </Button>
      </FieldGroup>
    </form>
  )
}
