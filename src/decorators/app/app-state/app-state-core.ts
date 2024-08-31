import {
  LoadingProgress,
  StateCore
} from '../../../base'
import { AppStateInterface } from './app-state-interface'

export abstract class AppStateCore implements StateCore<any, AppStateInterface, any> {
  abstract Instance: AppStateInterface
  abstract spawn(): AppStateInterface
  abstract load(): LoadingProgress
  abstract unload(): void
}
