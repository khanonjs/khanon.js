import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../..'
import { ActionProps } from './action-props'

export abstract class ActionCore<O, S, D> implements Spawnable<S>, Loadable<D> {
  abstract props: ActionProps<any>
  abstract Instance: S // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: O): S
  abstract _load(owner: D): LoadingProgress
  abstract _unload(owner: D): void
  abstract getClassName(): string
}
