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
  let firstLineWithContent = lines.find(l => l.trim());
  let indent;

  let match;
  if (match = /^\s+/.exec(firstLineWithContent)) {
    indent = match[0].length; 
  } else {
    indent = 0;
  }

  return lines.map(l => l.slice(indent)).join('\n');
}