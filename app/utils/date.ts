export const getRelativeDayLabel: (dateEpoch: number) => string = (
  dateEpoch
) => {
  const input = new Date(dateEpoch);
  const today = new Date();

  const normalize: (d: Date) => number = (d) =>
    Number(new Date(d.getFullYear(), d.getMonth(), d.getDate()));

  const normalizedInput = normalize(input);
  const normalizedToday = normalize(today);

  const diffInMs = normalizedInput - normalizedToday;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  return '';
};

export const getDateString: (dateEpoch: number) => string = (dateEpoch) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateEpoch));
};

export const getTodayEpoch: () => number = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};
