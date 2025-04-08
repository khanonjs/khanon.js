import {
  Loadable,
  LoadingProgress
} from '../../base'

export abstract class InputEventsProfileInterface implements Loadable/*, LoopUpdatable, CanvasResizable, Notificable, TimersByContext */ {
  abstract _load(owner?: any): LoadingProgress
  abstract _unload(owner?: any): void
}
