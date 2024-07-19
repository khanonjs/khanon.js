import { StateCore } from '../../../base'
import { ActorInterface } from '../actor-interface'
import { ActorStateInterface } from './actor-state-interface'

export abstract class ActorStateCore extends StateCore<ActorInterface, ActorStateInterface> {}
