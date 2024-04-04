import { LoadingProgress } from '../classes/loading-progress'

export abstract class Loadable<D = any> {
  abstract load(data?: D): LoadingProgress
  abstract unload(): void
}
