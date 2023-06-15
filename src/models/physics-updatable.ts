import { Subscription } from 'rxjs'

import { CoreGlobals } from './core-globals'

export abstract class PhysicsUpdateable {
  private physicsUpdateSubscription: Subscription

  physicsUpdate(): void {}

  subscribePhysicsUpdate(): void {
    this.physicsUpdateSubscription = CoreGlobals.physicsUpdate$.subscribe(this.physicsUpdate.bind(this))
  }

  unSubscribePhysicsUpdate(): void {
    if (this.physicsUpdateSubscription) {
      this.physicsUpdateSubscription.unsubscribe()
      this.physicsUpdateSubscription = undefined
    }
  }
}
