import {
  Matrix,
  Mesh as BabylonMesh,
  Observer
} from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { MeshesController } from '../../controllers/meshes-controller'
import {
  BabylonAccessor,
  Rect
} from '../../models'
import { Logger } from '../../modules'
import { MeshTransform } from '../../types'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate
} from '../../utils/utils'
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
      babylon: Pick<BabylonAccessor, 'mesh'> = { mesh: null }
      loopUpdate$: Observer<number>
      canvasResize$: Observer<Rect>

      onSpawn?(scene: SceneType): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      setMesh(babylonMesh: BabylonMesh): void {
        if (this.babylon.mesh) {
          const transform = this.getTransform()
          this.babylon.mesh.dispose()
          this.babylon.mesh = babylonMesh
          this.setTransform(transform)
        } else {
          this.babylon.mesh = babylonMesh
        }
        this.transform = this.babylon.mesh
        attachLoopUpdate(this)
        attachCanvasResize(this)
      }

      // ***************
      // DisplayObject
      // ***************
      transform: MeshTransform

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

      release(): void {
        // 8a8f
        removeLoopUpdate(this)
        removeCanvasResize(this)
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

      spawn(scene: SceneType): MeshInterface {
        const mesh = new _classInterface(scene, this.props)
        invokeCallback(mesh.onSpawn, mesh, scene)
        return mesh
      }
    }
    MeshesController.register(new _classCore())
    return _classInterface
  }
}
