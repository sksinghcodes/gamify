export const capitalize: (str: string) => string = (str) => {
  const lwrStr = str.toLowerCase();
  if (!lwrStr) return '';
  return lwrStr.charAt(0).toUpperCase() + lwrStr.slice(1);
};
