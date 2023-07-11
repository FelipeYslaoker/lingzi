import { LingziLanguage } from 'types/Lingzi/Language'

export const create = async (language: LingziLanguage) => {
  await $http.$post('/languages', {
    body: language
  })
  await useLingzi().languages.get()
}
