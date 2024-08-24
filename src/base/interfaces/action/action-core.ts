import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../..'
import { SceneInterface } from '../../../decorators/scene/scene-interface'
import { ActionProps } from './action-props'

export abstract class ActionCore<O, S, D> implements Spawnable<S>, Loadable<D> {
  abstract props: ActionProps<any>
  abstract Instance: S // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: O): S
  abstract load(owner: D): LoadingProgress
  abstract unload(owner: D): void
}
