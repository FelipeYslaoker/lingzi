import { LingziEditingLanguage, LingziLanguage, LingziLanguageCategory, LingziLanguageEditingCategory } from 'types/Lingzi/Language'

export const useLanguagesStore = defineStore('languages', {
  state: () => ({
    items: [] as LingziLanguage[],
    editingItems: [] as LingziEditingLanguage[]
  }),
  actions: {
    setLanguages (languages: LingziEditingLanguage[]) {
      this.items = languages
      this.editingItems = useNewJsonFrom(languages)
    },
    createNewLanguageCategory (languageId: string | undefined) {
      const language = this.editingItems.find(language => language.id === languageId)
      if (language && language.categories) {
        language.categories.push({
          id: useUniqid('category-'),
          name: '',
          subcategories: []
        })
      }
    },
    updateCategoryName (languageId: string, categoryid: string, categoryName: string) {
      const language = this.editingItems.find(language => language.id === languageId)
      if (language && language.categories) {
        const _category = this.findCategory(categoryid, language.categories, language)
        if (_category) {
          _category.name = categoryName
        }
      }
    },
    addSubcategory (languageId: string, categoryid: string) {
      const language = this.editingItems.find(language => language.id === languageId)
      if (language && language.categories) {
        const category = this.findCategory(categoryid, language.categories, language)
        if (category) {
          category.subcategories?.push({
            id: useUniqid('subcategory-'),
            name: '',
            subcategories: []
          })
        }
      }
    },
    deleteCategory (languageId: string, categoryid: string) {
      const language = this.editingItems.find(language => language.id === languageId)
      if (language && language.categories) {
        const category = this.findCategory(categoryid, language.categories, language)
        if (category) {
          category.show = false
        }
      }
    },
    restoreDefaultItems () {
      this.editingItems = useNewJsonFrom(this.items)
    }
  },
  getters: {
    findCategory: () => (id: string, categories: LingziLanguageEditingCategory[], language?: LingziLanguage | undefined) => {
      const findCategory = (_id: string, _categories: LingziLanguageEditingCategory[] | undefined): LingziLanguageEditingCategory | null | undefined => {
        let loopcategories: LingziLanguageEditingCategory[] = _categories || []
        if (!categories?.length) {
          loopcategories = language?.categories || []
        }
        for (const category of loopcategories) {
          if (category.id === _id) {
            return category
          }
          if (category.subcategories?.length) {
            const categoryFound = findCategory(_id, category.subcategories)
            if (categoryFound?.id) {
              return categoryFound
            }
          }
        }
        return null
      }
      return findCategory(id, categories)
    },
    extractSubcategoriesIds () {
      return (category: LingziLanguageCategory, currentIds: string[] = []): string[] => {
        if (!category) {
          return []
        }
        if (!currentIds.includes(category?.id ?? '') && category.id) {
          currentIds.push(category.id)
        }
        if (category.subcategories?.length) {
          for (const subcategory of category.subcategories) {
            if (!currentIds.includes(subcategory.id ?? '')) {
              currentIds.push(subcategory.id ?? '')
            }
            if (subcategory.subcategories?.length) {
              currentIds = [...this.extractSubcategoriesIds(subcategory, currentIds)]
            }
          }
        }
        return currentIds
      }
    },
    getSubcategories (state) {
      return (categoryId: string, languageId: string) => {
        const language = state.editingItems.find(language => language.id === languageId)
        if (language) {
          const category = this.findCategory(categoryId, language?.categories || [], language)
          const subcategoriesId = this.extractSubcategoriesIds(category || {})
          return subcategoriesId
        } else {
          return []
        }
      }
    }
  }
})
