import * as Misc from '../../misc'
import { Logger } from '../logger/logger'
import { Action } from './action'

/**
 * Actions to be applied to actors or scenes.
 * A single instance can run any number of actions.
 */

export class ActionsManager<T> {
  private registeredActions: Misc.KeyValue<string, Action<T, any>> = new Misc.KeyValue<string, Action<T, any>>()

  registerAction(action: Action<T, any>): void {
    this.registeredActions.add(action.id, action)
  }

  play<P>(actionId: string, properties?: P, onDone?: () => void): void {
    if (!this.isPlaying(actionId)) {
      const action = this.registeredActions.get(actionId)
      action.setProperties(properties)
      action.play(onDone)
    } else {
      Logger.warn('Action already running -', actionId)
    }
  }

  stop(actionId: string): void {
    const action = this.registeredActions.get(actionId)
    if (action) {
      action.stop()
    }
  }

  stopAll(): void {
    this.registeredActions.getValues().forEach((action) => {
      action.stop()
    })
  }

  isPlaying(actionId: string): boolean {
    return this.registeredActions.get(actionId)?.isPlaying
  }
}
