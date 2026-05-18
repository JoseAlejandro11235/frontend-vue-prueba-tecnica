<template>
  <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p v-if="eyebrow" class="text-sm font-medium uppercase tracking-widest text-indigo-400">
        {{ eyebrow }}
      </p>
      <h1 class="text-3xl font-bold tracking-tight text-white">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 max-w-2xl text-sm text-slate-400">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
})
</script>
