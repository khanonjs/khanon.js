import { Mesh as BabylonMesh } from '@babylonjs/core'

/**
 * Shortcut to basic babylon transform methods and variables
 */
export type MeshTransform = Pick<BabylonMesh,
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
