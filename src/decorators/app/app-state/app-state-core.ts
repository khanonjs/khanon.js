import {
  LoadingProgress,
  StateCore
} from '../../../base'
import { AppStateInterface } from './app-state-interface'
import { AppStateProps } from './app-state-props'

export abstract class AppStateCore implements StateCore<any, AppStateInterface, any> {
  abstract props: AppStateProps
  abstract Instance: AppStateInterface
  abstract getClassName(): string
  abstract spawn(): AppStateInterface
  abstract _load(): LoadingProgress
  abstract _unload(_newStateCore: AppStateCore): void
}
