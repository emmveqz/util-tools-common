
import type {
  IArrayEl,
  IAsyncTryCatch,
  ICtxAsyncTryCatch,
  ICtxTryCatch,
  IDateFormat,
  IDestructedTime,
  IEnumLike,
  IFuncArgs,
  ITryCatch,
  IValOf,
  IWithAsyncTryCatch,
  IWithTryCatch,
} from "./types"

//

export const IsIpv4 = (ip: string): boolean => {
  return ip.search(/^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/g) > -1
}

export const IsInt = (val: number|string): boolean => {
  /**
   * @ToDo Compare vs using Number.isInteger()
   */
  return (/^\d+$/).test(val as unknown as string)
}

export const IsNumeric = (val: number|string): boolean => {
  return (/^-?\d*\.?\d+$/).test(val as unknown as string)
}

export const IsEmail = (val: string): boolean => {
  return (/^[A-Z0-9.$#_+-]+@([A-Z0-9-]+\.)+[A-Z]+$/i).test(val)
}

export const IsValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN( date.getTime() ) && date.getTime() > 0
}

export const IsDate = (date: string|Date): boolean => {
  return IsValidDate( (date instanceof Date) ? date : (new Date(date)) )
}

export const Sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

export const ArrayFilterHalt = <T>(arr: Array<T>, predicate: IFuncArgs<Array<T>["findIndex"]>[0]): Array<T> => {
  const idx = arr.findIndex(predicate)

  return arr.slice(0, idx)
}

/**
 * @note Could this be deprecated by just using `Set`?
 * @param arr
 */
export const ArrayUnique = <T>(arr: Array<T>): Array<T> => {
  return arr.filter((val, idx, arr2) =>
    // tslint:disable-next-line: trailing-comma
    arr2.indexOf(val) === idx
  )
}

export const ArrayUniqueByProp = <T extends Record<string, unknown>>(arr: Array<T>, prop: keyof T): Array<T> => {
  return arr.filter((val, idx, arr2) =>
    // tslint:disable-next-line: trailing-comma
    arr2.findIndex((val2) => val2[prop] === val[prop]) === idx
  )
}

export const ArraySum = <T extends Array<unknown>>(arr: T): IArrayEl<T> extends number ? number : never => {
  return arr.length
    ? arr.reduce(
      (total, val) => Number.isFinite(val) ? (total as number || 0) + (val as number) : total,
      Number.isFinite(arr[0]) ? 0 : NaN,
    ) as never
    : 0 as never
}

/*
export const ArraySum = (arr: Array<number>): number => {
  return arr.reduce((total, val) => total + val, 0)
}
*/

export const RegExps = {
  Domain: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))+$/,
  Email: /^[a-zA-Z0-9]+(?:[.!#$%&'*+/=?^_`{|}~-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))+$/,
  RealNumber: /^[+-]?(?:\d+\.?\d*|\d*\.\d+)$/,
}

export const extractEnumNumbers = <T extends IEnumLike>(en: T): Array< IValOf<T, string> > => {
  return Object
    .values(en as { [prop: string]: IValOf<T, string> })
    .filter((val) => typeof val === typeof 1)
}

export const secondsToTime = (seconds: number, excludeHours?: boolean): string|null => {
  const cleanSeconds = parseInt(seconds as unknown as string, 10)

  if ( isNaN(cleanSeconds) ) {
    return null
  }

  const parts = new Date(2020, 0, 1, 0, 0, cleanSeconds).toTimeString().split(" ")[0].split(":")
  const hours = parseInt(parts[0], 10)
  const hours2 = parseInt((cleanSeconds / (60 * 60 * 24)) as unknown as string, 10)
  const minutes = parts[1]
  const seconds2 = parts[2]

  return excludeHours
    ? `${minutes}:${seconds2}`
    : `${hours + hours2}:${minutes}:${seconds2}`
}

export const tryCatch: ITryCatch = (func, ...args) => {
  try {
    return func(...args)
  }
  catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const ctxTryCatch: ICtxTryCatch = (ctx, func, ...args) => {
  try {
    return func.call(ctx, ...args)
  }
  catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const asyncTryCatch: IAsyncTryCatch = async (func, ...args) => {
  try {
    return await func(...args)
  }
  catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const ctxAsyncTryCatch: ICtxAsyncTryCatch = async (ctx, func, ...args) => {
  try {
    return await func.call(ctx, ...args)
  }
  catch (ex) {
    return new Error((ex as Error).message)
  }
}

export const withTryCatch: IWithTryCatch = (func) => {
  return (...args) => tryCatch(func, ...args)
}

export const withAsyncTryCatch: IWithAsyncTryCatch = (func) => {
  return (...args) => asyncTryCatch(func, ...args)
}

export const DestructTime = (time: string): IDestructedTime => {
  const match = time.toLowerCase().match(/(\d{1,2}):(\d{1,2}):?(\d{1,2})? ?([ap]m)?/)
  const [, hr, minute, second, amOrPm] = !match
    ? [, "00", "00", undefined, undefined]
    : match

  // it's retarded we need to check this, but we have to.
  const hour = hr === "24" ? "00" : hr

  return {
    hour: hour.padStart(2, "0"),
    minute: minute.padStart(2, "0"),
    second: !second ? undefined : second.padStart(2, "0"),
    amOrPm: amOrPm as "am"|"pm"|undefined,
  }
}

// hackerman
export const TimeDiff = (time: string, hourDiff: number = 0, minDiff: number = 0, removeSecs: boolean = false): string => {
  const { hour, minute, second, amOrPm } = DestructTime(time)
  const topHour = !!amOrPm ? 12 : 24

  let newAmOrPm = amOrPm
  let newHour = Number(hour) + hourDiff

  if (!!newAmOrPm && (newHour < 0 || (hour === "12" && newHour < 12) || Number(hour) < 12 && newHour >= 12) ) {
    newAmOrPm = newAmOrPm === "am" ? "pm" : "am"
  }

  if (newHour < 0) {
    newHour = topHour + newHour
  }
  else if (newHour >= topHour) {
    newHour -= topHour
  }
  newHour = newHour === 0 && !!newAmOrPm ? 12 : newHour

  let newMin = Number(minute) + minDiff
  newMin = newMin > 59 ? (newMin - 60) : newMin

  return `${String(newHour).padStart(2, "0")}:${String(newMin).padStart(2, "0")}` +
    (!second || removeSecs ? "" : ":" + second) +
    (!newAmOrPm ? "" : " " + newAmOrPm)
}

export const DatetimeDiff = (dt: Date, hoursDiff: number, minutesDiff: number = 0, secondsDiff: number = 0): Date => {
  return new Date(
    dt.getFullYear(),
    dt.getMonth(),
    dt.getDate(),
    dt.getHours() + hoursDiff,
    dt.getMinutes() + minutesDiff,
    dt.getSeconds() + secondsDiff)
}

/**
 * @param date This must be validated as a valid Date.
 * @returns The Date in a formatted string. `Error` when `date` is an Invalid Date.
 */
export const FormatDate = (date: Date, timeZone?: string, dateFormat: "american"|"european" = "american", amPm: boolean = dateFormat === "american"): string | Error => {
  return isNaN( date.getFullYear() )
    ? new Error("Invalid Date passed")
    : date
    .toLocaleString(dateFormat === "european" ? "en-GB" : "en-US", {
      formatMatcher: "basic",
      hour12: amPm,
      timeZone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    })
}

/**
 * @param date
 * @param timeZone
 * @param dateFormat Use `"japanese"` for data entry.
 */
export const DateToString = (date: Date, timeZone?: string, dateFormat: IDateFormat = "japanese"): string => {
  const formatted = FormatDate(date, timeZone, dateFormat === "japanese" ? "american" : dateFormat)
  const validated = formatted instanceof Error
    ? "00/00/0000,"
    : formatted

  const regex = /(\d+)\/(\d+)\/(\d+),/
  const [ , month, day, year ] = validated.match(regex) as string[]

  return dateFormat === "japanese"
    ? `${year}-${month}-${day}`
    : `${month}/${day}/${year}`
}

/**
 * @param date
 * @param timeZone
 * @param dateFormat Use `"japanese"` for data entry.
 * @param amPm
 * @param removeSecs
 */
// tslint:disable-next-line: max-line-length
export const DatetimeToString = (date: Date, timeZone?: string, dateFormat: IDateFormat = "japanese", amPm: boolean = dateFormat === "american", removeSecs: boolean = false): string => {
  const formatted = FormatDate(date, timeZone, dateFormat === "japanese" ? "american" : dateFormat, amPm)
  const validated = formatted instanceof Error
    ? "00/00/0000, 00:00:00" + (amPm ? " am" : "")
    : formatted

  const regex = /(\d+)\/(\d+)\/(\d+),/
  const timeRegex = /(\d{1,2}):(\d{1,2}):(\d{1,2})/
  const [ , month, day, year ] = validated.match(regex) as string[]
  const [ , hour, minute, second ] = validated.match(timeRegex) as string[]
  // it's retarded we need to check this, but we have to.
  const hr = hour === "24" ? "00" : hour

  return validated
    .replace(regex, dateFormat === "japanese" ? `${year}-${month}-${day}` : `${month}/${day}/${year}`)
    .replace(timeRegex, `${hr}:${minute}${!removeSecs ? ":" + second : ""}`)
}

/**
 * @param time If it's in `hh:mm` format, `:00` seconds will be added to output, unless `removeSecs` is `true`
 * @param amPm If not specified or `false`, will convert output to 24 hours format.
 * @param removeSecs If not specified or `false`, `:00` seconds will be added to output when `time` is in `hh:mm` format.
 */
export const FormatTime = (time: string, timeZone?: string, amPm: boolean = false, removeSecs: boolean = false): string => {
  const dateStr = DateToString(new Date(), timeZone)
  const { hour, minute, second, amOrPm } = DestructTime(time)

  const dtStr = `${dateStr} ${hour}:${minute}:${second || "00"}${!amOrPm ? "" : " " + amOrPm}`

  const datetimeParts = DatetimeToString(new Date(dtStr), timeZone, undefined, amPm, removeSecs).split(" ")

  // remove the Date part
  datetimeParts.shift()

  return datetimeParts.join(" ")
}

export const DayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)

  return day
}

export const FirstSundayOfMonth = (date: Date): Date => {
  const copy = new Date( date.getTime() )
  const day = copy.getDay()

  if (!!day) {
    copy.setHours(-24 * day)
    copy.setHours(24 * 7)
  }
  return copy
}

export const LastSundayPrevMonth = (date: Date): Date => {
  const copy = new Date( date.getTime() )
  const day = copy.getDay() || 7
  copy.setHours(-24 * day)

  return copy
}

export const IsMexDST = (date: Date): boolean => {
  const firstAprSun = FirstSundayOfMonth( new Date(date.getFullYear(), 3) )
  const lastOctSun = LastSundayPrevMonth( new Date(date.getFullYear(), 10) )

  return date.getTime() >= firstAprSun.getTime() && date.getTime() < lastOctSun.getTime()
}

export const IsDST = (date: Date): boolean => {
  const jan = new Date(date.getFullYear(), 0, 1)
  const jul = new Date(date.getFullYear(), 6, 1)
  const stdTimeOffset = Math.max( jan.getTimezoneOffset(), jul.getTimezoneOffset() )

  return date.getTimezoneOffset() < stdTimeOffset
}