import * as BABYLON from '@babylonjs/core'

import {
  ActionInterface,
  LoadingProgress
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  AssetsController,
  MeshesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import { MeshTransform } from '../../types/mesh-transform'
import {
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  objectToString,
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

export function Mesh(props: MeshProps = {}): any {
  return function <T extends { new (...args: any[]): MeshInterface }>(constructorOrTarget: (T & MeshInterface) | any, contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements MeshInterface {
        constructor(readonly scene: SceneInterface, props: MeshProps) {
          super()
          this.props = props
          if (scene) {
            this.initialize()
          }
        }

        initialize() {
          invokeCallback(this.onSpawn, this, this.scene)
        }

        // ***************
        // MeshInterface
        // ***************
        props: MeshProps
        babylon: Pick<BabylonAccessor, 'mesh'> = { mesh: null as any }
        animation: MeshAnimation | null = null
        animations: Map<FlexId, MeshAnimation> = new Map<FlexId, MeshAnimation>()
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return this._loopUpdate }

        get absolutePosition(): BABYLON.Vector3 { return this.babylon.mesh.absolutePosition }
        get absoluteRotationQuaternion(): BABYLON.Quaternion { return this.babylon.mesh.absoluteRotationQuaternion }
        get absoluteScaling(): BABYLON.Vector3 { return this.babylon.mesh.absoluteScaling }
        set position(value: BABYLON.Vector3) { this.babylon.mesh.position = value }
        get position(): BABYLON.Vector3 { return this.babylon.mesh.position }
        set rotation(value: BABYLON.Vector3) { this.babylon.mesh.rotation = value }
        get rotation(): BABYLON.Vector3 { return this.babylon.mesh.rotation }
        set rotationQuaternion(value: BABYLON.Quaternion) { this.babylon.mesh.rotationQuaternion = value }
        get rotationQuaternion(): BABYLON.Nullable<BABYLON.Quaternion> { return this.babylon.mesh.rotationQuaternion }
        set scaling(value: BABYLON.Vector3) { this.babylon.mesh.scaling = value }
        get scaling(): BABYLON.Vector3 { return this.babylon.mesh.scaling }
        addRotation(x: number, y: number, z: number): BABYLON.TransformNode { return this.babylon.mesh.addRotation(x, y, z) }
        getAbsolutePivotPoint(): BABYLON.Vector3 { return this.babylon.mesh.getAbsolutePivotPoint() }
        getAbsolutePivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.getAbsolutePivotPointToRef(result) }
        getAbsolutePosition(): BABYLON.Vector3 { return this.babylon.mesh.getAbsolutePosition() }
        getDirection(localAxis: BABYLON.Vector3): BABYLON.Vector3 { return this.babylon.mesh.getDirection(localAxis) }
        getDirectionToRef(localAxis: BABYLON.Vector3, result: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.getDirectionToRef(localAxis, result) }
        getPivotPoint(): BABYLON.Vector3 { return this.babylon.mesh.getPivotPoint() }
        getPivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.getPivotPointToRef(result) }
        locallyTranslate(vector3: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.locallyTranslate(vector3) }
        lookAt(targetPoint: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number, space?: BABYLON.Space): BABYLON.TransformNode { return this.babylon.mesh.lookAt(targetPoint, yawCor, pitchCor, rollCor, space) }
        rotate(axis: BABYLON.Vector3, amount: number, space?: BABYLON.Space): BABYLON.TransformNode { return this.babylon.mesh.rotate(axis, amount, space) }
        rotateAround(point: BABYLON.Vector3, axis: BABYLON.Vector3, amount: number): BABYLON.TransformNode { return this.babylon.mesh.rotateAround(point, axis, amount) }
        rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): BABYLON.AbstractMesh { return this.babylon.mesh.rotatePOV(flipBack, twirlClockwise, tiltRight) }
        setAbsolutePosition(absolutePosition: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.setAbsolutePosition(absolutePosition) }
        setDirection(localAxis: BABYLON.Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): BABYLON.TransformNode { return this.babylon.mesh.setDirection(localAxis, yawCor, pitchCor, rollCor) }
        setPivotMatrix(matrix: BABYLON.DeepImmutable<BABYLON.Matrix>, postMultiplyPivotMatrix?: boolean): BABYLON.TransformNode { return this.babylon.mesh.setPivotMatrix(matrix, postMultiplyPivotMatrix) }
        setPivotPoint(point: BABYLON.Vector3, space?: BABYLON.Space): BABYLON.TransformNode { return this.babylon.mesh.setPivotPoint(point, space) }
        setPositionWithLocalVector(vector3: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.setPositionWithLocalVector(vector3) }
        translate(axis: BABYLON.Vector3, distance: number, space?: BABYLON.Space): BABYLON.TransformNode { return this.babylon.mesh.translate(axis, distance, space) }
        set visibility(value: number) { this.babylon.mesh.visibility = value }
        get visibility(): number { return this.babylon.mesh.visibility }

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
          return null as any
        }

        clearKeyframeSubscriptions(keyframeId: string): void {
        // TODO
        }

        release(): void {
          invokeCallback(this.onDestroy, this)
          this.stopAnimation()
          this.babylon.mesh.dispose()
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }

        destroy(): void {
          this.scene.remove.mesh(this)
        }
      }
      const _classCore = class implements MeshCore {
        props = props
        Instance: MeshInterface = new _classInterface(null as any, null as any)
        meshes: Map<SceneInterface, BABYLON.AbstractMesh> = new Map<SceneInterface, BABYLON.AbstractMesh>()

        load(scene: SceneInterface): LoadingProgress {
          /* const progress = new LoadingProgress()
          if (this.meshes.get(scene)) {
            return progress.complete()
          } else {
            if (this.props.url) {
              if (!this.props.meshId) { Logger.debugError(`'meshId' must be defined to load a mesh from a babylon scene file. Mesh url: '${this.props.url}'.`); return null as any }
              const asset = AssetsController.getAsset(this.props.url)
              if (!asset) { Logger.debugError(`Asset '${this.props.url}' not found on mesh load:`, _classInterface.prototype) }
              // 8a8f hay que indicar path y file para que SceneLoader cargue las texturas de la misma carpeta ya que el archivo lo requiere.
              // Por tanto no es suficiente con almacenar únicamente el archivo .babylon como asset, sino que habría que almacenar todos los archivos necesarios para la malla.
              // Cuando no se indica escena, parece que babylon asocia la malla a la última escena creada, lo cual no es lo deseado ya que quiero almacenar la malla (y sus assets) en memoria para utilziarla en cualquier escena.
              BABYLON.SceneLoader.ImportMeshAsync('', '', asset?.objectURL)
              // BABYLON.SceneLoader.AppendAsync('', asset?.objectURL, scene.babylon.scene) // 8a8f where is the texture?
                .then(babylonScene => {
                  const mesh = babylonScene.meshes.find(mesh => mesh.id === this.props.meshId)
                  if (mesh) {
                    this.meshes.set(scene, mesh)
                  } else {
                    Logger.error(`Mesh Id '${this.props.meshId}' not found in babylon scene '${this.props.url}'`, _classInterface.prototype)
                  }
                  progress.complete()
                })
                .catch(error => {
                  Logger.error('Error loading mesh:', objectToString(error), _classInterface.prototype)
                  progress.error(error)
                })
              return progress
            } else {
              return progress.complete()
            }
          } */
          return new LoadingProgress().complete()
        }

        unload(scene: SceneInterface): void {
          // TODO
        }

        spawn(scene: SceneInterface): MeshInterface {
          const mesh = new _classInterface(scene, this.props)
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
      abstract class _meshInterface extends MeshInterface {}

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.meshes.push({
        propertyName: contextOrProperty as string,
        classDefinition: _meshInterface as any
      })
    } else {
      Logger.debugError('Cannot apply mesh decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
