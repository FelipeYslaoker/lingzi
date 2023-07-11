<template>
  <div>
    <div class="my-2 ml-2">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex aling-center">
          <v-btn icon variant="text" size="x-small" :disabled="!category.subcategories?.length" @click="showSubcategories = !showSubcategories">
            <v-icon v-if="category.subcategories?.length">
              {{ showSubcategories ? 'mdi-minus' : 'mdi-plus' }}
            </v-icon>
          </v-btn>
          <v-btn class="text-none" variant="text" color="white" @click="useRouter().push({ path: '/card', query: { category: category.id, language: useRoute().query.language }})">
            {{ category.name }}
          </v-btn>
        </div>
        <div class="mx-3 d-flex">
          <div :class="`mx-3 d-flex flex-column align-center ${cardsQuantity.newQuantity ? 'text-blue' : 'text-disabled'}`">
            <div v-if="!category.id?.includes('subcategory')" class="text-caption">
              New
            </div>
            <div>
              {{ cardsQuantity.newQuantity }}
            </div>
          </div>
          <div :class="`mx-3 d-flex flex-column align-center ${cardsQuantity.learningQuantity ? 'text-red' : 'text-disabled'}`">
            <div v-if="!category.id?.includes('subcategory')" class="text-caption">
              Learning
            </div>
            <div>
              {{ cardsQuantity.learningQuantity }}
            </div>
          </div>
          <div :class="`mx-3 d-flex flex-column align-center ${cardsQuantity.dueQuantity ? 'text-green' : 'text-disabled'}`">
            <div v-if="!category.id?.includes('subcategory')" class="text-caption">
              Due
            </div>
            <div>
              {{ cardsQuantity.dueQuantity }}
            </div>
          </div>
        </div>
      </div>
      <v-expand-transition>
        <v-sheet v-show="showSubcategories">
          <div class="pa-1">
            <item-category-content v-for="subcategory in category.subcategories" :key="subcategory.id" :category="subcategory" />
          </div>
        </v-sheet>
      </v-expand-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LingziCardsQuantity } from '@/@types/Lingzi/Card'
import { LingziLanguageCategory } from '@/@types/Lingzi/Language'

const props = defineProps({
  category: {
    type: Object as () => LingziLanguageCategory,
    default () {
      return {} as LingziLanguageCategory
    }
  }
})

const cardsQuantity = computed(() => {
  return useCardsStore().quantity.find(quantity => quantity.category === props.category.id) || {} as LingziCardsQuantity
})

const showSubcategories = ref(false)
</script>
