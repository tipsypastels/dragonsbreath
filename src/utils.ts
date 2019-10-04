export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function dig(obj: any, prop: string) {
  if (obj) {
    return obj[prop];
  }
}

/**
 * trims each line, but only as much as the lowest indented-line. for example:
 *      `a
 *        b`
 * becomes:
 * `a
 *   b`
 */
export function trimAndKeepIndents(text: string): string {
  const lines = text.split('\n');

  let lowestIndent = Math.min(...lines.map(line => {
    const match = /^\s+/.exec(line);
    if (match) {
      return match[0].length;
    }
    return Infinity;
  }));

  if (lowestIndent === Infinity) {
    lowestIndent = 0;
  }

  return lines.map(l => l.slice(lowestIndent)).join('\n');
}