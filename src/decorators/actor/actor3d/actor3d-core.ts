import { ActorCore } from '../actor-core'
import { ActorProps } from '../actor-props'
import { Actor3DProps } from './actor3d-props'

export class Actor3DCore extends ActorCore {
  props: Actor3DProps & ActorProps
}
