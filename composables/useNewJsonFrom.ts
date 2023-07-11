export const useNewJsonFrom = (json: object) => {
  const defaultValue = Array.isArray(json) ? [] : {}
  try {
    const value = JSON.parse(JSON.stringify(json))
    return value
  } catch (e) {
    return defaultValue
  }
}
