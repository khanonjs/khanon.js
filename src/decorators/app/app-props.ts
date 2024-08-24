import { EngineConfiguration } from '../../babylon-config'
import { AppPropLoopUpdate } from './app-props-loop-update'

export interface AppProps {
  name: string
  htmlCanvasContainerId?: string
  loopUpdate?: AppPropLoopUpdate
  engineConfiguration?: EngineConfiguration
  debugLog?: boolean
  logCanvasSize?: boolean
  // guis?: GUIConstructor[]
}
