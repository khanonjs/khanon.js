import {
  Loadable,
  LoadingProgress
} from '../../base'

export abstract class InputEventsProfileInterface implements Loadable/*, LoopUpdatable, CanvasResizable, Notificable, TimersByContext */ {
  abstract load(owner?: any): LoadingProgress
  abstract unload(owner?: any): void
}
