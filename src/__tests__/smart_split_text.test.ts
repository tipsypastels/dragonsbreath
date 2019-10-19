import smartSplitText from '../smart_split_text';

describe(smartSplitText, () => {
  test('basic test', () => {
    expect(smartSplitText('hello world', { maxLen: 6 })).toEqual(['hello', 'world']);
  });

  test('exact length match', () => {
    expect(smartSplitText('hello world', { maxLen: 5 })).toEqual(['hello', 'world']);
  });

  test('a longer phrase', () => {
    expect(smartSplitText('comment ca va, mon ami?', { maxLen: 7 })).toEqual(['comment', 'ca va,', 'mon', 'ami?']);
  });

  test('pertinence', () => {
    expect(smartSplitText('{COLOR RED}Hey!{COLOR NO_COLOR} Dakota! Come over here!', {
      maxLen: 15,
      pertinentRepresentation: text => {
        return text
          .replace(/{[A-Z_ ]+?}/g, '')
          .replace(/\\.|\$$/, '');
      }
    })).toEqual(['{COLOR RED}Hey!{COLOR NO_COLOR} Dakota!', 'Come over here!'])
  })
});