import { ActionCore } from '../../../base'
import { ActorInterface } from '../actor-interface'
import { ActorActionInterface } from './actor-action-interface'

export abstract class ActorActionCore extends ActionCore<ActorInterface, ActorActionInterface> {}
