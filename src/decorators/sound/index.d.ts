import * as BABYLON from '@babylonjs/core'

export declare abstract class SoundInterface {

}

export type SoundConstructor = new () => SoundInterface

export interface SoundProps {
  url: string
  spatialEnabled?: boolean
  stream?: boolean
  useBoundingBox?: boolean,
  attachmentType?: BABYLON.SpatialAudioAttachmentType
}

export declare function Sound(props: SoundProps): any
