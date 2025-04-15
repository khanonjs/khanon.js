import {
  LoadingProgress,
  StateCore
} from '../../../base'
import { SceneInterface } from '../../scene/scene-interface'
import { CameraInterface } from '../camera-interface'
import { CameraStateInterface } from './camera-state-interface'
import { CameraStateProps } from './camera-state-props'

export abstract class CameraStateCore implements StateCore<CameraInterface, CameraStateInterface, SceneInterface> {
  abstract props: CameraStateProps
  abstract Instance: CameraStateInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: CameraInterface): CameraStateInterface
  abstract _load(owner: SceneInterface): LoadingProgress
  abstract _unload(owner: SceneInterface): void
  abstract getClassName(): string
}
