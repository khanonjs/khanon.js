import { ExtractOptional } from '../../types'
import { AppProps } from './app-props'

export interface AppPropsDefault extends ExtractOptional<AppProps> {
  htmlCanvasContainerId: string,
  loopUpdate: {
    fps: number
  },
  engineConfiguration: {
    antialias: true,
    adaptToDeviceRatio: boolean
  }
}

export const appPropsDefault: AppPropsDefault = {
  htmlCanvasContainerId: 'khanonjs',
  loopUpdate: {
    fps: 30
  },
  engineConfiguration: {
    antialias: true,
    adaptToDeviceRatio: false
  }
}
