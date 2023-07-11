export const upload = async (file: File, path: string, params: object) => {
  const sanitizedPath = path.replace(/\.(?=.*\.)/g, '-').replace(/-/g, '').replaceAll(' ', '').trim()
  const formData = new FormData()
  formData.append('file', file)
  const fileObject = await $http.$post('/files', {
    params: {
      path: sanitizedPath,
      ...params
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  })
  await useLeechineo().files.get()
  return fileObject
}
