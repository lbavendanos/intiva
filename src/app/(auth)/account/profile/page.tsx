import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { __ } from '@/lib/utils'
import { getCustomerSession } from '@/actions/auth'
import { ProfileForm } from '@/components/account/profile-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: __('account.profile.title'),
  description: __('account.profile.description'),
}

export default async function ProfilePage() {
  const customer = await getCustomerSession()

  if (!customer) {
    redirect('/login?redirect=/account/profile')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{__('account.profile.title')}</CardTitle>
        <CardDescription>{__('account.profile.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm customer={customer} />
      </CardContent>
    </Card>
  )
}
