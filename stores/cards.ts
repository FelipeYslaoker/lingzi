import { LingziCard, LingziCardsQuantity } from 'types/Lingzi/Card'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    items: [] as LingziCard[],
    quantity: [] as LingziCardsQuantity[]
  }),
  actions: {
    setCard (items: LingziCard[]) {
      this.items = items
    },
    setQuantity (quantity: LingziCardsQuantity[]) {
      this.quantity = quantity
    }
  }
})
