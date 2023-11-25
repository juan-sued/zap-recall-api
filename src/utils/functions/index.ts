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

export { removeEmptyProperties }
