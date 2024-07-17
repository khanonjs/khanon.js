import { invokeCallback } from '../../../utils/utils'
import { ActorStateInterface } from './actor-state-interface'

export class ActorStateOptions<S = any> {
  constructor(readonly state?: ActorStateInterface) {}

  setup(setup: S) {
    this.state.setup = setup
    invokeCallback(this.state.onSetup, this.state)
  }
}
