import { LingziCard } from 'types/Lingzi/Card'

export const create = async (card: LingziCard) => {
  await $http.$post('/cards', {
    body: card
  })
  await useLingzi().cards.get()
}
