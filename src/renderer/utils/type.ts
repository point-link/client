export function isTypedArray<T>(
  value: any,
  predicate: (v: any) => v is T,
): value is T[] {
  if (!Array.isArray(value))
    return false
  for (const item of value) {
    if (!predicate(item))
      return false
  }
  return true
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isStringArray(value: any): value is string[] {
  return isTypedArray(value, isString)
}
