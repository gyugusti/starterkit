const getUniqueValues = (items, key) => {
  if (!Array.isArray(items)) {
    return []
  }

  const values = items
    .map(item => {
      if (key) {
        return item?.[key]
      }

      return item
    })
    .filter(value => value !== undefined && value !== null && value !== '')

  return Array.from(new Set(values))
}

export default getUniqueValues
