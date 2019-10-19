export default function stringSubstitutions(text: string) {
  return text.replace(/([A-Z_]+?)\((.+?)\)/g, '{COLOR $1}$2{COLOR NO_COLOR}');
}