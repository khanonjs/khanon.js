import * as BABYLON from '@babylonjs/core'

/** // 8a8f mesh transforms
 * Shortcut to basic babylon transform methods and variables
 */
/** @interface */
export type MeshTransform = Pick<BABYLON.Mesh,
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
