import {
  Loadable,
  LoadingProgress,
  Spawnable
} from '../..'

export abstract class StateCore<O, S, D> implements Spawnable<S>, Loadable {
  abstract Instance: S // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: O): S
  abstract _load(owner?: D): LoadingProgress
  abstract _unload(owner?: D): void
}
