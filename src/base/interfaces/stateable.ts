import { StateInterface } from './state/state-interface'

export abstract class Stateable<S extends new () => StateInterface> {
  abstract _state: StateInterface | null
  abstract get state(): StateInterface | null
  abstract switchState(state: S, setup: any): StateInterface
}
