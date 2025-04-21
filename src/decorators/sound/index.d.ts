export declare abstract class SoundInterface {

}

export type SoundConstructor = new () => SoundInterface

export interface SoundProps {
  url: string | string[]
  spatial?: boolean
}

export declare function Sound(props: SoundProps): any
