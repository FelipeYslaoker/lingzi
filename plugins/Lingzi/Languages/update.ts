import { LingziLanguage } from 'types/Lingzi/Language'

export const update = async (language: LingziLanguage) => {
  await $http.$patch('/languages', {
    body: language
  })
  await useLingzi().languages.get()
}
