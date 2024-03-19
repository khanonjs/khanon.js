import { Actor3DConstructor } from '../../../constructors'
import { ActorCore } from '../actor-core'
import { Actor3DProps } from './actor3d-props'

export abstract class Actor3DCore extends ActorCore {
  props: Actor3DProps
  Interface: Actor3DConstructor
}
