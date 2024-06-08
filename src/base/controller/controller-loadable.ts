import { LoadingProgress } from '../classes/loading-progress'
import { Loadable } from '../interfaces/loadable'
import { Controller } from './controller'

export function ControllerLoader</* Constructor type to load */ L, /* Instance or constructor type to get */ T extends Loadable, D = any>(useInstance?: boolean) {
  abstract class ControllerLoadable extends Controller<T>() {
    static load(constructors: L | L[], data?: D): LoadingProgress {
      if (constructors) {
        if (Array.isArray(constructors)) {
          const progressNodes: LoadingProgress[] = []
          ControllerLoadable.get(constructors, useInstance).forEach(item => progressNodes.push(item.load(data)))
          return new LoadingProgress().fromNodes(progressNodes)
        } else {
          return (ControllerLoadable.get(constructors, useInstance) as T).load(data) // TODO: TS bug?: Does not correctly infer conditional type
        }
      }
    }

    static unload(constructors: L | L[]) {
      if (Array.isArray(constructors)) {
        ControllerLoadable.get(constructors, useInstance).forEach(item => item.unload())
      } else {
        (ControllerLoadable.get(constructors, useInstance) as T).unload() // TODO: TS bug?: Does not correctly infer conditional type
      }
    }
  }
  return ControllerLoadable
}
