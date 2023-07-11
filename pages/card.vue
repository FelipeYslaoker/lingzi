<template>
  <div>
    <div v-if="loading">
      <lingzi-loading />
    </div>
    <v-expand-transition>
      <div v-if="screen === 'informations' && !loading">
        <lingzi-card
          v-if="!nextCard?.id"
          display="flex"
          flex-direction="column"
          justify="center"
          align="center"
          title="Cards"
          width="500px"
        >
          <v-icon color="primary" size="70">
            mdi-check-circle
          </v-icon>
          <div class="text-h5">
            All done
          </div>
          <template #actions>
            <v-btn flat class="text-none" @click="useRouter().push('/categories?language=' + useRoute().query.language)">
              Back
            </v-btn>
          </template>
        </lingzi-card>
        <div v-else>
          <lingzi-card
            title="Cards"
            display="flex"
            flex-direction="column"
            justify="center"
            align="center"
            width="500px"
          >
            <v-icon color="primary" size="70">
              mdi-book
            </v-icon>
            <div class="text-h5">
              You have cards to study
            </div>
            <template #actions>
              <v-btn flat class="text-none ma-1" color="red" @click="useRouter().push('/categories?language=' + useRoute().query.language)">
                Back
              </v-btn>
              <v-btn flat class="text-none ma-1" @click="screenToShow = 'card'">
                Study
              </v-btn>
            </template>
          </lingzi-card>
        </div>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-if="screen === 'card' && !loading">
        <lingzi-card width="500px" title="Card">
          <item-card :card="nextCard" />
          <template #actions>
            <v-btn flat class="text-none ma-1" color="red" @click="screenToShow = 'informations'">
              Back
            </v-btn>
          </template>
        </lingzi-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)

const cards = computed(() => {
  return useCardsStore().items
})

const screenToShow: Ref<'card' | 'informations'> = ref('informations')
const screen: Ref<'card' | 'informations'> = computed(() => {
  if (nextCard.value?.id) {
    return screenToShow.value
  } else {
    return 'informations'
  }
})

const category = ref(useRoute().query.category?.toString())
const language = ref(useRoute().query.language?.toString())

onMounted(async () => {
  loading.value = true
  try {
    await useLingzi().languages.get()
    if (language && category) {
      await useLingzi().cards.getStudyables({ category: category.value, language: language.value })
      await useLingzi().cards.getQuantity({ language: language.value })
    }
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
  loading.value = false
})

const nextCard = computed(() => {
  const cardsFiltered = cards.value.filter((card) => {
    if (card.language !== language.value) {
      return false
    }
    if (card.interval === 1 || (card.consecutiveResponses || 0 > 0)) {
      return true
    }
    const intervalInMilliseconds = (card.interval || 1) * 60 * 1000
    const reviewdAtDate = new Date(card.reviewedAt || Date.now())
    const nextReviewTimestamp = reviewdAtDate.getTime() + intervalInMilliseconds
    return nextReviewTimestamp <= Date.now()
  })
  return useShuffleArray(cardsFiltered)[0]
})
</script>
