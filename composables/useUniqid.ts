import uniqid from 'uniqid'

export const useUniqid = (prefix = '', suffix = ''): string => {
  const id = uniqid(prefix, suffix)
  return id
}
