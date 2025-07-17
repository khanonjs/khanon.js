import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'

import { SpriteProps } from './sprite-props'

export interface SpriteParticleInfo {
  texture: Texture | DynamicTexture
  props: SpriteProps
  width: number
  height: number
}
