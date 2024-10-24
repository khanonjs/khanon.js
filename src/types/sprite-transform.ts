import * as BABYLON from '@babylonjs/core'

/**
 * Shortcut to basic babylon transform methods and variables
 */
/** @interface */
// export type SpriteTransform = Pick<BABYLON.Sprite, 'isVisible' | 'position' | 'angle' | 'color' | 'width' | 'height' | 'size'>
export type SpriteTransform = Pick<BABYLON.Mesh,
    'absolutePosition'
  | 'absoluteRotationQuaternion'
  | 'absoluteScaling'
  | 'position'
  | 'rotation'
  | 'rotationQuaternion'
  | 'scaling'
  | 'addRotation'
  | 'getAbsolutePivotPoint'
  | 'getAbsolutePivotPointToRef'
  | 'getAbsolutePosition'
  | 'getDirection'
  | 'getDirectionToRef'
  | 'getPivotPoint'
  | 'getPivotPointToRef'
  | 'locallyTranslate'
  | 'lookAt'
  | 'rotate'
  | 'rotateAround'
  | 'rotatePOV'
  | 'setAbsolutePosition'
  | 'setDirection'
  | 'setPivotMatrix'
  | 'setPivotPoint'
  | 'setPositionWithLocalVector'
  | 'translate'
  | 'visibility'>
