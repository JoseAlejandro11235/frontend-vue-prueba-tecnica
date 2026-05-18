<template>
  <div
    v-if="message"
    :class="[
      'mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
      variantClasses,
    ]"
    role="alert"
  >
    <span class="mt-0.5 shrink-0 text-base" aria-hidden="true">{{ icon }}</span>
    <p class="flex-1 leading-relaxed">{{ message }}</p>
    <button
      v-if="dismissible"
      type="button"
      class="shrink-0 text-slate-400 hover:text-slate-200"
      aria-label="Cerrar"
      @click="$emit('dismiss')"
    >
      Ã—
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  variant: { type: String, default: 'error' },
  dismissible: { type: Boolean, default: false },
})

defineEmits(['dismiss'])

const variantClasses = computed(() => {
  if (props.variant === 'success') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
  }
  if (props.variant === 'info') {
    return 'border-sky-500/30 bg-sky-500/10 text-sky-200'
  }
  return 'border-rose-500/30 bg-rose-500/10 text-rose-200'
})

const icon = computed(() => {
  if (props.variant === 'success') return 'âœ“'
  if (props.variant === 'info') return 'â„¹'
  return '!'
})
</script>
