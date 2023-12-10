import { DisplayObject } from '../../base/display-object'
import { LoopUpdateable } from '../../models/loop-updateable'
import { MotionEndCriteria } from './motion-end-criteria'
import { MotionProperties } from './motion-properties'

export abstract class Motion extends LoopUpdateable {
  displayObject: DisplayObject
  protected onDoneCallback: () => void

  constructor(protected readonly properties: MotionProperties) {
    super()
  }

    abstract onInitialize(): void
    abstract loopUpdate(): void

    initialize(displayObject: DisplayObject, onDoneCallback?: () => void): void {
      this.displayObject = displayObject
      this.onDoneCallback = onDoneCallback
      this.onInitialize()
      if (this.properties.endCriteria === MotionEndCriteria.TIMEOUT) {
        setTimeout(() => this.done(), this.properties.endValue)
      }
    }

    start(): void {
      this.subscribeLoopUpdate()
    }

    end(): void {
      this.unSubscribeLoopUpdate()
    }

    protected done(): void {
      this.end()
      this.onDoneCallback()
    }
}
