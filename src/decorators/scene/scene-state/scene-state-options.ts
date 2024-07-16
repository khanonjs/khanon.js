import { Logger } from '../../../modules/logger'

export class SceneStateOptions<S = any> {
  setup(vars: S) {
    Logger.trace('aki aplica optons', vars)
  }
}
