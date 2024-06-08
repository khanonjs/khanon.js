import { ActorCore } from '../actor-core'
import { Actor3DInterface } from './actor3d-interface'
import { Actor3DProps } from './actor3d-props'

export abstract class Actor3DCore extends ActorCore {
  props: Actor3DProps
  Instance: Actor3DInterface
}
