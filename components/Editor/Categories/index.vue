<template>
  <lingzi-card :title="loading ? 'Saving categories...' : 'Category Manager'" width="80vw" height="60vh" overflow-y padding="pa-0">
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
import { LingziEditingLanguage, LingziLanguageEditingCategory } from '@/@types/Lingzi/Language'

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
// extractRefsData (refs, currentCategory = { id: '', name: '', subcategories: [] }) {
//       for (const key in refs) {
//         for (const ref in refs[key]) {
//           if (!refs[key][ref].show) {
//             continue
//           }
//           const subcategory = { ...refs[key][ref].category }
//           if (Object.keys(refs[key][ref]?.$refs || {})?.length) {
//             currentCategory.subcategories.push(this.extractRefsData(refs[key][ref].$refs, { id: subcategory.id, name: subcategory.name, subcategories: [] }))
//           } else {
//             currentCategory.subcategories.push({ id: subcategory.id, name: subcategory.name, subcategories: [] })
//           }
//         }
//       }
//       return currentCategory
//     },
</script>

<!-- <script>
import uniqid from 'uniqid'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '500'
    },
    category: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showTrash: false,
      loading: false,
      show: this.value,
      error: '',
      dialogs: {
        iconSelector: false
      },
      newCategory: {
        _id: this.category._id,
        id: this.category.id || uniqid('CATEGORY-').toUpperCase(),
        name: this.category.name || '',
        subcategories: this.category.subcategories?.map(category => ({ show: true, expand: false, ...category })) || []
      },
      categoryName: ''
    }
  },
  computed: {
    trashed () {
      return (id) => {
        if (this.$refs[id]) {
          return !this.$refs[id][0].show
        }
        return false
      }
    }
  },
  watch: {
    show () {
      this.$emit('input', this.show)
    },
    value () {
      this.show = this.value
    }
  },
  methods: {
    addSubCategory () {
      this.newCategory.subcategories.push({ id: uniqid('SUBCATEGORY-').toUpperCase() })
    },
    extractRefsData (refs, currentCategory = { id: '', name: '', subcategories: [] }) {
      for (const key in refs) {
        for (const ref in refs[key]) {
          if (!refs[key][ref].show) {
            continue
          }
          const subcategory = { ...refs[key][ref].category }
          if (Object.keys(refs[key][ref]?.$refs || {})?.length) {
            currentCategory.subcategories.push(this.extractRefsData(refs[key][ref].$refs, { id: subcategory.id, name: subcategory.name, subcategories: [] }))
          } else {
            currentCategory.subcategories.push({ id: subcategory.id, name: subcategory.name, subcategories: [] })
          }
        }
      }
      return currentCategory
    },
    async done () {
      this.loading = true
      const category = this.extractRefsData(this.$refs, { id: this.newCategory.id, name: this.newCategory.name, subcategories: [] })
      try {
        if (this.newCategory._id) {
          await this.$leechineo.categories.update(this.newCategory._id, category)
        } else {
          await this.$leechineo.categories.create(category)
        }
      } catch (e) {
        this.$pushError('Falha ao ' + this.category._id ? 'salvar as alterações' : 'salvar a categoria', e)
      }
      this.show = false
      this.loading = false
      if (!this.category._id) {
        this.newCategory = {
          id: uniqid('CATEGORY-').toUpperCase(),
          name: '',
          subcategories: []
        }
      }
    }
  }
}
</script>

<style>
</style> -->
