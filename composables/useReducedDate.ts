export const useReducedDate = (days: number) => {
  if (days < 30) {
    return `${days}d`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    const decimal = ((days / 30) - months).toFixed(1)
    return `${months}${decimal !== '0.0' ? '.' + decimal.substring(2) : ''}m`
  } else {
    const years = Math.floor(days / 365)
    const decimal = ((days / 365) - years).toFixed(1)
    return `${years}${decimal !== '0.0' ? '.' + decimal.substring(2) : ''}y`
  }
}
