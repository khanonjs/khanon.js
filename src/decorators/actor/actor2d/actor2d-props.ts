import { SpriteConstructor } from '../../../constructors'
import { ActorProps } from '../actor-props'

export interface Actor2DProps extends ActorProps {
  sprites: SpriteConstructor[]
}
