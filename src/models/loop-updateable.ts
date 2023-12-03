import { Subscription } from 'rxjs' // 8a8f eliminar

import { CoreGlobals } from './core-globals'

export abstract class LoopUpdateable {
  private loopUpdateSubscription: Subscription

  loopUpdate(): void {}

  subscribeLoopUpdate(): void {
    this.loopUpdateSubscription = CoreGlobals.loopUpdate$.subscribe(() => this.loopUpdate())
  }

  unSubscribeLoopUpdate(): void {
    if (this.loopUpdateSubscription) {
      this.loopUpdateSubscription.unsubscribe()
      this.loopUpdateSubscription = undefined
    }
  }
}
