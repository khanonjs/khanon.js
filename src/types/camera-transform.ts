import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'

/**
 * Shortcut to basic babylon transform methods and variables
 */
/** @interface */
export type CameraTransform = Pick<TargetCamera,
'position'
| 'globalPosition'
| 'upVector'
| 'getDirection'
| 'getDirectionToRef'
| 'getForwardRay'
| 'getProjectionMatrix'
| 'getWorldMatrix'
| 'rotation'
| 'speed'
| 'target'>
