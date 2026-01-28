import { logout } from '@/actions/auth'

export async function GET() {
  await logout()
}

export async function POST() {
  await logout()
}
