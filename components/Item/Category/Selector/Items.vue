<template>
  <v-sheet height="60vh" class="pa-3">
    <div>
      <v-btn variant="text" @click="goBack(true)">
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn variant="text" @click="goBack()">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
    </div>
    <div>
      <v-window v-model="selected">
        <v-window-item v-for="window in windows.pages" :key="window.window">
          <v-sheet v-if="window.window !== 0" style="user-select: none;" border class="d-flex justify-space-between align-center px-5 rounded-lg mb-3 mt-3" height="80px">
            <span class="text-h6 font-weight-bold text-truncate">{{ window.name }}</span>
          </v-sheet>
          <v-sheet v-else border class="d-flex justify-center align-center px-5 rounded-lg mb-3 mt-3" style="user-select: none;" height="80px">
            <span class="text-h6 font-weight-bold text-truncate">Categories</span>
          </v-sheet>
          <lingzi-card v-if="categories.length" rounded="lg" padding="pa-0">
            <div v-for="category, i in selectedCategorySubcategories" :key="category.id">
              <div v-if="category.subcategories?.length" :style="`${i !== selectedCategorySubcategories.length - 1 ? 'border-bottom: thin solid rgba(255, 255, 255, 0.12);' : 'border-bottom: thin solid rgba(0, 0, 0, 0.12);'} cursor: pointer; user-select: none;`" class="d-flex justify-space-between align-center py-3 px-3" @click="goToCategory(category.window || 0)">
                <span>{{ category.name }}</span>
                <v-icon>
                  mdi-chevron-right
                </v-icon>
              </div>
              <div v-else :style="`${i !== selectedCategorySubcategories.length - 1 ? 'border-bottom: thin solid rgba(255, 255, 255, 0.12);' : 'border-bottom: thin solid rgba(0, 0, 0, 0.12);'} cursor: pointer; user-select: none;`" class="d-flex justify-space-between align-center py-3 px-3" @click="select(category)">
                <span>{{ category.name }}</span>
                <v-icon color="primary">
                  done
                </v-icon>
              </div>
            </div>
          </lingzi-card>
          <v-sheet v-else class="d-flex justify-center align-center my-4 pa-2">
            <div>
              <v-img src="/resources/list.svg" max-width="200px" />
            </div>
            <div class="text-h4">
              No categories
            </div>
          </v-sheet>
          <v-btn
            v-if="window.window !== 0"
            block
            class="mt-3 text-none"
            flat
            @click="select(window)"
          >
            Select {{ window.name }}
          </v-btn>
        </v-window-item>
      </v-window>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { LingziLanguageCategory } from '@/@types/Lingzi/Language'

interface Window extends LingziLanguageCategory {
  window: number
  name?: string
}

const props = defineProps({
  categories: {
    type: Array as () => LingziLanguageCategory[],
    default: () => ([])
  }
})

const selected = ref(0)
const history = ref([0])

const windowsQuantityCalculator = (categories: LingziLanguageCategory[], initialQuantity?: number | undefined, initialWindows?: Window[] | undefined) => {
  let windows = initialQuantity || 0
  const pages = initialWindows || [{ window: 0, name: 'all' }]
  for (const category of categories) {
    if (category.subcategories?.length) {
      const result = windowsQuantityCalculator(category.subcategories, windows, pages)
      windows = result.quantity + 1
      pages.push({ window: windows, ...category })
    }
  }
  return {
    quantity: windows, pages
  }
}
const windows = computed(() => {
  const windows = windowsQuantityCalculator(props.categories)
  return windows
})
const selectedCategorySubcategories = computed(() => {
  if (selected.value === 0) {
    return windows.value.pages.filter(e => e.id?.split('-')[0] === 'category')
  }
  if (windows.value.pages) {
    const foundCategory = windows.value.pages.find(e => e.window === selected.value)
    return foundCategory?.subcategories?.map(subcategory => ({
      window: windows.value.pages.find(e => e.id === subcategory.id)?.window,
      ...subcategory
    })) || []
  }
  return []
})

const findSelectedCategoryPage = () => {
  const selectedCategory = windows.value.pages.find((category: LingziLanguageCategory) => category.id === useRoute().query.category)
  if (selectedCategory && selectedCategory.window !== 0) {
    selected.value = selectedCategory.window
  } else {
    const subCategoryFather = windows.value.pages.find((category) => {
      const subCategoryChild = category.subcategories?.find(subcategory => subcategory.id === useRoute().query.category)
      if (subCategoryChild) {
        return true
      } else {
        return false
      }
    })
    if (subCategoryFather) {
      selected.value = subCategoryFather.window
    }
  }
}

const emit = defineEmits(['selected'])
const select = (category: LingziLanguageCategory) => {
  emit('selected', category.id)
}
const goToCategory = (categoryPage: number) => {
  selected.value = categoryPage
  history.value.push(categoryPage)
}
const goBack = (begin = false) => {
  if (begin) {
    history.value = []
    selected.value = 0
  } else {
    history.value.pop()
    if (history.value.length < 1) {
      selected.value = 0
      return
    }
    selected.value = history.value[history.value.length - 1]
  }
}

onMounted(() => {
  findSelectedCategoryPage()
})
</script>
