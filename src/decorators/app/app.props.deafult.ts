import { ExtractOptional } from '../../types'
import { AppProps } from './app-props'

export interface AppPropsDefault extends ExtractOptional<AppProps> {
  htmlCanvasContainerId: string,
  loopUpdate: {
    fps: number
  },
  engineConfiguration: {
    antialias: false,
    adaptToDeviceRatio: boolean
  }
}

export const appPropsDefault: AppPropsDefault = {
  htmlCanvasContainerId: 'khanonjs',
  loopUpdate: {
    fps: 30
  },
  engineConfiguration: {
    antialias: false,
    adaptToDeviceRatio: false
  }
}