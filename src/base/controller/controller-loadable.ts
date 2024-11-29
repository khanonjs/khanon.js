import { Loadable } from '../interfaces/loadable'
import { LoadingProgress } from '../loading-progress/loading-progress'
import { Controller } from './controller'

export function ControllerLoader</* Constructor type to load from */ L, /* Instance or constructor type to get */ T extends Loadable, /* User data for 'load' method */ D = any>(useInstance?: boolean) {
  abstract class ControllerLoadable extends Controller<T>() {
    static load(constructors: L | L[] | undefined, owner: D): LoadingProgress {
      if (constructors) {
        if (Array.isArray(constructors)) {
          const progressNodes: LoadingProgress[] = []
          ControllerLoadable.get(constructors, useInstance).forEach(item => progressNodes.push(item.load(owner)))
          return new LoadingProgress().fromNodes(progressNodes)
        } else {
          return (ControllerLoadable.get(constructors, useInstance) as T).load(owner) // TODO: TS bug?: Does not correctly infer conditional type
        }
      } else {
        return new LoadingProgress().complete()
      }
    }

    static unload(constructors: L | L[] | undefined, owner: D) {
      if (constructors) {
        if (Array.isArray(constructors)) {
          ControllerLoadable.get(constructors, useInstance).forEach(item => item.unload(owner))
        } else {
          (ControllerLoadable.get(constructors, useInstance) as T).unload(owner) // TODO: TS bug?: Does not correctly infer conditional type
        }
      }
    }
  }
  return ControllerLoadable
}
