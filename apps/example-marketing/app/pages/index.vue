<script setup lang="ts">
useSeo({
  title: 'Marketing Landing Page',
  description: 'Example marketing page showcasing hero, pricing, testimonials, and contact form components.',
})

useWebPageSchema({
  name: 'Marketing Landing Page',
  description: 'Example marketing page showcasing UI components.',
})
</script>

<template>
  <div>
    <NuxtLayout name="landing">
      <div class="flex flex-col">
        <HeroSection />
        <TestimonialCarousel />
        <PricingTable />
        <ContactForm />
      </div>
    </NuxtLayout>
  </div>
</template>
