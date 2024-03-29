import { LoadingProgress } from '../classes/loading-progress'
import { Loadable } from '../interfaces/loadable'
import { Controller } from './controller'

export function ControllerLoader<L, T extends Loadable>() {
  abstract class ControllerLoadable extends Controller<T>() {
    static load(constructors: L | L[], data: any): LoadingProgress {
      if (Array.isArray(constructors)) {
        const progressNodes: LoadingProgress[] = []
        ControllerLoadable.get(constructors).forEach(item => progressNodes.push(item.load(data)))
        return new LoadingProgress().fromNodes(progressNodes)
      } else {
        return (ControllerLoadable.get(constructors) as T).load(data) // TODO: TS bug?: Does not correctly infer conditional type
      }
    }

    static unload(constructors: L | L[]) {
      if (Array.isArray(constructors)) {
        ControllerLoadable.get(constructors).forEach(item => item.unload())
      } else {
        (ControllerLoadable.get(constructors) as T).unload() // TODO: TS bug?: Does not correctly infer conditional type
      }
    }
  }
  return ControllerLoadable
}
