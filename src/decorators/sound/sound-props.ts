import { SpatialAudioAttachmentType } from '@babylonjs/core/AudioV2/spatialAudioAttachmentType'

export interface SoundProps {
  url: string | string[]
  stream?: boolean
  spatialEnabled?: boolean
  useBoundingBox?: boolean,
  attachmentType?: SpatialAudioAttachmentType
}
