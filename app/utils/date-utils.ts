import type { MonthIndex } from '~/types/task-types';
import { MONTHS, VIEW_BY_UNITS_MAP } from '~/constants';
import type {
  MonthValue,
  PriodCarouselValue,
  UnitEnum,
  WeekValue,
  YearValue,
} from '~/types/common-types';
import { DATE_OPTIONS } from '~/constants/options';
import { isValidTime } from './time-utils';

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
  if (dateEpoch !== 0 && !dateEpoch) {
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

export const getTodayEpoch: () => number = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};

export const to12HourFormat: (time24: number | null) => string = (time24) => {
  if (time24 === null || !isValidTime(time24)) {
    return '';
  }
  let [hourStr, minuteStr] = [
    String(Math.floor(time24 / 100)),
    String(time24 % 100),
  ];

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

export const getTimeDuration: (
  startTime: number | null,
  endTime: number | null
) => string = (startTime, endTime) => {
  if (startTime === null || endTime === null) {
    return '';
  }

  const [startHours, startMinutes] = [
    Math.floor(startTime / 100),
    startTime % 100,
  ];
  const [endHours, endMinutes] = [Math.floor(endTime / 100), endTime % 100];

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

export const getWeekNumber: (dateEpoch: number) => number = (dateEpoch) => {
  const date = new Date(dateEpoch);
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = tempDate.getUTCDay() || 7; // Make Sunday (0) into 7
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum); // Set to nearest Thursday
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return weekNum;
};

export const getUnitValue: (type: UnitEnum) => PriodCarouselValue = (type) => {
  const returnValue: any = {
    type: type,
    year: new Date().getFullYear(),
  };

  if (type === VIEW_BY_UNITS_MAP.WEEK) {
    returnValue.week = getWeekNumber(new Date().getTime());
    return returnValue as WeekValue;
  }

  if (type === VIEW_BY_UNITS_MAP.MONTH) {
    returnValue.month = new Date().getMonth() as MonthIndex;
    return returnValue as MonthValue;
  }

  return returnValue as YearValue;
};

export const getDateUnitStr: (value: PriodCarouselValue) => string = (
  value
) => {
  if (value.type === VIEW_BY_UNITS_MAP.WEEK) {
    return `Week ${value.week}, ${value.year}`;
  }

  if (value.type === VIEW_BY_UNITS_MAP.MONTH) {
    return `${MONTHS[value.month]}, ${value.year}`;
  }

  return `${value.year}`;
};

export const getMaxWeeks: (year: number) => number = (year) => {
  const jan1 = new Date(year, 0, 1).getDay(); // Sunday = 0
  const dec31 = new Date(year, 11, 31).getDay();
  return jan1 === 4 || dec31 === 4 ? 53 : 52;
};

export const getMonthIndexFromYearlyDate = (yearlyDate: number) => {
  return Math.floor(yearlyDate / 100);
};

export const getDateFromYearlyDate = (yearlyDate: number) => {
  return yearlyDate % 100;
};

export const extractMonthlyDates = (
  monthIndex: number,
  existingYearlyDates: number[]
): number[] => {
  const result = existingYearlyDates
    .filter((date) => getMonthIndexFromYearlyDate(date) === monthIndex)
    .map((date) => (date + 100) % ((monthIndex + 1) * 100));

  return result;
};

export const getYearlyDatesStructure = (yearlyDates: number[]) => {
  const map: any = {};

  yearlyDates.forEach((yearlyDate) => {
    const month = getMonthIndexFromYearlyDate(yearlyDate);
    const date = getDateFromYearlyDate(yearlyDate);
    if (map[month] === undefined) {
      map[month] = [date];
    } else {
      map[month].push(date);
    }
  });

  return Object.keys(map).map((key) => ({
    month: Number(key) as MonthIndex,
    dates: map[key] as number[],
  }));
};

export const getDateOptions = (monthIndex: MonthIndex) => {
  let last = 31;
  if (monthIndex === 1) {
    last = 29;
  } else if ([3, 5, 8, 10].includes(monthIndex)) {
    last = 30;
  }
  return [...DATE_OPTIONS].slice(0, last);
};

export const to_YYYY_MM_DD_Format = (epoch: number) => {
  const date = new Date(epoch);
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
};
