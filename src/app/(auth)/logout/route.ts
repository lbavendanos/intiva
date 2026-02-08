import { logout } from '@/actions/auth'

export async function GET(): Promise<void> {
  await logout()
}
