export const isValidTime: (time: number | null) => boolean = (time) => {
  return (
    typeof time === 'number' && time >= 0 && time <= 2359 && time % 100 <= 59
  );
};

export const make24HourTimeStrFromNumber: (time: number | null) => string = (
  time
) => {
  if (!isValidTime(time) || time === null) {
    return '';
  }
  return `${Math.floor(time / 100)}:${time % 100}`;
};
