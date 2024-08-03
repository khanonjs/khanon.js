import 'reflect-metadata'

import * as BABYLON from '@babylonjs/core'

import { MeshInterface as UserMeshInterface } from '../../'
import {
  ActionInterface,
  LoadingProgress
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import { MeshesController } from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import {
  FlexId,
  MeshTransform
} from '../../types'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorInterface } from '../actor/actor-interface'
import { SceneInterface } from '../scene/scene-interface'
import { MeshAnimation } from './mesh-animation'
import { MeshCore } from './mesh-core'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export function Mesh(props: MeshProps): any {
  return function <T extends { new (...args: any[]): MeshInterface }>(constructorOrTarget: (T & MeshInterface) | any, contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements MeshInterface {
        constructor(readonly scene: SceneInterface, private readonly props: MeshProps) {
          super()
        }

        initialize() {
          invokeCallback(this.onSpawn, this, this.scene)
        }

        // ***************
        // MeshInterface
        // ***************
        babylon: Pick<BabylonAccessor, 'mesh'> = { mesh: null }
        animation: MeshAnimation = null
        animations: Map<FlexId, MeshAnimation> = new Map<FlexId, MeshAnimation>()
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>

        onSpawn?(scene: SceneInterface): void
        onLoopUpdate?(delta: number): void
        onCanvasResize?(size: Rect): void

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

        setMesh(babylonMesh: BABYLON.Mesh): void {
          if (this.babylon.mesh) {
            // const transform = this.getTransform() // TODO
            this.release()
            this.babylon.mesh = babylonMesh
            // this.setTransform(transform) // TODO
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

        // setTransform(transform: BABYLON.Matrix): void {  // TODO
        // this.babylon.mesh.updatePoseMatrix(transform) // TODO: Test this
        // this.setPosition(transform.getTranslation())
        // this.setRotation(transform.getRotationMatrix())
        // this.babylon.mesh.scaling = transform.sca
        // this.babylon.mesh.rota = transform.getTranslation()
        // }

        // getTransform(): BABYLON.Matrix {// TODO
        //   return null
        // }

        setFrame(frame: number): void {
        // TODO
        }

        setFrameFirst(): void {
        // TODO
        }

        setFrameLast(): void {
        // TODO
        }

        addAnimation(animation: MeshAnimation): void {
        // TODO
        }

        playAnimation(animation: MeshAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void {
        // TODO
        }

        stopAnimation(): void {
        // TODO
        }

        subscribeToKeyframe(keyframeId: string, callback: () => void): BABYLON.Observer<void>[] {
        // TODO
          return null
        }

        clearKeyframeSubscriptions(keyframeId: string): void {
        // TODO
        }

        release(): void {
          this.stopAnimation()
          this.babylon.mesh.dispose()
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }
      }
      const _classCore = class implements MeshCore {
        props = props
        Instance: MeshInterface = new _classInterface(null, null)

        load(scene: SceneInterface): LoadingProgress {
          return new LoadingProgress().complete()
        }

        unload(scene: SceneInterface): void {
          // TODO
        }

        spawn(scene: SceneInterface): MeshInterface {
          const mesh = new _classInterface(scene, this.props)
          mesh.initialize()
          return mesh
        }
      }
      MeshesController.register(new _classCore())
      return _classInterface
    }

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) { // Defined prototype means it is a decorated class
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof ActorInterface ||
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof ActionInterface
    ) && !descriptor) { // Undefined descriptor means it is a decorated property, otherwiese it is a decorated method
      @Mesh(props)
      class _meshInterface extends UserMeshInterface {}

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        const metadata = new Metadata()

        Reflect.defineMetadata('metadata', metadata, constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.meshes.push({
        propertyName: contextOrProperty as string,
        classDefinition: _meshInterface
      })
    } else {
      Logger.debugError('Cannot apply mesh decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
