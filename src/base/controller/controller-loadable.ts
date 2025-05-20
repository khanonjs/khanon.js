import { Logger } from '../../modules/logger'
import { Loadable } from '../interfaces/loadable'
import { LoadingProgress } from '../loading-progress/loading-progress'
import { Controller } from './controller'

export function ControllerLoader</* Constructor type to load from */ L, /* Instance or constructor type to get */ T extends Loadable, /* User data for 'load' method */ D = any>() {
  abstract class ControllerLoadable extends Controller<L, T>() {
    static load(constructors: L | L[] | undefined, owner: D): LoadingProgress {
      if (constructors) {
        if (Array.isArray(constructors)) {
          const progressNodes: LoadingProgress[] = []
          const _items: any[] = []
          ControllerLoadable.get(constructors).forEach(item => {
            _items.push(item)
            const progress = item._load(owner)
            progressNodes.push(progress)
          })
          return new LoadingProgress().fromNodes(progressNodes)
        } else {
          return (ControllerLoadable.get(constructors) as T)._load(owner) // TS bug?: Does not correctly infer conditional type
        }
      } else {
        return new LoadingProgress().complete()
      }
    }

    static unload(constructors: L | L[] | undefined, owner: D) {
      if (constructors) {
        if (Array.isArray(constructors)) {
          ControllerLoadable.get(constructors).forEach(item => item._unload(owner))
        } else {
          (ControllerLoadable.get(constructors) as T)._unload(owner) // TS bug?: Does not correctly infer conditional type
        }
      }
    }
  }
  return ControllerLoadable
}
