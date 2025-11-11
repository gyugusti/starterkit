import Credentials from 'next-auth/providers/credentials'

import getUniqueValues from '@/utils/getUniqueValues'

const credentialsProvider = Credentials({
  name: 'Credentials',
  credentials: {
    username: { label: 'Username', type: 'text' },
    password: { label: 'Password', type: 'password' }
  },
  async authorize(credentials) {
    const username = credentials?.username?.trim()
    const password = credentials?.password

    if (!username || !password) {
      throw new Error('Please provide both username and password')
    }

    const response = await fetch('http://infara-backend.test/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Unable to reach authentication service')
    }

    const json = await response.json()

    if (json?.status !== 200 || !json?.response?.token) {
      throw new Error(json?.keterangan || 'Login failed. Please try again.')
    }

    const user = json.response
    const accessLevels = getUniqueValues(user?.akses_inspeksi, 'nama')
    const expiresAt = Number(user?.expired_token ?? Date.now())

    return {
      id: String(user?.id ?? user?.username ?? username),
      name: user?.nama ?? user?.name ?? user?.username ?? username,
      email: user?.email ?? null,
      username: user?.username ?? username,
      token: user.token,
      expired_token: Number.isFinite(expiresAt) ? expiresAt : Date.now(),
      level: accessLevels,
      raw: user
    }
  }
})

export const authOptions = {
  providers: [credentialsProvider],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const accessTokenExpires = Number.isFinite(user.expired_token)
          ? user.expired_token
          : Date.now()

        token.accessToken = user.token
        token.accessTokenExpires = accessTokenExpires
        token.level = user.level ?? []
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          level: user.level ?? [],
          raw: user.raw
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          ...token.user,
          level: token.level ?? []
        }
      }

      if (token?.accessToken) {
        session.accessToken = token.accessToken
        session.accessTokenExpires = token.accessTokenExpires
      }

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true
}

export default authOptions
