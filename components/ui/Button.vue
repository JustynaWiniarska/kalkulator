<script setup lang="ts">

interface Props {
  as?: string
}

// eslint-disable-next-line vue/define-macros-order
withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <component
    :is="as"
    class="inline-flex items-center justify-center rounded-lg text-md py-2 px-6 font-medium  disabled:pointer-events-none disabled:opacity-50 bg-gray-100 hover:bg-gray-200 border border-input my-8"
  >
    <slot />
  </component>
</template>