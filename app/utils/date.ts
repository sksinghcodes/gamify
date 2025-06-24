import type {
  DurationEnum,
  RemoveAfterGivenDuration,
} from '~/types/task-types';
import { capitalize } from './string';
import { DURATION_UNIT, REMOVE_TYPE } from '~/constants';

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

export const getDateString: (
  dateEpoch: number | null,
  includeWeekday?: boolean
) => string = (dateEpoch, includeWeekday) => {
  if (dateEpoch === null) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeWeekday) {
    options.weekday = 'short';
  }

  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateEpoch));
};

export const getDurationString: (input: RemoveAfterGivenDuration) => string = (
  input
) => {
  const suffix = input.nValue === 1 ? '' : 's';
  return `${input.nValue} ${capitalize(input.unit)}${suffix}`;
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

  const hourStrFinal = hourStr ? hour : '00';

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

export const getBlockOf18: (input: number) => {
  blockStart: number;
  block: number[];
} = (input) => {
  if (input < 1) {
    throw new Error('Input must be a positive number');
  }
  const blockStart = Math.floor((input - 1) / 18) * 18 + 1;
  return {
    blockStart,
    block: Array.from({ length: 18 }, (_, i) => blockStart + i),
  };
};

export const getDuration: (epoch1: number, epoch2: number) => string = (
  epoch1,
  epoch2
) => {
  const diffMs = Math.abs(epoch2 - epoch1);

  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const durArr = [];

  if (days) {
    durArr.push(`${days} day${days === 1 ? 's' : ''}`);
  }

  if (hours) {
    durArr.push(`${hours} hour${hours === 1 ? 's' : ''}`);
  }

  if (minutes) {
    durArr.push(`${minutes} minute${minutes === 1 ? 's' : ''}`);
  }

  let str = '';

  if (durArr.length > 1) {
    str = durArr.slice(0, -1).join(', ');
    str = `${str} and ${durArr.at(-1)}`;
  } else {
    str = durArr.toString();
  }

  return str;
};

export const getTimeDuration: (startTime: string, endTime: string) => string = (
  startTime,
  endTime
) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  let diffMinutes = endTotalMinutes - startTotalMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }

  const hours = Math.floor(diffMinutes / 60);

  const minutes = diffMinutes % 60;

  const hoursStr = hours ? `${hours} hour${hours === 1 ? '' : 's'}` : '';
  const minutesStr = minutes
    ? `${minutes} minute${minutes === 1 ? '' : 's'}`
    : '';

  return `${hoursStr}${hoursStr && minutesStr ? ' and ' : ''}${minutesStr}`;
};

export const getDateAfterDuration: (
  fromEpoch: number,
  duration: RemoveAfterGivenDuration
) => number = (fromEpoch, duration) => {
  const date = new Date(fromEpoch);

  switch (duration.unit) {
    case DURATION_UNIT.DAY:
      date.setDate(date.getDate() + duration.nValue);
      break;
    case DURATION_UNIT.WEEK:
      date.setDate(date.getDate() + duration.nValue * 7);
      break;
    case DURATION_UNIT.MONTH:
      date.setMonth(date.getMonth() + duration.nValue);
      break;
    case DURATION_UNIT.YEAR:
      date.setFullYear(date.getFullYear() + duration.nValue);
      break;
  }

  return date.getTime();
};
