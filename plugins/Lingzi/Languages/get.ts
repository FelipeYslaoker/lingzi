export const get = async (params = { id: 0 }) => {
  console.log(params)
  const result = await $http.$get('/languages', {
    params: {
      id: params.id > 0 ? params.id : undefined
    }
  })
  useLanguagesStore().setLanguages(result)
  return result
}
