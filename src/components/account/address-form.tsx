'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

import {
  buildCity,
  getDepartments,
  getDistricts,
  getProvinces,
  getZoneCode,
  parseAddressToUbigeo,
} from '@/lib/peru/ubigeo'
import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { createAddress, updateAddress } from '@/actions/address'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type AddressFormProps = {
  address?: CustomerAddress
  isDefault?: boolean
}

const DEPARTMENTS = getDepartments()
const APP_COUNTRY = process.env.NEXT_PUBLIC_APP_COUNTRY as string

function createFormSchema() {
  return z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string(),
    address1: z.string().min(1, __('address.address1_required')),
    address2: z.string(),
    department: z.string().min(1, __('address.department_required')),
    province: z.string().min(1, __('address.province_required')),
    district: z.string().min(1, __('address.district_required')),
    zip: z.string().min(1, __('address.zip_required')),
    phoneNumber: z.string(),
    defaultAddress: z.boolean(),
  })
}

export function AddressForm({ address, isDefault }: AddressFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)

  const formSchema = createFormSchema()
  type FormValues = z.infer<typeof formSchema>

  const initialUbigeo = parseAddressToUbigeo(address?.zoneCode, address?.city)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: address?.firstName ?? '',
      lastName: address?.lastName ?? '',
      company: address?.company ?? '',
      address1: address?.address1 ?? '',
      address2: address?.address2 ?? '',
      department: initialUbigeo.department,
      province: initialUbigeo.province,
      district: initialUbigeo.district,
      zip: address?.zip ?? '',
      phoneNumber: address?.phoneNumber ?? '',
      defaultAddress: false,
    },
  })

  const errors = form.formState.errors
  const department = useWatch({ control: form.control, name: 'department' })
  const province = useWatch({ control: form.control, name: 'province' })

  const provinces = department ? getProvinces(department) : []
  const districts =
    department && province ? getDistricts(department, province) : []

  const handleSubmit = (values: FormValues) => {
    setShowSuccess(false)

    startTransition(async () => {
      const input = {
        address: {
          firstName: values.firstName || undefined,
          lastName: values.lastName || undefined,
          company: values.company || undefined,
          address1: values.address1 || undefined,
          address2: values.address2 || undefined,
          city: buildCity(values.province, values.district),
          zoneCode: getZoneCode(values.department, values.province),
          territoryCode: APP_COUNTRY,
          zip: values.zip || undefined,
          phoneNumber: values.phoneNumber || undefined,
        },
        defaultAddress: values.defaultAddress,
      }

      const result = address
        ? await updateAddress(address.id, input)
        : await createAddress(input)

      if (!result.success) {
        form.setError('root', {
          message: result.error || __('account.error.generic'),
        })
        return
      }

      setShowSuccess(true)
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup>
        {showSuccess && (
          <Alert>
            <AlertDescription>{__('address.success')}</AlertDescription>
          </Alert>
        )}

        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel htmlFor="firstName">
              {__('address.first_name')}
            </FieldLabel>
            <Input
              id="firstName"
              aria-invalid={!!errors.firstName}
              {...form.register('firstName')}
            />
            {errors.firstName && <FieldError errors={[errors.firstName]} />}
          </Field>

          <Field data-invalid={!!errors.lastName}>
            <FieldLabel htmlFor="lastName">
              {__('address.last_name')}
            </FieldLabel>
            <Input
              id="lastName"
              aria-invalid={!!errors.lastName}
              {...form.register('lastName')}
            />
            {errors.lastName && <FieldError errors={[errors.lastName]} />}
          </Field>
        </div>

        <Field data-invalid={!!errors.company}>
          <FieldLabel htmlFor="company">{__('address.company')}</FieldLabel>
          <Input
            id="company"
            aria-invalid={!!errors.company}
            {...form.register('company')}
          />
          {errors.company && <FieldError errors={[errors.company]} />}
        </Field>

        <Field data-invalid={!!errors.address1}>
          <FieldLabel htmlFor="address1">{__('address.address1')}</FieldLabel>
          <Input
            id="address1"
            aria-invalid={!!errors.address1}
            {...form.register('address1')}
          />
          {errors.address1 && <FieldError errors={[errors.address1]} />}
        </Field>

        <Field data-invalid={!!errors.address2}>
          <FieldLabel htmlFor="address2">{__('address.address2')}</FieldLabel>
          <Input
            id="address2"
            aria-invalid={!!errors.address2}
            {...form.register('address2')}
          />
          {errors.address2 && <FieldError errors={[errors.address2]} />}
        </Field>

        <Controller
          control={form.control}
          name="department"
          render={({ field }) => (
            <Field data-invalid={!!errors.department}>
              <FieldLabel htmlFor="department">
                {__('address.department')}
              </FieldLabel>
              <Combobox
                items={DEPARTMENTS}
                value={field.value || null}
                onValueChange={(value: string | null) => {
                  field.onChange(value ?? '')
                  form.setValue('province', '', { shouldValidate: false })
                  form.setValue('district', '', { shouldValidate: false })
                }}
                autoHighlight
              >
                <ComboboxInput
                  id="department"
                  aria-invalid={!!errors.department}
                  placeholder={__('address.department_placeholder')}
                  className="w-full"
                />
                <ComboboxContent>
                  <ComboboxEmpty>{__('address.no_results')}</ComboboxEmpty>
                  <ComboboxList>
                    {(name: string) => (
                      <ComboboxItem key={name} value={name}>
                        {name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {errors.department && <FieldError errors={[errors.department]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="province"
            render={({ field }) => (
              <Field data-invalid={!!errors.province}>
                <FieldLabel htmlFor="province">
                  {__('address.province')}
                </FieldLabel>
                <Combobox
                  items={provinces}
                  value={field.value || null}
                  onValueChange={(value: string | null) => {
                    field.onChange(value ?? '')
                    form.setValue('district', '', { shouldValidate: false })
                  }}
                  disabled={!department}
                  autoHighlight
                >
                  <ComboboxInput
                    id="province"
                    aria-invalid={!!errors.province}
                    placeholder={__('address.province_placeholder')}
                    disabled={!department}
                    className="w-full"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>{__('address.no_results')}</ComboboxEmpty>
                    <ComboboxList>
                      {(name: string) => (
                        <ComboboxItem key={name} value={name}>
                          {name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {errors.province && <FieldError errors={[errors.province]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="district"
            render={({ field }) => (
              <Field data-invalid={!!errors.district}>
                <FieldLabel htmlFor="district">
                  {__('address.district')}
                </FieldLabel>
                <Combobox
                  items={districts}
                  value={field.value || null}
                  onValueChange={(value: string | null) =>
                    field.onChange(value ?? '')
                  }
                  disabled={!province}
                  autoHighlight
                >
                  <ComboboxInput
                    id="district"
                    aria-invalid={!!errors.district}
                    placeholder={__('address.district_placeholder')}
                    disabled={!province}
                    className="w-full"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>{__('address.no_results')}</ComboboxEmpty>
                    <ComboboxList>
                      {(name: string) => (
                        <ComboboxItem key={name} value={name}>
                          {name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {errors.district && <FieldError errors={[errors.district]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.zip}>
            <FieldLabel htmlFor="zip">{__('address.zip')}</FieldLabel>
            <Input
              id="zip"
              aria-invalid={!!errors.zip}
              {...form.register('zip')}
            />
            {errors.zip && <FieldError errors={[errors.zip]} />}
          </Field>

          <Field data-invalid={!!errors.phoneNumber}>
            <FieldLabel htmlFor="phoneNumber">
              {__('address.phone_number')}
            </FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              aria-invalid={!!errors.phoneNumber}
              {...form.register('phoneNumber')}
            />
            {errors.phoneNumber && <FieldError errors={[errors.phoneNumber]} />}
          </Field>
        </div>

        {!isDefault && (
          <Controller
            control={form.control}
            name="defaultAddress"
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="defaultAddress"
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
                <FieldLabel htmlFor="defaultAddress" className="font-normal">
                  {__('address.set_as_default')}
                </FieldLabel>
              </Field>
            )}
          />
        )}

        <Button type="submit" disabled={isPending}>
          {isPending
            ? __('address.saving')
            : address
              ? __('addresses.edit')
              : __('addresses.add')}
        </Button>
      </FieldGroup>
    </form>
  )
}
