import { invokeCallback } from '../../../utils/utils'
import { ActionInterface } from './action-interface'

export class ActionOptions<S = any> {
  constructor(readonly action?: ActionInterface) {}

  setup(setup: S) {
    this.action.setup = setup
    invokeCallback(this.action.onSetup, this.action)
  }
}
