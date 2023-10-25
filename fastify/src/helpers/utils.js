export function convertSpacesToChar(str) {
    return str.replace(/ /g, '#');
  }
  
export function convertCharToSpaces(str) {
    return str.replace(/#/g, ' ');
}
