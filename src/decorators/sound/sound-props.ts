

export interface SoundProps {
  url: string | string[]
  stream?: boolean
  spatialEnabled?: boolean
  useBoundingBox?: boolean,
  attachmentType?: BABYLON.SpatialAudioAttachmentType
}
