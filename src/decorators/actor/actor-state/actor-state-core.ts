import {
  LoadingProgress,
  StateCore
} from '../../../base'
import { SceneInterface } from '../../scene/scene-interface'
import { ActorInterface } from '../actor-interface'
import { ActorStateInterface } from './actor-state-interface'
import { ActorStateProps } from './actor-state-props'

export abstract class ActorStateCore implements StateCore<ActorInterface, ActorStateInterface, SceneInterface> {
  props: ActorStateProps
  abstract Instance: ActorStateInterface // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: ActorInterface): ActorStateInterface
  abstract load(owner?: SceneInterface): LoadingProgress
  abstract unload(owner?: SceneInterface): void
  abstract getClassName(): string
}
