
import type {
  IIPv4,
} from "./types"
import {
  IsIpv4,
} from "./Utils"

//

export class IPv4 implements IIPv4 {
  public static From(ip: string): IIPv4 {
    let cleanIp  = String(ip || "").trim()
    cleanIp    = IsIpv4(cleanIp) ? cleanIp : ""

    const ipV4  = new IPv4(cleanIp, !!cleanIp.length)
    return ipV4
  }

  private constructor(public readonly Val: string, public readonly Valid: boolean) {}

  public equals(ip: IIPv4|string): boolean {
    return ip instanceof IPv4 ? ip.Val === this.Val : ip === this.Val
  }
}

export default IPv4
