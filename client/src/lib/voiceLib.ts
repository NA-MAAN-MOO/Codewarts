export const stringToAscii = (s: string) => {
  let charCodeStr = '';
  for (let i = 0; i < s.length; i++) {
    let code = s.charCodeAt(i);
    charCodeStr += code;
    charCodeStr += 'a';
  }
  return charCodeStr;
};

// export const asciiToString = (s: string) => {
//   let charCodeArr = s.split(',');
//   return String.fromCharCode(charCodeArr);
// };
