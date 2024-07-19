import { Spawnable } from '../..'
import { ActionProps } from './action-props'

export abstract class ActionCore<O, S> implements Spawnable<S> {
  abstract props: ActionProps<any> // 8a8f
  abstract Instance: S // Disambiguate core methods from interface spawnable instances
  abstract spawn(owner: O): S
}
