<template>
  <v-sheet :width="width" :height="height" class="d-flex justify-center align-center" :color="color">
    <slot />
  </v-sheet>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    defautl: ''
  },
  padding: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'transparent'
  }
})
</script>
