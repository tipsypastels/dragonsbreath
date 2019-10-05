import FileReader from './file_reader';
import Transpiler from './transpiler'
import parse from './parser';
import fs from 'fs';

function pipeThroughDragonsbreath(content: string): string {
  return new Transpiler().transpile(parse(content));
}

new FileReader().compileAll((file, content) => {
  let result;

  try {
    result = pipeThroughDragonsbreath(content);  
  } catch (e) {
    console.log(`\x1b[31mFailed to compile file ${file}. ${e}\x1b[0m`);
  }

  fs.writeFileSync(file.replace(/.dbr$/, '.inc'), result);
});