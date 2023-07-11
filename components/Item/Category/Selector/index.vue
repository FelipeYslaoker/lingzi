<template>
  <div>
    <lingzi-card title="Category">
      <div v-if="categorySelectedId">
        <v-alert type="success" variant="tonal">
          {{ useLanguagesStore().findCategory(categorySelectedId, language.categories || [])?.name }}
        </v-alert>
      </div>
      <div v-else>
        <v-alert type="info" variant="tonal">
          No category selected
        </v-alert>
      </div>
      <lingzi-dialog v-model="selectorDialog">
        <item-category-selector-items :categories="categories" @selected="setCategory" />
        <template #actions>
          <v-btn color="red" class="text-none" flat @click="selectorDialog = false">
            Cancel
          </v-btn>
        </template>
      </lingzi-dialog>
      <template #actions>
        <v-btn
          class="text-none"
          flat
          @click="selectorDialog = true"
        >
          {{ categorySelectedId ? 'Change' : 'Select' }}
        </v-btn>
      </template>
    </lingzi-card>
  </div>
</template>

<script setup lang="ts">
import { LingziLanguage } from '@/@types/Lingzi/Language'

const language = computed(() => {
  const items = useLanguagesStore().items
  const language = items.find(language => language.id === useRoute().query.language) || {} as LingziLanguage
  return language || {} as LingziLanguage
})

const props = defineProps({
  category: {
    type: String,
    default: ''
  },
  categories: {
    type: Array as () => LingziLanguage[],
    default: () => ([])
  }
})
const categorySelectedId = ref('')
const selectorDialog = ref(false)

watch(() => props.category, () => {
  categorySelectedId.value = props.category
})

onMounted(() => {
  categorySelectedId.value = props.category
})

const emit = defineEmits(['selected'])
const setCategory = (categoryId: string) => {
  emit('selected', categoryId)
  categorySelectedId.value = categoryId
  selectorDialog.value = false
}
</script>
