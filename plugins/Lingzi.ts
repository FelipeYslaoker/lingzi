import { Card } from './Lingzi/Card'
import { Languages } from './Lingzi/Languages'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      Lingzi: () => ({
        languages: Languages,
        cards: Card
      })
    }
  }
})
