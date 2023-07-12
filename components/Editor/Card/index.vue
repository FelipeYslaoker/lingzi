<template>
  <div>
    <lingzi-card
      :title="loading ? 'Saving card...' : 'Add card'"
      max-width="80vw"
      max-height="60vh"
      overflow-y
      :justify="loading ? 'center' : ''"
      :display="loading ? 'flex' : ''"
    >
      <template #header>
        <div class="px-3 py-1">
          <v-btn class="ma-1 text-none" flat :variant="screenToShow === 0 ? 'elevated' : 'outlined'" @click="screenToShow = 0">
            Add card individually
          </v-btn>
          <v-btn class="ma-1 text-none" flat :variant="screenToShow === 1 ? 'elevated' : 'outlined'" @click="screenToShow = 1">
            Add cards from text
          </v-btn>
        </div>
      </template>
      <div v-if="!loading">
        <v-window v-model="screenToShow">
          <v-window-item>
            <v-text-field v-model="card.target" color="primary" variant="outlined" density="compact" label="Target Word" />
            <!-- <v-text-field color="primary" variant="outlined" density="compact" label="Image url"></v-text-field> -->
            <v-text-field v-model="card.targetAnswer" color="primary" variant="outlined" density="compact" label="Word translation" />
            <v-text-field v-model="card.exampleAnswer" color="primary" variant="outlined" density="compact" label="Sentence" />
            <!-- <v-text-field color="primary" variant="outlined" density="compact" label="Audio"></v-text-field> -->
            <v-text-field v-model="card.example" color="primary" variant="outlined" density="compact" label="Sentence translation" />
            <editor-card-notes @updated="notes = $event" />
            <item-category-selector v-if="!loading" :categories="categories" class="pt-3" @selected="card.category = $event" />
          </v-window-item>
          <v-window-item>
            <editor-card-text @updated="cards = $event" />
          </v-window-item>
        </v-window>
      </div>
      <lingzi-loading v-else />
      <template v-if="!loading" #actions>
        <v-btn class="ma-1 text-none" :disabled="disableSaveCardButton" :variant="disableSaveCardButton ? 'outlined' : 'flat'" @click="save">
          Add
        </v-btn>
        <v-btn class="ma-1 text-none" flat color="red" @click="$emit('closeCategoryEditor')">
          Cancel
        </v-btn>
      </template>
    </lingzi-card>
  </div>
</template>

<script setup lang="ts">
import { LingziLanguage } from '@/types/Lingzi/Language'
import { LingziNote } from '@/types/Lingzi/Card'

const languageid = useRoute().query.language?.toString()
const categories = computed(() => {
  const items = useLanguagesStore().items
  const language = items.find(language => language.id === useRoute().query.language) || {} as LingziLanguage
  return language?.categories || []
})

interface Note {
  message: string
  type: 'info' | 'warning' | 'error'
  show?: boolean
  showInFront: boolean
}

const notes: Ref<Note[]> = ref([])

const emit = defineEmits(['closeCategoryEditor'])

const loading = ref(false)

const card = reactive({
  target: '',
  targetAnswer: '',
  example: '',
  exampleAnswer: '',
  category: ''
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

const resetCard = () => {
  card.category = ''
  card.example = ''
  card.exampleAnswer = ''
  card.target = ''
  card.targetAnswer = ''
  cards.value = []
  emit('closeCategoryEditor')
}

const screenToShow: Ref<0 | 1> = ref(0)

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

const isCardsValid = computed(() => {
  return cards.value.filter(card => isCardValid.value(card)).length === cards.value.length
})

const save = async () => {
  loading.value = true
  try {
    if (screenToShow.value === 0) {
      await useLingzi().cards.create({
        category: card.category,
        language: languageid || '',
        example: card.example && card.exampleAnswer
          ? {
              front: card.example,
              back: card.exampleAnswer
            }
          : undefined,
        target: {
          front: card.target,
          back: card.targetAnswer
        },
        notes: notes.value
      })
    } else {
      for (const _card of cards.value) {
        await useLingzi().cards.create({
          category: _card.category,
          language: languageid || '',
          example: _card.example && _card.exampleAnswer
            ? {
                front: _card.example,
                back: _card.exampleAnswer
              }
            : undefined,
          target: {
            front: _card.target,
            back: _card.targetAnswer
          },
          notes: _card.notes
        })
      }
    }
    await useLingzi().cards.getQuantity({ language: languageid })
    resetCard()
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
  loading.value = false
}

const disableSaveCardButton: Ref<boolean> = computed(() => {
  console.log(isCardsValid.value)
  if (screenToShow.value === 0) {
    if (!card.target || !card.targetAnswer || !card.category) {
      return true
    }
    if (card.example && !card.exampleAnswer) {
      return true
    }
    if (card.exampleAnswer && !card.example) {
      return true
    }
    return false
  } else {
    if (!isCardsValid.value || !cards.value.length) {
      return true
    }
    return false
  }
})

</script>
