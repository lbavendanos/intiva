import { login } from '@/actions/auth'

export async function GET(): Promise<void> {
  await login()
}

export async function POST(): Promise<void> {
  await login()
}
