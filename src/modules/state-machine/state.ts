import { Arrays } from '../../misc/arrays'
import { LoopUpdateable } from '../../models/loop-updateable'
import {
  Interval,
  Timeout
} from '../../types/timers'

export abstract class State<T> extends LoopUpdateable {
  private onEndCallback: () => void
  private timeouts: Timeout[] = []
  private intervals: Interval[] = []

  constructor(readonly id: string, protected readonly subject: T) {
    super()
  }

  private clearTimers() {
    this.timeouts.forEach(timeout => clearTimeout(timeout))
    this.intervals.forEach(interval => clearInterval(interval))
    this.timeouts = []
    this.intervals = []
  }

  private onTimeout(callback: () => void, timeout: Timeout) {
    this.removeTimeout(timeout)
    callback()
  }

  protected addTimeout(callback: () => void, ms: number) {
    const timeout = setTimeout(() => this.onTimeout(callback, timeout), ms)
    this.timeouts.push(timeout)
    return timeout
  }

  protected removeTimeout(timeout: Timeout) {
    clearTimeout(timeout)
    Arrays.removeValue(this.timeouts, timeout)
  }

  protected addInterval(callback: () => void, ms: number) {
    const interval = setInterval(callback, ms)
    this.intervals.push(interval)
    return interval
  }

  protected removeInterval(interval: Timeout) {
    clearInterval(interval)
    Arrays.removeValue(this.intervals, interval)
  }

  abstract onStart(): void
  abstract onEnd(): void

  start(onEndCallback: () => void): void {
    this.onEndCallback = onEndCallback
    this.onStart()
  }

  end(): void {
    this.clearTimers()
    this.onEndCallback()
    this.onEnd()
  }

  /**
   * Override on child to notify messages to this actor from outer scene
   *
   * @param id
   */
  notify(id: any): void {}
}
