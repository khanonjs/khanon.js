import * as BABYLON from '@babylonjs/core'

/**
 * Shortcut to basic babylon transform methods and variables
 */
/** @interface */
export type SpriteTransform = Pick<BABYLON.Sprite, 'isVisible' | 'position' | 'angle' | 'color' | 'width' | 'height' | 'size'>
