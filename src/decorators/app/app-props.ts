import { EngineConfiguration } from '../../types/engine-configuration'
import { AppPropLoopUpdate } from './app-props-loop-update'
import { AppStateConstructor } from './app-state/app-state-constructor'

export interface AppProps {
  name: string
  startState: AppStateConstructor // 8a8f
  htmlCanvasContainerId?: string
  loopUpdate?: AppPropLoopUpdate
  engineConfiguration?: EngineConfiguration
  debugLog?: boolean
}
