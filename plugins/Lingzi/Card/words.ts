export const words = async (language: string) => {
  const result = await $http.$get('/cards/words', {
    params: {
      languageid: language
    }
  })
  return result
}
