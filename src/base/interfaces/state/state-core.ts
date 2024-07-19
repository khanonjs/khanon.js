import { Spawnable } from '../..'
import { StateProps } from './state-props'

export abstract class StateCore<O, S> implements Spawnable<S> {
  abstract props: StateProps
  abstract Instance: S // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: O): S
}
