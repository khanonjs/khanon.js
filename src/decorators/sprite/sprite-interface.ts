import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'

export abstract class SpriteInterface {
  fromDynamicTexture?(texture?: DynamicTexture): DynamicTexture
}
