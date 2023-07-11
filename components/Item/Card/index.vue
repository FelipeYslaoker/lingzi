<template>
  <div>
    <v-expand-transition>
      <div v-if="!loading">
        <div v-if="card.type === 'example'">
          <item-card-template-example :card="card" @answered="answer($event)" />
        </div>
        <div v-else-if="card.type === 'target'">
          <item-card-template-target :card="card" @answered="answer($event)" />
        </div>
        <div v-else>
          {{ card }}
        </div>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-if="loading" class="d-flex justify-center">
        <lingzi-loading />
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { LingziCard } from '@/types/Lingzi/Card'

const props = defineProps({
  card: {
    type: Object as () => LingziCard,
    default: () => ({} as LingziCard)
  }
})

const loading = ref(false)

const answer = async (isCorrect: boolean) => {
  loading.value = true
  const category = useRoute().query.category?.toString()
  const language = useRoute().query.language?.toString()
  try {
    await useLingzi().cards.answer({ cardType: props.card.type || 'target', id: props.card.id || '', isCorrect })
    await useLingzi().cards.getStudyables({ category, language })
    await useLingzi().cards.getQuantity({ category, language })
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
  loading.value = false
}
</script>
