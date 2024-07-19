import { invokeCallback } from '../../../utils/utils'
import { StateInterface } from './state-interface'

export class StateOptions<S = any> {
  constructor(readonly state?: StateInterface) {}

  setup(setup: S) {
    this.state.setup = setup
    invokeCallback(this.state.onSetup, this.state)
  }
}
