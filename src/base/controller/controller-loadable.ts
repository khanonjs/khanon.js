import { Loadable } from '../interfaces/loadable'
import { Controller } from './controller'

export function ControllerLoadable<L, T extends Loadable>() {
  abstract class ControllerLoadable extends Controller<T>() {
    static load(constructors: L | L[], data: any) {
      if (Array.isArray(constructors)) {
        ControllerLoadable.get(constructors).forEach(item => item.load(data))
      } else {
        (ControllerLoadable.get(constructors) as T).load(data) // TODO: TS bug: Does not correctly infer conditional type
      }
    }

    static unload(constructors: L | L[]) {
      if (Array.isArray(constructors)) {
        ControllerLoadable.get(constructors).forEach(item => item.unload())
      } else {
        (ControllerLoadable.get(constructors) as T).unload() // TODO: TS bug: Does not correctly infer conditional type
      }
    }
  }
  return ControllerLoadable
}
