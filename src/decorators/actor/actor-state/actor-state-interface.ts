import {
  CanvasResizable,
  LoopUpdatable
} from '../../../base'

export abstract class ActorStateInterface implements LoopUpdatable, CanvasResizable {
  // abstract loopUpdate$?: Observer<number>
  // abstract canvasResize$?: Observer<Rect>
  // abstract start?(): void
  // abstract end?(): void

  // /**
  //  * User available
  //  */
  // abstract scene: SceneInterface
  // abstract loopUpdate: boolean
  // abstract setCamera(camera: CameraConstructor): void

  // /**
  //  * User defined
  //  */
  // onStart?(scene: SceneInterface): void
  // onEnd?(): void
  // onLoopUpdate?(delta: number): void
  // onCanvasResize?(size: Rect): void
}
