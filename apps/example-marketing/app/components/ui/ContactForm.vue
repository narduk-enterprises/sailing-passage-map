<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)

async function onSubmit() {
  loading.value = true
  success.value = false
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  success.value = true
  await nextTick()
  state.firstName = ''
  state.lastName = ''
  state.email = ''
  state.message = ''
}
</script>

<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl font-display">Contact sales</h2>
        <p class="mt-2 text-lg leading-8 text-muted">Aute magna irure deserunt veniam aliqua magna enim voluptate.</p>
      </div>

      <div class="mx-auto mt-16 max-w-xl">
        <div v-if="success" data-testid="contact-success" class="mb-8">
          <UAlert color="success" variant="subtle" title="Success" description="Your message has been sent successfully." />
        </div>

        <UForm :schema="schema" :state="state" class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2" @submit="onSubmit">
          <UFormField name="firstName" label="First name" class="sm:col-span-1">
            <UInput v-model="state.firstName" class="w-full" />
          </UFormField>

          <UFormField name="lastName" label="Last name" class="sm:col-span-1">
            <UInput v-model="state.lastName" class="w-full" />
          </UFormField>

          <UFormField name="email" label="Email" class="sm:col-span-2">
            <UInput v-model="state.email" type="email" class="w-full" />
          </UFormField>

          <UFormField name="message" label="Message" class="sm:col-span-2">
            <UTextarea v-model="state.message" :rows="4" class="w-full" />
          </UFormField>

          <div class="sm:col-span-2">
            <UButton type="submit" color="primary" block size="lg" :loading="loading">
              Let's talk
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>
