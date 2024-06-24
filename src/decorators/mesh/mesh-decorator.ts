import {
  Matrix,
  Mesh as BabylonMesh
} from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { LoadingProgress } from '../../base'
import { MeshesController } from '../../controllers/meshes-controller'
import { BabylonAccessor } from '../../models'
import { Logger } from '../../modules'
import { invokeCallback } from '../../utils/utils'
import { SceneType } from '../scene/scene-type'
import { MeshCore } from './mesh-core'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): MeshInterface }>(constructor: T & MeshInterface, context: ClassDecoratorContext) {
    const _classInterface = class extends constructor implements MeshInterface {
      constructor(readonly scene: SceneType, private readonly props: MeshProps) {
        super()
      }

      // ***************
      // MeshInterface
      // ***************

      /**
       * Public
       */
      babylon: Pick<BabylonAccessor, 'scene' | 'mesh'> = { scene: null, mesh: null }

      setMesh(babylonMesh: BabylonMesh): void {
        if (this.babylon.mesh) {
          const transform = this.getTransform()
          this.babylon.mesh.dispose()
          this.babylon.mesh = babylonMesh
          this.setTransform(transform)
        } else {
          this.babylon.mesh = babylonMesh
        }
      }

      /**
       * User defined
       */
      onSpawn?(scene: SceneType): void

      /**
       * Private
       */
      release(): void {
        // 8a8f
      }

      // ***************
      // DisplayObject
      // ***************
      private _visible: boolean
      private _scale: number = 1

      set visible(value: boolean) {
        // 8a8f
        this._visible = value
      }

      get visible(): boolean {
        return this._visible
      }

      setScale(scale: number): void {
        this._scale = scale
        this.babylon.mesh.scaling = new Vector3(this._scale, this._scale, this._scale)
      }

      getScale(): number {
        return this._scale
      }

      setTransform(transform: Matrix): void {
        // 8a8f
        // this.babylon.mesh.updatePoseMatrix(transform) // TODO: Test this
        // this.setPosition(transform.getTranslation())
        // this.setRotation(transform.getRotationMatrix())  // 8a8f
        // this.babylon.mesh.scaling = transform.sca
        // this.babylon.mesh.rota = transform.getTranslation()
      }

      getTransform(): Matrix {
        // 8a8f
        return null
      }

      playAnimation(animation: any/* SpriteAnimation | MeshAnimation */, loopOverride?: boolean, completed?: () => void): void {
        // 8a8f
      }

      stopAnimation(): void {

      }
    }
    const _classCore = class implements MeshCore {
      props = props
      Instance: MeshInterface = new _classInterface(null, null)

      load(scene: SceneType): LoadingProgress {
        return new LoadingProgress().complete()
      }

      unload(scene: SceneType): void {

      }

      spawn(scene: SceneType): MeshInterface { // 8a8f es necesaria la escena aquí
        Logger.trace('aki MeshCore spawn')
        const mesh = new _classInterface(scene, this.props)
        invokeCallback(mesh.onSpawn, mesh, scene)
        mesh.visible = true
        return mesh
      }
    }
    MeshesController.register(new _classCore())
    return _classInterface
  }
}
