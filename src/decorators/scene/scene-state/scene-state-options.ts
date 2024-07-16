import { invokeCallback } from '../../../utils/utils'
import { SceneStateInterface } from './scene-state-interface'

export class SceneStateOptions<S = any> {
  constructor(readonly state: SceneStateInterface) {}

  setup(setup: S) {
    this.state.setup = setup
    invokeCallback(this.state.onSetup, this.state)
  }
}
