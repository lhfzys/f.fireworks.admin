import { format, isValid } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 一个通用的日期格式化函数
 * @param date - 可以是日期对象、时间戳或ISO字符串
 * @param formatString - 目标格式，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化后的日期字符串，如果日期无效则返回空字符串
 */
export const formatDate = (
  date: string | Date | number | null | undefined,
  formatString = 'yyyy-MM-dd HH:mm:ss',
): string => {
  if (!date) {
    return '';
  }

  const dateToFormat = new Date(date);

  if (!isValid(dateToFormat)) {
    console.error('Invalid date provided to formatDate:', date);
    return '';
  }

  try {
    return format(dateToFormat, formatString, { locale: zhCN });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
