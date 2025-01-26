import * as BABYLON from '@babylonjs/core'

/**
 * Shortcut to mesh babylon transform methods and variables adapted to sprite needs.
 */
/** @interface */
export type SpriteTransform = Pick<BABYLON.Mesh,
    'absolutePosition'
  | 'position'
  | 'getAbsolutePivotPoint'
  | 'getAbsolutePivotPointToRef'
  | 'getAbsolutePosition'
  | 'getPivotPoint'
  | 'getPivotPointToRef'
  | 'locallyTranslate'
  | 'rotateAround'
  | 'setAbsolutePosition'
  | 'setPivotMatrix'
  | 'setPivotPoint'
  | 'setPositionWithLocalVector'
  | 'translate'
  | 'visibility'> & {
    rotation: number
    scale: number
    scaleX: number
    scaleY: number
  }
