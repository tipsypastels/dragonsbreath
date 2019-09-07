export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function dig(obj: any, prop: string) {
  if (obj) {
    return obj[prop];
  }
}