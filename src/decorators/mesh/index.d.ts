import {
  Matrix,
  MeshasBabylonMesh
} from '@babylonjs/core'

import { DisplayObject } from '../../base'
import KJS from '../../kjs'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { MeshTransform } from '../../types'
import { MeshAnimation } from './mesh-animation'
import { MeshProps } from './mesh-props'

export { MeshProps } from './decorators/mesh/mesh-props'
export { MeshAnimation } from './decorators/mesh/mesh-animation'
export declare function Mesh(props?: MeshProps): any
export declare abstract class MeshInterface implements DisplayObject {
  /**
   * Babylon.js objects.
   */
  get babylon(): Pick<BabylonAccessor, 'mesh'>

  /**
   * Scene this Mesh belongs to.
   */
  get scene(): KJS.Scene

  /**
   * Shortcut to basic transform methods and accessors.
   * Using this object is the same than accesing it through 'this.babylon.mesh'.
   */
  get transform(): MeshTransform

  /**
   * Turns ON/OFF 'onLoopUpdate' callback
   */
  set loopUpdate(value: boolean)
  get loopUpdate(): boolean

  /**
   * Sets a mesh manually.
   * Through this method, it is possible to manually create a Babylon Mesh in 'onSpawn' method and apply it.
   * @param babylonMesh
   */
  setMesh(babylonMesh: MeshasBabylonMesh): void

  /**
   * Sets the transform (translation, rotation and scale).
   * @param transform
   */
  setTransform(transform: Matrix): void

  /**
   * Gets the transform.
   * @param transform
   */
  getTransform(): Matrix

  /**
   * Plays an animation. Animations are defined in the Mesh decorator 'props' or manually using 'MeshAnimation' interface.
   * @param animation
   * @param loopOverride
   * @param completed
   */
  playAnimation(animation: MeshAnimation, loopOverride?: boolean, completed?: () => void): void

  /**
   * Stops current animation.
   */
  stopAnimation(): void

  /**
   * Callback invoked after the mesh has been spawned in a scene.
   */
  onSpawn?(scene: KJS.Scene): void

  /**
   * Callback invoked on loop update.
   * @param delta Time differential since last frame.
   */
  onLoopUpdate?(delta: number): void

  /**
   * Callback invoked on canvas resize.
   * @param canvasSize Canvas Rect.
   */
  onCanvasResize?(size: Rect): void
}
