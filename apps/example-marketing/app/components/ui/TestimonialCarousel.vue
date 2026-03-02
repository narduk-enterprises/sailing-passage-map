<script setup lang="ts">
const testimonials = [
  {
    body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam commodi tempore fugit dicta.',
    author: {
      name: 'Michael Foster',
      handle: 'michaelfoster',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Voluptates enim voluptatem quo aut corrupti.',
    author: {
      name: 'Dries Vincent',
      handle: 'driesvincent',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  }
]
</script>

<template>
  <div class="py-24 sm:py-32 bg-elevated/50">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-xl text-center">
        <h2 class="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight font-display sm:text-4xl">We have worked with thousands of amazing people</p>
      </div>
      <div class="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="testimonial in testimonials" :key="testimonial.author.handle" class="flex flex-col justify-between">
            <template #default>
              <div class="text-muted">
                <UIcon name="i-lucide-quote" class="size-6 text-primary/40 mb-4" />
                <p class="italic text-sm">"{{ testimonial.body }}"</p>
              </div>
            </template>
            <template #footer>
              <div class="flex items-center gap-x-4">
                <UAvatar :as="{ img: 'img' }" :src="testimonial.author.imageUrl" :alt="testimonial.author.name" size="md" />
                <div>
                  <div class="font-semibold text-sm">{{ testimonial.author.name }}</div>
                  <div class="text-muted text-xs">@{{ testimonial.author.handle }}</div>
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
