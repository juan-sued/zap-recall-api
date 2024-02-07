import { array } from 'joi'

function removeEmptyProperties<T>(obj: T): T {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      removeEmptyProperties(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    } else if (obj[key] === '') {
      delete obj[key]
    }
  }
  return obj
}
type ElementWithId = {
  id: number
}
function toArrayUniqueId<T extends ElementWithId>(array: T[]): T[] {
  const uniqueElements = Array.from(new Set(array.map((e) => e.id)))
    .map((id) => array.find((e) => e.id === id))
    .filter((element): element is T => !!element)

  return uniqueElements
}
export { removeEmptyProperties, toArrayUniqueId }
