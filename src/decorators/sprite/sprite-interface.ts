import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'

import { BabylonContainer } from '../../models/babylon-container'

export abstract class SpriteInterface {
  babylon: Pick<BabylonContainer, 'sprite' | 'spriteManager'>

  fromDynamicTexture?(texture?: DynamicTexture): DynamicTexture
}
