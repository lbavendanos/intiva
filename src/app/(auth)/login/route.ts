import { login } from '@/actions/auth'

export async function GET(): Promise<void> {
  await login()
}
