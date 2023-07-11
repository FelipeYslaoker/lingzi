<template>
  <div>
    <lingzi-card>
      <div class="text-h5">
        {{ card.front }}
      </div>
      <v-expand-transition>
        <div v-if="!showBack">
          <v-text-field
            v-model="answer"
            label="Type answer"
            variant="outlined"
            density="compact"
            class="mt-5"
            color="primary"
            @keyup.enter="showBack = true"
          />
        </div>
      </v-expand-transition>
      <div v-for="note, i in card.notes" :key="i">
        <v-alert v-if="note.showInFront" :type="note.type" variant="tonal">
          {{ note.message }}
        </v-alert>
      </div>
    </lingzi-card>
    <v-expand-transition>
      <div v-if="showBack">
        <lingzi-card class="mt-1">
          <div class="d-flex justify-center flex-column align-center mb-3">
            <div class="d-flex flex-wrap justify-center">
              <v-sheet v-for="letter, i in (card.back || '').split('')" :key="i" width="15px">
                {{ letter }}
              </v-sheet>
            </div>
            <div class="d-flex flex-wrap justify-center">
              <v-sheet v-for="letter, i in answer.split('')" :key="i" width="15px" :color="letter === (card.back || '')[i] ? 'green' : letter.toLocaleLowerCase() === (card.back || '')[i].toLocaleLowerCase() ? 'orange' : 'red'" class="d-flex justify-center">
                {{ letter }}
              </v-sheet>
            </div>
          </div>
          <div v-for="note, i in card.notes" :key="i">
            <v-alert v-if="!note.showInFront" class="mt-3" :type="note.type" variant="tonal">
              {{ note.message }}
            </v-alert>
          </div>
        </lingzi-card>
      </div>
    </v-expand-transition>
    <div class="mt-3 d-flex justify-center">
      <v-expand-x-transition>
        <div v-if="showBack">
          <div class="d-flex">
            <v-btn class="ma-1 text-none" flat @click="sendAnswer(true)">
              Correct ({{ nextReviewInDays }})
            </v-btn>
            <v-btn class="ma-1 text-none" flat color="red" @click="sendAnswer(false)">
              Wrong
            </v-btn>
          </div>
        </div>
      </v-expand-x-transition>
      <v-expand-x-transition>
        <div v-if="!showBack">
          <div>
            <v-btn class="ma-1 text-none" flat @click="showBack = true">
              Show back
            </v-btn>
          </div>
        </div>
      </v-expand-x-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LingziCard as Card } from '@/types/Lingzi/Card'

const props = defineProps({
  card: {
    type: Object as () => Card,
    default: () => ({} as Card)
  }
})
const answer = ref('')

const showBack = ref(false)
const emit = defineEmits(['answered'])

const sendAnswer = (isCorrect: boolean) => {
  emit('answered', isCorrect)
}

const nextReviewInDays = computed(() => {
  const interval = props.card.interval || 1
  const minimumInterval = 60 * 24
  const maximumInterval = 60 * 24 * 365
  let nextInterval
  if (props.card.correctResponses === 0) {
    nextInterval = minimumInterval
  } else if (props.card.correctResponses === 1) {
    nextInterval = 60 * 24 * 6
  } else if (props.card.correctResponses === 2) {
    nextInterval = 60 * 24 * 7
  } else {
    nextInterval = Math.min(interval * (props.card.easinessFactor || 2.5), maximumInterval)
    nextInterval = Math.max(nextInterval, minimumInterval)
  }
  return useReducedDate(Math.floor(nextInterval / 60 / 24))
})
</script>
