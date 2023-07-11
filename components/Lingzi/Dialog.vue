<script setup lang="ts">
const emit = defineEmits(['input'])
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: String,
    default: '500'
  },
  maxHeight: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const show = ref(props.value)

watch(show, () => {
  emit('input', show)
})
watch(() => props.value, () => {
  show.value = props.value
})
</script>

<template>
  <v-dialog
    v-model="show"
    :max-width="maxWidth"
    scrollable
    content-class="rounded-lg"
    :persistent="persistent"
  >
    <lingzi-card
      :title="title"
      :padding="padding"
      :max-height="maxHeight"
      overflow-y
    >
      <template
        v-if="$slots.title"
        #title
      >
        <slot name="title" />
      </template>
      <div v-if="useSlots().default">
        <slot />
      </div>
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>
    </lingzi-card>
  </v-dialog>
</template>

<style>
.v-overlay__scrim {
  background: rgb(0,0,0) !important;
}
</style>
