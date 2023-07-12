<template>
  <div>
    <v-expand-transition>
      <div v-if="screen === 'informations' && !loading">
        <lingzi-centralizer v-if="!nextCard?.id" width="100vw" height="100vh" class="px-3">
          <v-row v-if="!nextCard?.id" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <lingzi-card
                display="flex"
                flex-direction="column"
                justify="center"
                align="center"
                title="Cards"
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
            </v-col>
          </v-row>
        </lingzi-centralizer>
        <lingzi-centralizer v-else width="100vw" height="100vh" class="px-3">
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <div>
                <lingzi-card
                  title="Cards"
                  display="flex"
                  flex-direction="column"
                  justify="center"
                  align="center"
                >
                  <v-icon color="primary" size="70">
                    mdi-book
                  </v-icon>
                  <div class="text-h5 text-center">
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
            </v-col>
          </v-row>
        </lingzi-centralizer>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <lingzi-centralizer v-if="screen === 'card' && !loading" width="100vw" height="100vh">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <lingzi-card title="Card" class="mx-4">
              <item-card :card="nextCard" />
              <template #actions>
                <v-btn flat class="text-none ma-1" color="red" @click="screenToShow = 'informations'">
                  Back
                </v-btn>
              </template>
            </lingzi-card>
          </v-col>
        </v-row>
      </lingzi-centralizer>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
const loading = computed(() => {
  if (typeof useGlobalDialogStore().loadingDialog.show === 'undefined') {
    return true
  }
  return useGlobalDialogStore().loadingDialog.show
})

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
  useGlobalDialogStore().loading({
    title: 'Loading cards',
    cancelable: true
  })
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
  useGlobalDialogStore().loading()
})

const nextCard = computed(() => {
  return useShuffleArray(cards.value)[0]
})
</script>
