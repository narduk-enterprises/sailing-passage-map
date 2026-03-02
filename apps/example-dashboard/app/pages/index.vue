<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

useSeo({
  title: 'Dashboard Overview',
  description: 'Your personal dashboard area.',
})

useWebPageSchema({
  name: 'Dashboard Overview',
  description: 'Your personal dashboard area.',
})

const { user } = useAuth()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold font-display">Welcome back, {{ user?.name || 'User' }}</h1>
      <p class="text-muted text-sm mt-1">Here's what's happening today.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 text-primary rounded-lg">
            <UIcon name="i-lucide-users" class="size-6" />
          </div>
          <div>
            <p class="text-sm text-muted font-medium">Total Users</p>
            <p class="text-2xl font-bold">1,482</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 text-primary rounded-lg">
            <UIcon name="i-lucide-activity" class="size-6" />
          </div>
          <div>
            <p class="text-sm text-muted font-medium">Active Sessions</p>
            <p class="text-2xl font-bold">42</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 text-primary rounded-lg">
            <UIcon name="i-lucide-credit-card" class="size-6" />
          </div>
          <div>
            <p class="text-sm text-muted font-medium">Monthly Revenue</p>
            <p class="text-2xl font-bold">$12k</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Recent Activity</h2>
      </template>
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between py-2 border-b border-default last:border-0 last:pb-0">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-elevated flex items-center justify-center">
              <UIcon name="i-lucide-user" class="size-4 text-muted" />
            </div>
            <div>
              <p class="text-sm font-medium">User logged in</p>
              <p class="text-xs text-muted">{{ i * 12 }} minutes ago</p>
            </div>
          </div>
          <UBadge variant="subtle" color="success">Success</UBadge>
        </div>
      </div>
    </UCard>
  </div>
</template>
