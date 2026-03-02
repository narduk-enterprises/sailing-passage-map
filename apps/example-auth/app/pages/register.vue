<script setup lang="ts">
import { z } from 'zod'

useSeo({
  title: 'Create an Account',
  description: 'Sign up to get started.',
})
useWebPageSchema({
  name: 'Create an Account',
  description: 'Sign up to get started.',
})
definePageMeta({ middleware: ['guest'] })

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const state = reactive({
  name: '',
  email: '',
  password: '',
})

const { register } = useAuthApi()
const { fetch: fetchSession } = useUserSession()
const errorMsg = ref('')
const loading = ref(false)

async function onSubmit() {
  const parsed = schema.safeParse(state)
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues.map((e: { message: string }) => e.message).join('. ')
    return
  }
  errorMsg.value = ''
  loading.value = true

  try {
    await register(state)
    await fetchSession()
    await navigateTo('/dashboard/', { replace: true })
  } catch (err: unknown) {
    const error = err as { data?: { message?: string }; statusMessage?: string }
    errorMsg.value = error.data?.message || error.statusMessage || 'Failed to create account'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-8rem)]">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Create an account</h1>
          <p class="text-muted text-sm mt-1">Get started with a free account</p>
        </div>
      </template>

      <UAlert v-if="errorMsg" color="error" variant="subtle" title="Error" :description="errorMsg" class="mb-4" />

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Name">
          <UInput v-model="state.name" placeholder="John Doe" class="w-full" />
        </UFormField>

        <UFormField name="email" label="Email">
          <UInput v-model="state.email" type="email" placeholder="you@example.com" class="w-full" />
        </UFormField>

        <UFormField name="password" label="Password">
          <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" />
        </UFormField>

        <UButton type="button" color="primary" class="w-full" :loading="loading" block @click="onSubmit">
          Create Account
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Already have an account?
          <ULink to="/login" class="text-primary font-medium hover:underline">Sign in</ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>
