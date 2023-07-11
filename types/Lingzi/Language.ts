export interface LingziLanguageCategory {
  id?: string
  name?: string
  subcategories?: LingziLanguageCategory[]
}

export interface LingziLanguageEditingCategory extends LingziLanguageCategory {
  show?: boolean,
  subcategories?: LingziLanguageEditingCategory[]
}

export interface LingziLanguage {
  _id?: string
  id?: string
  language?: string
  name?: string
  categories?: LingziLanguageCategory[]
}

export interface LingziEditingLanguage extends LingziLanguage {
  categories?: LingziLanguageEditingCategory[]
}
