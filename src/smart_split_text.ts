interface SmartSplitTextOpts {
  maxLen: number;
  pertinentRepresentation?: (str: string) => string;
}

export default function smartSplitText(text: string, opts: SmartSplitTextOpts): string[] {
  opts.pertinentRepresentation || (opts.pertinentRepresentation = (a) => a);

  const lines: string[] = [];
  let current: string[] = [];

  const words = text.split(/(?!{.+?)\s+(?!.+?})/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (opts.pertinentRepresentation(current.concat(word).join(' ')).length > opts.maxLen) {
      lines.push(current.join(' '));
      current = [word];
    } else {
      current.push(word);
    }

    if (i === words.length - 1) {
      lines.push(current.join(' '));
    }
  }

  return lines;
}