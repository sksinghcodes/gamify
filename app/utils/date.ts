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

export const to12HourFormat: (time24: string) => string = (time24) => {
  let [hourStr, minuteStr] = time24.split(':');

  if (minuteStr === undefined) {
    minuteStr = '';
  }

  let hour = hourStr ? parseInt(hourStr, 10) : NaN;
  const minute = minuteStr ? minuteStr.padStart(2, '0') : '00';
  const suffix = hourStr ? (hour >= 12 ? 'PM' : 'AM') : 'AM';

  hour = hour % 12 || 12;

  const hourStrFinal = hourStr ? hour.toString().padStart(2, '0') : '00';

  return `${hourStrFinal}:${minute} ${suffix}`;
};

export const to24HourFormat: (time12: string) => string = (time12) => {
  const [time, modifier] = time12.trim().split(' ');
  let [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, '0');

  if (modifier === 'AM') {
    hour = hour === 12 ? 0 : hour;
  } else if (modifier === 'PM') {
    hour = hour === 12 ? 12 : hour + 12;
  }

  return `${hour.toString().padStart(2, '0')}:${minute}`;
};

export const destructureTime: (time24: string) => {
  hour: string;
  minute: string;
  period: string;
} = (time24) => {
  let [hourStr, minuteStr] = time24.split(':');

  if (minuteStr === undefined) {
    minuteStr = '';
  }

  const hour = hourStr ? parseInt(hourStr, 10) : NaN;
  const minute = minuteStr ? minuteStr.padStart(2, '0') : '';
  const period = hourStr ? (hour >= 12 ? 'PM' : 'AM') : '';

  const hour12 = hourStr ? (hour % 12 || 12).toString().padStart(2, '0') : '';

  return { hour: hour12, minute, period };
};

export const composeTime: (time: {
  hour: string;
  minute: string;
  period: string;
}) => string = ({ hour, minute, period }) => {
  if (!hour && !minute && !period) {
    return '';
  }

  let h = parseInt(hour, 10);
  const m = minute.padStart(2, '0');

  if (period === 'AM') {
    h = h === 12 ? 0 : h;
  } else if (period === 'PM') {
    h = h === 12 ? 12 : h + 12;
  }

  return `${h.toString().padStart(2, '0')}:${m}`;
};

export const getNextFive: (start: string) => string[] = (start) => {
  if (!start) {
    return [];
  }

  const startNum = parseInt(start, 10);

  return Array.from({ length: 5 }, (_, i) =>
    String((startNum + i) % 60).padStart(2, '0')
  );
};

export const getMinuteBlock: (minute: string) => string = (minute) => {
  if (!minute) return '';
  const num = parseInt(minute, 10);
  const blockStart = Math.floor(num / 5) * 5;
  return String(blockStart).padStart(2, '0');
};
