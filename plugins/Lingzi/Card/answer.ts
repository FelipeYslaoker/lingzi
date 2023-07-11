interface asnwerParams {
  cardType: 'example' | 'target'
  id: string
  isCorrect: boolean
}

export const answer = async (params: asnwerParams) => {
  await $http.$post('/cards/answer', {
    body: {
      id: params.id,
      cardType: params.cardType,
      isCorrect: params.isCorrect
    }
  })
}
