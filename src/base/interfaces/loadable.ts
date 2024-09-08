import { LoadingProgress } from '../loading-progress/loading-progress'

export abstract class Loadable<D = any> {
  abstract load(owner?: D): LoadingProgress
  abstract unload(owner?: D): void
}
