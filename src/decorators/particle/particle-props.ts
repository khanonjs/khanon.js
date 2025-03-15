import * as BABYLON from '@babylonjs/core'

import { SpriteConstructor } from '../sprite/sprite-constructor'

export interface ParticleProps {
  sprites?: SpriteConstructor[]
  position: BABYLON.Vector3
  capacity: number
  renderingGroupId?: number
  renderOverScene: boolean
}
