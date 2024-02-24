import { ActorCore } from '../actor-core'
import { ActorProps } from '../actor-props'
import { Actor2DProps } from './actor2d-props'

export class Actor2DCore extends ActorCore {
  props: Actor2DProps & ActorProps
}
