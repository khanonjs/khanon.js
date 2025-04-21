import { SoundProps } from './sound-props'

export abstract class SoundInterface {
  abstract _props: SoundProps
  abstract _className: string

  /**
   * User available
   */
  abstract getClassName(): string
}
