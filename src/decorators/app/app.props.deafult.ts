import { ExtractOptional } from '../../types/extract-optional'
import { AppProps } from './app-props'

export interface AppPropsDefault extends ExtractOptional<AppProps> {
  htmlCanvasContainerId: string,
  loopUpdate: {
    fps: number
  },
  engineConfiguration: {
    antialias: true,
    adaptToDeviceRatio: boolean
  },
  audioEngine: {
    disableDefaultUI: boolean
  }
}

export const appPropsDefault: AppPropsDefault = {
  htmlCanvasContainerId: 'khanonjs',
  loopUpdate: {
    fps: 60
  },
  engineConfiguration: {
    antialias: true,
    adaptToDeviceRatio: false
  },
  audioEngine: {
    disableDefaultUI: true
  }
}
