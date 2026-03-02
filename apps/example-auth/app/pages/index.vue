<script setup lang="ts">
useSeo({
  title: 'Authentication Example',
  description: 'Login, registration, and session management using Web Crypto and D1.',
})

useWebPageSchema({
  name: 'Authentication Example',
  description: 'Login, registration, and session management using Web Crypto and D1.',
})
definePageMeta({ middleware: ['guest'] })

const { loginAsTestUser } = useAuthApi()
const { fetch: fetchSession } = useUserSession()
const demoLoading = ref(false)
const demoError = ref('')

async function onDemoLogin() {
  demoError.value = ''
  demoLoading.value = true

  try {
    await loginAsTestUser()
    await fetchSession()
    await navigateTo('/dashboard/', { replace: true })
  } catch (err: unknown) {
    const error = err as { data?: { message?: string } }
    demoError.value = error.data?.message || 'Unable to sign in with demo user'
  } finally {
    demoLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
    <div class="text-center space-y-4">
      <div class="p-4 rounded-2xl bg-primary/10 text-primary inline-block">
        <UIcon name="i-lucide-lock" class="size-12" />
      </div>
      <h1 class="font-display text-4xl font-bold">Authentication</h1>
      <p class="text-muted max-w-md">
        Web Crypto PBKDF2 password hashing, D1 session storage, and CSRF-protected API routes.
      </p>
    </div>

    <UAlert v-if="demoError" color="error" variant="subtle" title="Error" :description="demoError" class="w-full max-w-md" />

    <div class="flex items-center gap-4">
      <UButton to="/login" size="lg" icon="i-lucide-log-in">
        Sign In
      </UButton>
      <UButton to="/register" size="lg" variant="outline" color="neutral" icon="i-lucide-user-plus">
        Create Account
      </UButton>
      <UButton
        size="lg"
        color="neutral"
        variant="soft"
        icon="i-lucide-zap"
        :loading="demoLoading"
        @click="onDemoLogin"
      >
        Try Demo User
      </UButton>
    </div>
  </div>
</template>
