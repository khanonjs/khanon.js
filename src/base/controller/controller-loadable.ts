import { Logger } from '../../modules/logger'
import { Loadable } from '../interfaces/loadable'
import { LoadingProgress } from '../loading-progress/loading-progress'
import { Controller } from './controller'

export function ControllerLoader</* Constructor type to load from */ L, /* Instance or constructor type to get */ T extends Loadable, /* User data for 'load' method */ D = any>(useInstance?: boolean) {
  abstract class ControllerLoadable extends Controller<T>() {
    static load(constructors: L | L[] | undefined, owner: D): LoadingProgress {
      if (constructors) {
        if (Array.isArray(constructors)) {
          const progressNodes: LoadingProgress[] = []
          const _items: any[] = []
          ControllerLoadable.get(constructors, useInstance).forEach(item => {
            _items.push(item)
            const progress = item._load(owner)
            progressNodes.push(progress)
          })
          return new LoadingProgress().fromNodes(progressNodes)
        } else {
          return (ControllerLoadable.get(constructors, useInstance) as T)._load(owner) // TODO: TS bug?: Does not correctly infer conditional type
        }
      } else {
        return new LoadingProgress().complete()
      }
    }

    static unload(constructors: L | L[] | undefined, owner: D) {
      if (constructors) {
        if (Array.isArray(constructors)) {
          ControllerLoadable.get(constructors, useInstance).forEach(item => item._unload(owner))
        } else {
          (ControllerLoadable.get(constructors, useInstance) as T)._unload(owner) // TODO: TS bug?: Does not correctly infer conditional type
        }
      }
    }
  }
  return ControllerLoadable
}
