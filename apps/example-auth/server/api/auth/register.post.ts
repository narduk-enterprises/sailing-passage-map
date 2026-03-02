import { z } from 'zod'
import { users } from '../../database/schema'
import { eq } from 'drizzle-orm'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)
  const db = useDatabase(event)
  const normalizedEmail = body.email.toLowerCase()

  const existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail)).get()
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already in use',
    })
  }

  const hashedPassword = await hashPassword(body.password)
  const newUserId = crypto.randomUUID()

  await db.insert(users).values({
    id: newUserId,
    email: normalizedEmail,
    passwordHash: hashedPassword,
    name: body.name,
  })

  const sessionUser = { id: newUserId, name: body.name, email: normalizedEmail }

  await setUserSession(event, { user: sessionUser })

  return { user: sessionUser }
})
