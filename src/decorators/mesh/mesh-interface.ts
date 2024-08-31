import * as BABYLON from '@babylonjs/core'

import { DisplayObject } from '../../base'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { FlexId } from '../../types/flex-id'
import { MeshTransform } from '../../types/mesh-transform'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from '../sprite/sprite-animation'
import { MeshAnimation } from './mesh-animation'
import { MeshProps } from './mesh-props'

export abstract class MeshInterface implements DisplayObject {
  abstract props: MeshProps
  abstract loopUpdate$: BABYLON.Observer<number>
  abstract canvasResize$: BABYLON.Observer<Rect>
  abstract animation: SpriteAnimation | MeshAnimation
  abstract animations: Map<FlexId, SpriteAnimation | MeshAnimation>
  abstract release(): void
  abstract initialize(): void

  /**
   * User available
   */
  abstract loopUpdate: boolean
  abstract get babylon(): Pick<BabylonAccessor, 'mesh'>
  abstract get scene(): SceneInterface
  abstract get transform(): MeshTransform
  abstract setFrame(frame: number): void
  abstract setFrameFirst(): void
  abstract setFrameLast(): void
  abstract addAnimation(animation: SpriteAnimation | MeshAnimation): void
  abstract playAnimation(animation: SpriteAnimation | MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void
  abstract stopAnimation(): void
  abstract subscribeToKeyframe(keyframeId: string, callback: () => void): void
  abstract clearKeyframeSubscriptions(keyframeId: string): void
  abstract setMesh(babylonMesh: BABYLON.Mesh): void
  abstract destroy(): void

  /**
   * User defined optional
   */
  onSpawn?(scene: SceneInterface): void
  onDestroy?(): void
  onLoopUpdate?(delta: number): void
  onCanvasResize?(size: Rect): void
}
