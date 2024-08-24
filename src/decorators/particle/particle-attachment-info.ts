import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'

export interface ParticleAttachmentInfo {
  attachment?: DisplayObject
  offset: BABYLON.Vector3
}
