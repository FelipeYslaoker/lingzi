interface getCardParams {
  id?: string
  category?: string
  language?: string
}

export const getStudyables = async (params?: getCardParams) => {
  const result = await $http.$get('/cards/studyables', {
    params: {
      id: params?.id || undefined,
      categoryid: params?.category || undefined,
      languageid: params?.language || undefined
    }
  })
  useCardsStore().setCard(result)
  return result
}
