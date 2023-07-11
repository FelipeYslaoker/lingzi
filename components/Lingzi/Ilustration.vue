<template>
  <div>
    <v-img
      :width="width"
      :height="height"
      :src="`/ilustrations/undraw/${ilustrationId}.svg`"
    >
      <div v-show="false">
        <slot>
          web_search
        </slot>
      </div>
    </v-img>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: '200px'
  },
  height: {
    type: String,
    default: '200px'
  }
})
const ilustrationId = computed(() => {
  if (typeof document === 'undefined') {
    return 'web_search'
  } else {
    if (useSlots().default) {
      if (typeof useSlots().default()[0].children === 'string') {
        return useSlots().default()[0].children.trim().replaceAll('-', '_')
      }
    }
    return 'web_search'
  }
})
</script>
