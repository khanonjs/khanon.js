

import { SpriteProps } from './sprite-props'

export interface SpriteParticleInfo {
  texture: BABYLON.Texture | BABYLON.DynamicTexture
  props: SpriteProps
  width: number
  height: number
}
