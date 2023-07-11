interface getCardParams {
  category?: string | undefined
  language?: string | undefined
}

export const getQuantity = async (params?: getCardParams) => {
  const result = await $http.$get('/cards/category-cards-quantity', {
    params: {
      categoryid: params?.category || undefined,
      languageid: params?.language || undefined
    }
  })
  useCardsStore().setQuantity(result)
  return result
}
