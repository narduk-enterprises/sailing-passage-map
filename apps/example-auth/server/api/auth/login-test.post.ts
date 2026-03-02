import { ensureDefaultTestUser } from '../../utils/defaultTestUser'

export default defineEventHandler(async (event) => {
  const user = await ensureDefaultTestUser(event)

  const { passwordHash: _passwordHash, ...cleanUser } = user

  await setUserSession(event, { user: cleanUser })

  return { user: cleanUser }
})
