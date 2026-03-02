<script setup lang="ts">
import { z } from 'zod'

useSeo({
  title: 'Sign In',
  description: 'Sign in to access your dashboard.',
})
useWebPageSchema({
  name: 'Sign In',
  description: 'Sign in to access your dashboard.',
})
definePageMeta({ middleware: ['guest'] })

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const state = reactive({
  email: '',
  password: '',
})

const { login, loginAsTestUser } = useAuthApi()
const { fetch: fetchSession } = useUserSession()
const errorMsg = ref('')
const loading = ref(false)
const demoLoading = ref(false)

async function onSubmit() {
  const parsed = schema.safeParse(state)
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues.map((e: { message: string }) => e.message).join('. ')
    return
  }
  errorMsg.value = ''
  loading.value = true

  try {
    await login(state)
    await fetchSession()
    await navigateTo('/dashboard/', { replace: true })
  } catch (err: unknown) {
    const error = err as { data?: { statusMessage?: string; message?: string }; statusMessage?: string; message?: string }
    errorMsg.value = error.data?.statusMessage || error.data?.message || error.statusMessage || error.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}

async function onDemoLogin() {
  errorMsg.value = ''
  demoLoading.value = true

  try {
    await loginAsTestUser()
    await fetchSession()
    await navigateTo('/dashboard/', { replace: true })
  } catch (err: unknown) {
    const error = err as { data?: { message?: string } }
    errorMsg.value = error.data?.message || 'Unable to sign in with demo user'
  } finally {
    demoLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-8rem)]">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Welcome back</h1>
          <p class="text-muted text-sm mt-1">Sign in to your account</p>
        </div>
      </template>

      <UAlert v-if="errorMsg" color="error" variant="subtle" title="Error" :description="errorMsg" class="mb-4" />

      <UAlert color="primary" variant="subtle" title="Demo account available" class="mb-4">
        <p class="text-sm">
          Use the demo button below for one-click access.
        </p>
      </UAlert>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="email" label="Email">
          <UInput v-model="state.email" type="email" placeholder="you@example.com" class="w-full" />
        </UFormField>

        <UFormField name="password" label="Password">
          <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" />
        </UFormField>

        <UButton type="button" color="primary" class="w-full" :loading="loading" block @click="onSubmit">
          Sign In
        </UButton>

        <UButton
          type="button"
          color="neutral"
          variant="soft"
          class="w-full"
          icon="i-lucide-zap"
          :loading="demoLoading"
          @click="onDemoLogin"
        >
          Sign In as Demo User
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Don't have an account?
          <ULink to="/register" class="text-primary font-medium hover:underline">Sign up</ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>
