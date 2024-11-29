import { EngineConfiguration } from '../../types/engine-configuration'
import { AppPropLoopUpdate } from './app-props-loop-update'

export interface AppProps {
  name: string
  htmlCanvasContainerId?: string
  loopUpdate?: AppPropLoopUpdate
  engineConfiguration?: EngineConfiguration
  removeTimeoutsOnStateSwitch?: boolean
  debugLog?: boolean
}
