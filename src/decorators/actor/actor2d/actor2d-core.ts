import { Actor2DConstructor } from '../../../constructors'
import { BabylonContainer } from '../../../models'
import { ActorCore } from '../actor-core'
import { Actor2DProps } from './actor2d-props'

export abstract class Actor2DCore extends ActorCore {
  props: Actor2DProps
  Instance: Actor2DConstructor
}
