import FileReader from './file_reader';
import Transpiler from './transpiler'
import parse from './parser';
import fs from 'fs';
import FileMerger from './file_merger';

function pipeThroughDragonsbreath(content: string): string {
  return new Transpiler().transpile(parse(content));
}

new FileReader().compileAll((file, content) => {
  let result;

  try {
    result = pipeThroughDragonsbreath(content);
    let resultPath = file.replace(/.dbr$/, '.inc');

    if (fs.existsSync(resultPath)) {
      const existingScripts = fs.readFileSync(resultPath, 'utf8');
      const merger = new FileMerger(existingScripts, result);

      fs.writeFileSync(resultPath, merger.merge());
      console.log(`Compiled file ${file} to ${resultPath}, merging with existing scripts`);
    } else {
      fs.writeFileSync(resultPath, result);
      console.log(`Compiled file ${file} to ${resultPath}`);
    }
  } catch (e) {
    console.log(`\x1b[31mFailed to compile file ${file}. ${e}\x1b[0m`);
  }
});