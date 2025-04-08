import { LoadingProgress } from '../loading-progress/loading-progress'

export abstract class Loadable<D = any> {
  abstract _load(owner?: D): LoadingProgress
  abstract _unload(owner?: D): void
}
