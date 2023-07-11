<template>
  <lingzi-card title="Notes">
    <v-row dense>
      <v-col cols="12" md="6" lg="8" xl="9">
        <v-text-field v-model="noteMessage" label="Note content" variant="outlined" density="compact" color="primary" />
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-switch
          v-model="showNoteInFront"
          inset
          label="Show note in card's front"
          density="compact"
          hide-details="auto"
          color="primary"
          flat
          class="ml-3"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group v-model="noteType" inline color="primary">
          <v-radio label="Information" value="info" />
          <v-radio label="Warning" value="warning" />
          <v-radio label="Alert" value="error" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-show="noteMessage.trim()">
        <v-alert :type="noteType" variant="tonal" class="mb-3">
          {{ noteMessage }}
        </v-alert>
      </div>
    </v-expand-transition>
    <template #actions>
      <v-btn flat @click="addNote">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </template>
    <v-expand-transition>
      <lingzi-card v-if="notesToShow.length" padding="px-2 py-1">
        <template #title>
          <v-btn class="ma-3" flat @click="showNotes = !showNotes">
            <v-expand-x-transition>
              <v-icon v-if="!showNotes">
                mdi-chevron-down
              </v-icon>
            </v-expand-x-transition>
            <v-expand-x-transition>
              <v-icon v-if="showNotes">
                mdi-chevron-up
              </v-icon>
            </v-expand-x-transition>
          </v-btn>
        </template>
        <v-expand-transition>
          <div v-show="showNotes">
            <div>
              <lingzi-draggable-list :drag-items="notes" @dragged="notes = $event">
                <template #item="{ item, index }">
                  <v-alert v-model="notes[index].show" variant="tonal" :type="item.type" class="my-1" closable>
                    {{ item.message }}
                  </v-alert>
                </template>
              </lingzi-draggable-list>
            </div>
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-show="!showNotes">
            <v-alert type="success" variant="tonal" class="my-1">
              {{ notes.length }} {{ notes.length > 1 ? 'notes' : 'note' }}
            </v-alert>
          </div>
        </v-expand-transition>
      </lingzi-card>
    </v-expand-transition>
  </lingzi-card>
</template>

<script setup lang="ts">
interface Note {
  message: string
  type: 'info' | 'warning' | 'error'
  show?: boolean
  showInFront: boolean
}
const notes: Ref<Note[]> = ref([])
const noteType: Ref<'info' | 'warning' | 'error'> = ref('info')
const noteMessage = ref('')
const showNotes = ref(false)
const showNoteInFront = ref(false)
const addNote = () => {
  if (!noteMessage.value.trim()) {
    return
  }
  notes.value.push({
    message: noteMessage.value.trim(),
    type: noteType.value,
    show: true,
    showInFront: showNoteInFront.value
  })
  console.log(useNewJsonFrom(notes.value))
  noteMessage.value = ''
  noteType.value = 'info'
}

const emit = defineEmits(['updated'])
const notesToShow = computed(() => {
  return notes.value.filter(note => note.show !== false).map(note => ({
    message: note.message.trim(),
    showInFront: note.showInFront,
    type: note.type
  }))
})
watch(notesToShow, () => {
  if (!notesToShow.value.length) {
    showNotes.value = false
  }
  emit('updated', notesToShow.value)
}, { deep: true })
</script>
