import { SoundConstructor } from '../../../decorators/sound/sound-constructor'
import { SoundProps } from '../../../decorators/sound/sound-props'

export interface MetadataSoundDefinition {
  propertyName: string
  classDefinition: SoundConstructor
}
