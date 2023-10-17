const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp']

export const fileIsImage = (file: File): boolean => {
  return validImageTypes.includes(file.type)
}
