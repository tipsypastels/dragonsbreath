import { inspect } from 'util';

export default function p(x: any) {
  console.log(inspect(x, { depth: null }));
  return x;
}