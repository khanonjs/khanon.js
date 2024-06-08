import { ActorCore } from '../actor-core'
import { Actor2DInterface } from './actor2d-interface'
import { Actor2DProps } from './actor2d-props'

export abstract class Actor2DCore extends ActorCore {
  props: Actor2DProps
  Instance: Actor2DInterface
}
