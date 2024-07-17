import { invokeCallback } from '../../../utils/utils'
import { ActorActionInterface } from './actor-action-interface'

export class ActorActionOptions<S = any> {
  constructor(readonly action?: ActorActionInterface) {}

  setup(setup: S) {
    this.action.setup = setup
    invokeCallback(this.action.onSetup, this.action)
  }
}
