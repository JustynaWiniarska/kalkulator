<script setup lang="ts">
import { Label, type LabelProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <Label
    v-bind="delegatedProps"
    class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    :class="props.class"
  >
    <slot />
  </Label>
</template>