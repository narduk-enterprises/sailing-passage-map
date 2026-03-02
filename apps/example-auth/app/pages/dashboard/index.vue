<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

useSeo({
  title: 'Dashboard',
  description: 'Your account dashboard.',
})

useWebPageSchema({
  name: 'Dashboard',
  description: 'Your account dashboard.',
})

const { user, logout } = useAuth()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-bold font-display">Welcome, {{ user?.name ?? 'User' }}</h1>
      <p class="text-muted text-sm">{{ user?.email }}</p>
    </div>

    <UButton color="neutral" variant="outline" icon="i-lucide-log-out" @click="logout">
      Sign Out
    </UButton>
  </div>
</template>
