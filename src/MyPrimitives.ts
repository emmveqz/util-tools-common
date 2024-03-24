
// tslint:disable: max-classes-per-file

import type {
  IFuncArgs,
} from "./types"
import {
  ArraySum,
} from "./Utils"

//

class MyArray<T> extends Array<T> {
  public unique(): Array<T> {
    return super
      .filter((val, idx, arr) => arr.indexOf(val) === idx)
  }

  /**
   * Inverse to `filter`, it includes elements until the first instance of a truthy `predicate`.
   *
   * Hence making order of elements relevant.
   * @param predicate
   */
  public filterUntil(predicate: IFuncArgs<Array<T>["findIndex"]>[0]): Array<T> {
    const idx = super.findIndex(predicate)

    return idx > -1 ? this.slice(0, idx) : this
  }

  public sum(): T extends number ? number : never {
    return ArraySum(this)
  }
}

class MyDate extends Date {
  public static getNowInSecs(): number {
    return parseInt(String(this.now() / 1000), 10) || 0
  }
}

class MyMathConstructor {
  public sum(...values: Array<number>): number {
    return ArraySum(values)
  }
}

const MyMath = Object.assign(new MyMathConstructor(), Math)

class MyNumber extends Number {
  /**
   * As in `val` greater than `min`, and lower than `max`.
   * @param val
   * @param min
   * @param max
   */
  public static isBetween(val: number, min: number, max: number): boolean {
    return val > min && val < max
  }

  /**
   * As in `val` greater than `min`, and lower than `max`.
   * @param min
   * @param max
   */
  public isBetween(min: number, max: number): boolean {
    return (this.constructor as typeof MyNumber).isBetween(super.valueOf(), min, max)
  }
}

//

export const My = {
  Array: MyArray,
  Date: MyDate,
  Math: MyMath,
  Number: MyNumber,
}
