import { LoopUpdateable } from '../../models/loop-updateable'

export abstract class Action<S, P> extends LoopUpdateable {
  isPlaying: boolean = false
  protected properties: P
  private onDone: () => void

  constructor(readonly id: string, protected readonly subject: S) {
    super()
  }

  /**
     * Don't override
     */
  play(onDone?: () => void): void {
    this.isPlaying = true
    this.onDone = onDone
    this.onPlay()
  }

  /**
     * Don't override
     */
  stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false
      this.onStop()
    }
  }

  /**
     * Don't override
     */
  done(): void {
    if (this.onDone) {
      this.onDone()
    }
  }

  abstract onPlay(): void
  abstract onStop(): void

  setProperties(properties: P): void {
    this.properties = properties
  }
}
