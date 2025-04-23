import * as BABYLON from '@babylonjs/core'

export interface SoundProps {
  url: string | string[]
  stream?: boolean
  spatialEnabled?: boolean
  useBoundingBox?: boolean,
  attachmentType?: BABYLON.SpatialAudioAttachmentType
  cached?: boolean
}
