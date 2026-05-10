import { format, parseISO, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, getDay } from 'date-fns';

export const formatDate = (date) => format(date, 'EEEE, d MMMM yyyy');

export const formatShortDate = (date) => format(date, 'MMM d, yyyy');

export const formatISODate = (date) => format(date, 'yyyy-MM-dd');

export const formatTime = (date) => format(date, 'HH:mm');

export const getTodayISO = () => formatISODate(new Date());

export const getYesterdayISO = () => formatISODate(subDays(new Date(), 1));

export const isToday = (date) => {
  const today = new Date();
  return formatISODate(date) === formatISODate(today);
};

export const isYesterday = (date) => {
  const yesterday = subDays(new Date(), 1);
  return formatISODate(date) === formatISODate(yesterday);
};

export const getLastNDays = (n) => {
  const today = new Date();
  const startDate = subDays(today, n - 1);
  return eachDayOfInterval({ start: startDate, end: today });
};

export const getLastNWeeks = (n) => {
  const today = new Date();
  const startDate = subDays(today, (n - 1) * 7);
  return eachDayOfInterval({ start: startDate, end: today });
};

export const getLastNMonths = (n) => {
  const today = new Date();
  const startDate = subDays(today, n * 30);
  return eachDayOfInterval({ start: startDate, end: today });
};

export const getWeekRange = (date = new Date()) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
};

export const getMonthRange = (date = new Date()) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

export const getDaysInMonth = (date = new Date()) => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

export const getDayName = (date) => format(date, 'EEEE');

export const getShortDayName = (date) => format(date, 'EEE');

export const getMonthName = (date) => format(date, 'MMMM');

export const getYear = (date) => format(date, 'yyyy');

export const isSameDay = (date1, date2) => {
  return formatISODate(date1) === formatISODate(date2);
};

export const isDateInRange = (date, start, end) => {
  return isWithinInterval(date, { start, end });
};

export const getWeekdayIndex = (date) => getDay(date);

export const getStartOfWeek = (date) => startOfWeek(date, { weekStartsOn: 1 });

export const getEndOfWeek = (date) => endOfWeek(date, { weekStartsOn: 1 });
