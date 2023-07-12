<template>
  <lingzi-card :title="loading ? 'Saving categories...' : 'Category Manager'" max-width="80vw" height="60vh" overflow-y padding="pa-0">
    <template v-if="!loading" #header>
      <v-btn outlined color="primary" rounded class="text-none ma-3" @click="addCategory">
        Add category
      </v-btn>
    </template>
    <v-sheet v-if="loading" height="60vh" color="transparent" class="d-flex justify-center align-center">
      <lingzi-loading />
    </v-sheet>
    <div v-else class="pa-3">
      <v-row dense>
        <editor-categories-items
          v-for="subcategory, i in categories"
          :id="subcategory.id || ''"
          :key="i"
          :ref="subcategory.id"
          :top-level="true"
          :index="i"
          :aria-checked="subcategory.id"
          :category-restored="subcategory"
        />
      </v-row>
    </div>
    <template v-if="!loading" #actions>
      <v-btn
        class="ma-1 text-none"
        flat
        @click="save"
      >
        Save
      </v-btn>
      <v-btn color="red" class="ma-1 text-none" flat @click="cancel">
        Cancel
      </v-btn>
    </template>
  </lingzi-card>
</template>

<script setup lang="ts">
import { LingziEditingLanguage, LingziLanguageEditingCategory } from '@/types/Lingzi/Language'

const languageId = ref(useRoute().query.language?.toString() || '')
const language = reactive(useLanguagesStore().editingItems.find(language => language.id === languageId.value) || {} as LingziEditingLanguage)
const categories = reactive(language?.categories || [])
const loading = ref(false)

const addCategory = () => {
  useLanguagesStore().createNewLanguageCategory(useRoute().query?.language?.toString() || '')
}

const emit = defineEmits(['closeCategoryEditor'])

const cancel = () => {
  useLanguagesStore().restoreDefaultItems()
  emit('closeCategoryEditor')
}

const categoryFilter = () => {
  const categoriesFiltered: LingziLanguageEditingCategory[] = []

  const extractValidSubCategories = (currentCategory: LingziLanguageEditingCategory): LingziLanguageEditingCategory => {
    const validSubcategories: LingziLanguageEditingCategory[] = []
    for (const subcategory of currentCategory.subcategories || []) {
      if (subcategory.show === false) {
        continue
      }
      if (subcategory.subcategories?.length) {
        validSubcategories.push(extractValidSubCategories(subcategory))
      } else {
        validSubcategories.push({ id: subcategory.id, name: subcategory.name, subcategories: [] })
      }
    }
    return {
      id: currentCategory.id,
      name: currentCategory.name,
      subcategories: validSubcategories
    }
  }
  for (const category of categories) {
    if (category.show === false) {
      continue
    }
    if (category.subcategories?.length) {
      categoriesFiltered.push(extractValidSubCategories(category))
    } else {
      categoriesFiltered.push(category)
    }
  }
  return categoriesFiltered
}

const save = async () => {
  loading.value = true
  try {
    await useLingzi().languages.update({
      id: language.id,
      name: language.name,
      categories: categoryFilter()
    })
  } catch (e) {
    // TODO catch error
    console.log(e)
  }
  emit('closeCategoryEditor')
  loading.value = false
}
</script>
