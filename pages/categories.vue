<template>
  <div>
    <lingzi-centralizer v-if="!loading" width="100vw" height="100vh">
      <v-sheet width="95vw" color="transparent">
        <v-row justify="center">
          <v-col cols="12" md="6" lg="4">
            <v-expand-transition>
              <div v-show="screenToShow === 'categories'">
                <v-sheet v-if="!categories.length" color="transparent" class="d-flex align-center flex-column justify-center">
                  <lingzi-ilustration>
                    save-to-bookmarks
                  </lingzi-ilustration>
                  <span class="text-h4 mt-2 text-center">No categories</span>
                  <v-btn rounded elevation="0" color="primary" class="mt-3" @click="screenToShow = 'editor'">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-sheet>
                <div v-else>
                  <lingzi-card max-width="95vw" padding="pa-0" max-height="60vh" overflow-y title="Categories">
                    <item-category v-for="category in categories" :key="category.id" :category="category" />
                    <template #actions>
                      <v-btn class="ma-1 text-none" @click="screenToShow = 'add_card'">
                        Add cards
                      </v-btn>
                      <v-btn class="ma-1" flat @click="screenToShow = 'editor'">
                        <v-icon>
                          mdi-cogs
                        </v-icon>
                      </v-btn>
                    </template>
                  </lingzi-card>
                  <div />
                </div>
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="6" lg="4">
            <v-expand-transition>
              <div v-show="screenToShow === 'editor'">
                <editor-categories v-model="creatorDialog" @close-category-editor="screenToShow = 'categories'" />
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="6" lg="4">
            <v-expand-transition>
              <div v-show="screenToShow === 'add_card'">
                <editor-card @close-category-editor="screenToShow = 'categories'" />
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-sheet>
    </lingzi-centralizer>
  </div>
</template>

<script setup lang="ts">
import { LingziLanguage } from '@/types/Lingzi/Language'

const loading = computed(() => {
  if (typeof useGlobalDialogStore().loadingDialog.show === 'undefined') {
    return true
  }
  return useGlobalDialogStore().loadingDialog.show
})

const categories = computed(() => {
  const items = useLanguagesStore().items
  const language = items.find(language => language.id === useRoute().query.language) || {} as LingziLanguage
  return language?.categories || []
})
const creatorDialog = ref(false)
const screenToShow: Ref<'categories' | 'editor' | 'add_card'> = ref('categories')

onMounted(async () => {
  useGlobalDialogStore().loading({
    title: 'Loading categories',
    cancelable: true
  })
  try {
    await useLingzi().languages.get()
    await useLingzi().cards.getQuantity({ language: useRoute().query.language?.toString() || '' })
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
  useGlobalDialogStore().loading()
})
</script>
