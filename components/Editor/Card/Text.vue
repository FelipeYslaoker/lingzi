<template>
  <div>
    <item-category-selector class="mb-2" :categories="categories" @selected="category = $event" />
    <v-expand-transition>
      <div v-if="menuToShow === 'text-editor'">
        <v-textarea
          v-model="text"
          variant="outlined"
          density="compact"
          color="primary"
          label="Source text"
          hide-details="auto"
          class="mt-3 mb-2"
        />
        <v-expand-transition>
          <div v-if="cards.length">
            <v-btn class="text-none" @click="menuToShow = 'cards-editor'">
              Extract words
            </v-btn>
          </div>
        </v-expand-transition>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-show="menuToShow === 'cards-editor'">
        <v-btn class="text-none" @click="menuToShow = 'text-editor'">
          Edit source text
        </v-btn>
        <lingzi-card v-for="card, i in cards" :key="i" class="my-3" padding="pa-0">
          <template #title>
            <v-card variant="flat" @click="card.resumeCard = !card.resumeCard">
              <div class="ma-3 d-flex justify-space-between">
                <div>
                  {{ card.target }}
                </div>
                <div>
                  <v-expand-x-transition>
                    <v-icon v-if="isCardValid(card)" color="green">
                      mdi-check
                    </v-icon>
                  </v-expand-x-transition>
                  <v-icon class="ml-3">
                    {{ card.resumeCard ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                  </v-icon>
                </div>
              </div>
            </v-card>
          </template>
          <template v-if="!card.resumeCard" #default>
            <div class="pa-3">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="card.target"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    label="Target Word"
                    hide-details="auto"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="card.example"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    label="Sentence"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="card.targetAnswer"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    label="Word translation"
                    hide-details="auto"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="card.exampleAnswer"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    label="Sentence translation"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <item-category-selector class="mt-3" :category="card.category" :categories="categories" @selected="card.category = $event" />
              <editor-card-notes class="mt-3" @updated="card.notes = $event" />
            </div>
          </template>
        </lingzi-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { LingziLanguage } from '@/types/Lingzi/Language'
import { LingziNote } from '@/types/Lingzi/Card'

const categories = computed(() => {
  const items = useLanguagesStore().items
  const language = items.find(language => language.id === useRoute().query.language) || {} as LingziLanguage
  return language?.categories || []
})

const category = ref('')

const existingWords = ref('')
const text = ref('')
const words = computed(() => {
  return Array.from(new Set(text.value.split(/\s+|(?<!\p{L})\p{P}+|\p{P}+(?!\p{L})/u).filter(word => word).map((word) => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }))).filter(word => !existingWords.value.toLowerCase().includes(word.toLowerCase())).slice(0, 50)
})

onMounted(async () => {
  try {
    existingWords.value = await useLingzi().cards.words(useRoute().query.language?.toString() || '')
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
})

interface Card {
  target: string
  targetAnswer: string
  example: string
  exampleAnswer: string
  notes: LingziNote[]
  resumeCard: boolean
  category: string
}

const cards: Ref<Card[]> = ref([])

watch(text, () => {
  cards.value = words.value.map((word) => {
    const card = cards.value.find(card => card.target === word)
    if (card) {
      return card
    } else {
      return {
        target: word,
        targetAnswer: '',
        example: '',
        exampleAnswer: '',
        notes: [] as LingziNote[],
        resumeCard: true,
        category: category.value
      }
    }
  })
})

watch(category, () => {
  cards.value = cards.value.map(card => ({
    target: card.target,
    targetAnswer: card.targetAnswer,
    example: card.example,
    exampleAnswer: card.exampleAnswer,
    notes: card.notes,
    resumeCard: card.resumeCard,
    category: card.category || category.value
  }))
})

const emit = defineEmits(['updated'])

watch(cards, () => {
  emit('updated', cards.value.map(card => ({
    category: card.category,
    target: card.target,
    targetAnswer: card.targetAnswer,
    example: card.example,
    exampleAnswer: card.exampleAnswer
  })))
})

const isCardValid = computed(() => (card: Card) => {
  if (!card.target || !card.targetAnswer || !card.category) {
    return false
  }
  if (card.example && !card.exampleAnswer) {
    return false
  }
  if (card.exampleAnswer && !card.example) {
    return false
  }
  if (!card.category) {
    return false
  }
  return true
})

const menuToShow: Ref<'text-editor' | 'cards-editor'> = ref('text-editor')
</script>
