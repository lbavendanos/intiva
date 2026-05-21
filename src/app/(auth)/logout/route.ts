import { logout } from '@/lib/actions/auth'

export async function GET(): Promise<void> {
  await logout()
}
