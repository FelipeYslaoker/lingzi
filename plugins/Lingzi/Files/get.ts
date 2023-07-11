export const get = async () => {
  const files = await $http.$get('/files')
  useFilesStore().setFiles(files)
  return files
}
