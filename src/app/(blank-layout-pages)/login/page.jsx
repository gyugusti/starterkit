// Next Imports
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/options'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async () => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
