<template>
  <v-dialog
    v-model="show"
    max-width="500"
    scrollable
    content-class="rounded-lg"
  >
    <lingzi-card :title="dialogData.title">
      <v-sheet v-if="dialogData.content || dialogData.icon" border rounded="lg" class="d-flex justify-center flex-column align-center pa-3">
        <v-icon v-if="dialogData.icon" :color="dialogData.color || 'white'" size="50">
          {{ dialogData.icon }}
        </v-icon>
        <div v-if="dialogData.content" :class="`${dialogData.color || 'white'}--text text-center my-3`">
          {{ dialogData.content }}
        </div>
      </v-sheet>
      <template #actions>
        <v-btn class="text-none" @click="show = false">
          OK
        </v-btn>
      </template>
    </lingzi-card>
  </v-dialog>
</template>

<script setup lang="ts">

const show = ref(false)

const showDialogState = computed(() => {
  return useGlobalDialogStore().global.show
})
const dialogData = computed(() => {
  return useGlobalDialogStore().global
})

watch(show, (value) => {
  if (!value) {
    useGlobalDialogStore().setGlobalDialog({
      title: '',
      color: '',
      content: '',
      icon: '',
      show: false
    })
  }
})
watch(showDialogState, () => {
  show.value = showDialogState.value
})
</script>
