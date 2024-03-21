import { LoadingProgress } from '../../models'

export abstract class Loadable<D = any> {
  abstract loaded: boolean
  abstract load(data?: D): LoadingProgress
  abstract unload(): void
}
