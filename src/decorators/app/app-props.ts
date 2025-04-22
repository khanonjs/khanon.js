import { EngineConfiguration } from '../../types/engine-configuration'
import { AppPropsAudioEngine } from './app-props-audio-engine'
import { AppPropsLoopUpdate } from './app-props-loop-update'

export interface AppProps {
  name: string
  htmlCanvasContainerId?: string
  loopUpdate?: AppPropsLoopUpdate
  audioEngine?: AppPropsAudioEngine
  engineConfiguration?: EngineConfiguration
  debugLog?: boolean
}
