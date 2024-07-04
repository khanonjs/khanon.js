import { Sprite as BabylonSprite } from '@babylonjs/core'

/**
 * Shortcut to basic babylon transform methods and variables
 */
export type SpriteTransform = Pick<BabylonSprite, 'isVisible' | 'position' | 'angle' | 'color' | 'width' | 'height' | 'size'>
