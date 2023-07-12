<template>
  <v-col v-if="!(category?.show === false)" cols="12">
    <lingzi-card padding="pa-0">
      <template #title>
        <div class="d-flex align-center overflow-x-auto">
          <v-btn
            flat
            class="text-none ma-3"
            @click="expand = !expand"
          >
            {{ expand ? 'Ver menos' : 'Expandir' }}
          </v-btn>
          <v-expand-x-transition>
            <v-sheet v-if="!expand" class="text-h6 overflow-y-hidden" max-width="80%" height="40px">
              <div>
                {{ category?.name || (category?.id?.includes('subcategory') ? 'Subcategory ' : 'Category ') + (index + 1) }}
              </div>
            </v-sheet>
          </v-expand-x-transition>
        </div>
      </template>
      <v-expand-transition>
        <div v-show="expand">
          <div class="pa-3">
            <v-text-field v-model="categoryName" variant="outlined" density="compact" :label="`Name (${(category?.id?.includes('subcategory') ? 'Subcategory ' : 'Category ') + (index + 1)})`" color="primary" />
            <div v-for="subcategory, i in category?.subcategories" :key="i">
              <editor-categories-items
                :id="subcategory.id || ''"
                :ref="subcategory.id"
                :index="i"
                :category-restored="subcategory"
              />
            </div>
          </div>
        </div>
      </v-expand-transition>
      <template v-if="expand" #actions>
        <v-btn class="ma-1 text-none" flat @click="addSubcategory">
          Add subcategory
        </v-btn>
        <v-btn color="red" class="ma-1 text-none" flat @click="removeCategory">
          Remove category
        </v-btn>
      </template>
    </lingzi-card>
  </v-col>
</template>

<script setup lang="ts">
import { LingziLanguageEditingCategory, LingziEditingLanguage } from '@/types/Lingzi/Language'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  topLevel: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    required: true
  }
})
const languageId = ref(useRoute().query.language?.toString() || '')
const language = reactive(useLanguagesStore().editingItems.find(language => language.id === languageId.value) || {} as LingziEditingLanguage)
const categories = reactive(language?.categories || [] as LingziLanguageEditingCategory[])
const category = useLanguagesStore().findCategory(props.id, categories)
const expand = ref(false)

const categoryName = ref(category?.name || '')

watch(categoryName, () => {
  useLanguagesStore().updateCategoryName(languageId.value, category?.id || '', categoryName.value)
})
const addSubcategory = () => {
  useLanguagesStore().addSubcategory(languageId.value, props.id)
}
const removeCategory = () => {
  useLanguagesStore().deleteCategory(languageId.value, props.id)
}
</script>
