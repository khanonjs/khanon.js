import { ExtractOptional } from '../../types/extract-optional'
import { SceneProps } from './scene-props'

export interface ScenePropsDefault extends ExtractOptional<SceneProps> {
  useDebugInspector: boolean
}

export const scenePropsDefault: ScenePropsDefault = {
  useDebugInspector: true
}
