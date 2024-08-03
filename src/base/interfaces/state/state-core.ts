import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../..'
import { StateProps } from './state-props'

export abstract class StateCore<O, S, D> implements Spawnable<S>, Loadable {
  abstract props: StateProps
  abstract Instance: S // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: O): S
  abstract load(owner?: D): LoadingProgress
  abstract unload(owner?: D): void
}
