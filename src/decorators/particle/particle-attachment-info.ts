import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { DisplayObject } from '../../base'

export interface ParticleAttachmentInfo {
  attachment?: DisplayObject
  offset?: Vector3
}
