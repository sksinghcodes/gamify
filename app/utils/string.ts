export const capitalize: (str: string) => string = (str) => {
  const lwrStr = str.toLowerCase();
  if (!lwrStr) return '';
  return lwrStr.charAt(0).toUpperCase() + lwrStr.slice(1);
};

export const classes: (
  ...args: Array<string | number | false | null | undefined>
) => string = (...args) => {
  return args.filter((arg) => arg !== false && arg != null).join(' ');
};

export const getScoreClass = (score: number | null) => {
  if (score === null) return '';
  if (score >= 75) return 'excellent';
  if (score >= 50) return 'good';
  if (score >= 25) return 'fair';
  return 'poor';
};
