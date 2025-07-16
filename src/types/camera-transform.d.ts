

/**
 * Shortcut to basic babylon transform methods and variables
 */
/** @interface */
export type CameraTransform = Pick<BABYLON.TargetCamera,
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
