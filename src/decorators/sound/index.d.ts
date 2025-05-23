import * as BABYLON from '@babylonjs/core'

export declare abstract class SoundInterface {}

export type SoundConstructor = new () => SoundInterface

export interface SoundProps {
  /**
   * Url of the sound file.
   * It can be a single url or an array of urls.
   * For array of urls, read: https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic#using-browser-specific-audio-codecs
   */
  url: string | string[]

  /**
   * Enables the sound to be played in 3D space.
   * If set to true, the sound will be played in 3D space in case it is played by an actor.
   */
  spatialEnabled?: boolean

  /**
   * Streams the sound instead of loading it.
   * This is useful for large files that would take too long to load, commonly used to play music or environmental backgrounds.
   */
  stream?: boolean

  /**
   * Enables the use of a bounding box for the sound.
   * Read more: https://doc.babylonjs.com/typedoc/classes/BABYLON.AbstractSpatialAudio#attach
   */
  useBoundingBox?: boolean,

  /**
   * Spatial attachment type.
   * Read more: https://doc.babylonjs.com/typedoc/classes/BABYLON.AbstractSpatialAudio#attach
   */
  attachmentType?: BABYLON.SpatialAudioAttachmentType
}

export declare function Sound(props: SoundProps): any
