import { SpriteMesh } from './sprite-mesh'
import { SpriteProps } from './sprite-props'

export interface SpriteParticleInfo {
  spriteMesh: SpriteMesh
  props: SpriteProps
  width: number
  height: number
}
