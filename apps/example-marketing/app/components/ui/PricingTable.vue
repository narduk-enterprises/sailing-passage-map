<script setup lang="ts">
const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$0',
    description: 'The essentials to provide your best work for clients.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics'],
    mostPopular: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    priceMonthly: '$29',
    description: 'A plan that scales with your rapidly growing business.',
    features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
    mostPopular: true,
  }
]
</script>

<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-base font-semibold leading-7 text-primary">Pricing</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight font-display sm:text-5xl">Pricing plans for teams of all sizes</p>
      </div>
      <p class="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted">Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.</p>

      <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <UCard
          v-for="tier in tiers"
          :key="tier.id"
          :class="[tier.mostPopular ? 'ring-2 ring-primary' : 'ring-1 ring-default shadow-sm', 'rounded-3xl p-8 xl:p-10 transition-transform hover:-translate-y-1']"
        >
          <div class="flex items-center justify-between gap-x-4">
            <h3 :id="tier.id" :class="[tier.mostPopular ? 'text-primary' : '', 'text-lg font-semibold leading-8']">{{ tier.name }}</h3>
            <UBadge v-if="tier.mostPopular" color="primary" variant="subtle" size="sm" class="rounded-full">Most popular</UBadge>
          </div>
          <p class="mt-4 text-sm leading-6 text-muted">{{ tier.description }}</p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight">{{ tier.priceMonthly }}</span>
            <span class="text-sm font-semibold leading-6 text-muted">/month</span>
          </p>
          <UButton :to="tier.href" :color="tier.mostPopular ? 'primary' : 'neutral'" :variant="tier.mostPopular ? 'solid' : 'outline'" class="mt-6 w-full justify-center" size="lg">Buy plan</UButton>
          <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-muted">
            <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
              <UIcon name="i-lucide-check" class="size-6 flex-none text-primary" aria-hidden="true" />
              {{ feature }}
            </li>
          </ul>
        </UCard>
      </div>
    </div>
  </div>
</template>
