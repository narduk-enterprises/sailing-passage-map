// Type augmentation for nuxt-auth-utils session
// Declares the shape of the user object stored in the sealed session cookie.
declare module '#auth-utils' {
  interface User {
    id: string
    name: string | null
    email: string
  }
}

export {}
