import { Actor2DConstructor } from '../../../constructors'
import { BabylonContainer } from '../../../models'
import { ActorCore } from '../actor-core'
import { Actor2DProps } from './actor2d-props'

export abstract class Actor2DCore extends ActorCore {
  babylon: Pick<BabylonContainer, 'sprite'> // 8a8f array of sprites
  props: Actor2DProps
  Instance: Actor2DConstructor
}
