import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'

export declare interface SpriteInterface {
  /**
   * Used to assign a Babylon DynamicTexture to the Sprite.
   */
  fromDynamicTexture?(texture?: DynamicTexture): DynamicTexture
}
