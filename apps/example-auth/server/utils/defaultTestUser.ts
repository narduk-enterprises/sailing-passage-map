import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { users } from '../database/schema'

const DEFAULT_TEST_USER = {
  email: (process.env.EXAMPLE_TEST_USER_EMAIL || 'demo@example.com').toLowerCase(),
  password: process.env.EXAMPLE_TEST_USER_PASSWORD || 'password123',
  name: process.env.EXAMPLE_TEST_USER_NAME || 'Demo User',
} as const

export function getDefaultTestUser() {
  return DEFAULT_TEST_USER
}

export async function ensureDefaultTestUser(event: H3Event) {
  const db = useDatabase(event)
  const defaultUser = getDefaultTestUser()

  let user = await db
    .select()
    .from(users)
    .where(eq(users.email, defaultUser.email))
    .get()

  if (!user) {
    const passwordHash = await hashPassword(defaultUser.password)
    const userId = crypto.randomUUID()

    await db.insert(users).values({
      id: userId,
      email: defaultUser.email,
      passwordHash,
      name: defaultUser.name,
    })

    user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get()
  }

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create default test user',
    })
  }

  if (!user.passwordHash) {
    const passwordHash = await hashPassword(defaultUser.password)

    await db
      .update(users)
      .set({
        passwordHash,
        name: user.name || defaultUser.name,
      })
      .where(eq(users.id, user.id))

    user = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .get()
  }

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load default test user',
    })
  }

  return user
}
