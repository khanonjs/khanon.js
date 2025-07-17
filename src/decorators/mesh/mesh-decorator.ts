import { Animation } from '@babylonjs/core/Animations/animation'
import { AnimationEvent } from '@babylonjs/core/Animations/animationEvent'
import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader.js'
import {
  Color3,
  Color4,
  Space,
  Vector2
} from '@babylonjs/core/Maths/math'
import {
  Matrix,
  Quaternion,
  Vector3
} from '@babylonjs/core/Maths/math.vector'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { InstancedMesh } from '@babylonjs/core/Meshes/instancedMesh'
import { Mesh as BabylonMesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import {
  Observable,
  Observer
} from '@babylonjs/core/Misc/observable'
import { RenderingManager } from '@babylonjs/core/Rendering/renderingManager'
import {
  DeepImmutable,
  Nullable
} from '@babylonjs/core/types'

import {
  AssetDataMesh,
  LoadingProgress
} from '../../base'
import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  AssetsController,
  MeshesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  attachCanvasResize,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { ActorActionInterface } from '../actor/actor-action/actor-action-interface'
import { ActorInterface } from '../actor/actor-interface'
import { ActorStateInterface } from '../actor/actor-state/actor-state-interface'
import { ParticleInterface } from '../particle/particle-interface'
import { SceneActionInterface } from '../scene/scene-action/scene-action-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SceneStateInterface } from '../scene/scene-state/scene-state-interface'
import { MeshAnimation } from './mesh-animation'
import { MeshAnimationOptions } from './mesh-animation-options'
import { MeshCore } from './mesh-core'
import { MeshInterface } from './mesh-interface'
import { MeshProps } from './mesh-props'

export function Mesh(props: MeshProps = {}): any {
  return function <T extends { new (...args: any[]): MeshInterface }>(constructorOrTarget: (T & MeshInterface), contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const className = constructorOrTarget.name
    const decorateClass = () => {
      const _classInterface = class extends constructorOrTarget implements MeshInterface {
        constructor(readonly scene: SceneInterface, props: MeshProps) {
          super()
          this._props = props
          if (scene) {
            this.babylon.scene = this.scene.babylon.scene
            if (this._props.url) {
              const assetContainer = core.assetContainers.get(scene)
              if (assetContainer) {
                const entries = assetContainer.instantiateModelsToScene((name) => name, undefined, {
                  doNotInstantiate: !this._props.cloneByInstances
                })
                this._props.animations?.forEach(animation => {
                  const animationGroup = entries.animationGroups.find(animationGroup => animation.id === animationGroup.name)
                  if (animationGroup) {
                    const definedAnim = this._props.animations?.find(_anim => _anim.id === animationGroup.name)
                    if (definedAnim) {
                      this.addAnimation({
                        id: animationGroup.name,
                        animationGroup,
                        loop: animation.loop,
                        keyFrames: animation.keyFrames,
                        speedRatio: animation.speedRatio
                      })
                    }
                  } else {
                    Logger.error(`Animation '${animation.id}' not found in mesh '${this._props.url}':`, this.getClassName())
                  }
                })
                const mesh = entries.rootNodes[0] as BabylonMesh
                mesh.name = 'Mesh - ' + this._props.url
                this.setMesh(mesh)
              } else {
                Logger.error(`AssetContainer mesh '${this._props.url}' not for spawn:`, this.getClassName(), scene.getClassName())
              }
            }
            switchLoopUpdate(this._loopUpdate, this)
            attachCanvasResize(this)
            if (this._props.renderingGroupId) {
              if (this._props.renderingGroupId >= RenderingManager.MAX_RENDERINGGROUPS) {
                Logger.warn(`Using a renderingGroupId higher than maximum value ${RenderingManager.MAX_RENDERINGGROUPS - 1}`, this.getClassName())
              }
              this._getMeshHierarchy().forEach(mesh => { mesh.renderingGroupId = this._props.renderingGroupId ?? 0 })
            }
            invokeCallback(this.onSpawn, this)
          }
        }

        getClassName(): string { return this._className ?? className }

        setTimeout(func: () => void, ms: number): Timeout { return Core.setTimeout(func, ms, this) }
        setInterval(func: () => void, ms: number): Timeout { return Core.setInterval(func, ms, this) }
        clearTimeout(timeout: Timeout): void { Core.clearTimeout(timeout) }
        clearInterval(interval: Timeout): void { Core.clearInterval(interval) }
        clearAllTimeouts(): void { Core.clearAllTimeoutsByContext(this) }

        _props: MeshProps
        _className: string
        babylon: Pick<BabylonAccessor, 'mesh' | 'scene'> = { mesh: null as any, scene: null as any }
        _animation: MeshAnimation | null = null
        _animations: Map<FlexId, MeshAnimation> = new Map<FlexId, MeshAnimation>()
        _loopUpdate$: Observer<number>
        _canvasResize$: Observer<Rect>
        _loopUpdate = false

        set loopUpdate(value: boolean) {
          this._loopUpdate = value
          switchLoopUpdate(this._loopUpdate, this)
        }

        get loopUpdate(): boolean { return this._loopUpdate }

        get enabled(): boolean {
          return this.babylon.mesh.isEnabled() ?? false
        }

        set enabled(value: boolean) {
          if (value) {
            switchLoopUpdate(this._loopUpdate, this)
          } else {
            removeLoopUpdate(this)
          }
          this.babylon.mesh.setEnabled(value)
        }

        get animation(): MeshAnimation | null {
          return this._animation
        }

        set visibility(value: number) {
          this._getMeshHierarchy().forEach(mesh => { mesh.visibility = value })
        }

        get visibility(): number { return this.babylon.mesh.visibility }
        get absolutePosition(): Vector3 { return this.babylon.mesh.absolutePosition }
        get absoluteRotationQuaternion(): Quaternion { return this.babylon.mesh.absoluteRotationQuaternion }
        get absoluteScaling(): Vector3 { return this.babylon.mesh.absoluteScaling }
        set position(value: Vector3) { this.babylon.mesh.position = value }
        get position(): Vector3 { return this.babylon.mesh.position }
        set rotation(value: Vector3) { this.babylon.mesh.rotation = value }
        get rotation(): Vector3 { return this.babylon.mesh.rotation }
        set rotationQuaternion(value: Quaternion) { this.babylon.mesh.rotationQuaternion = value }
        get rotationQuaternion(): Nullable<Quaternion> { return this.babylon.mesh.rotationQuaternion }
        set scaling(value: Vector3) { this.babylon.mesh.scaling = value }
        get scaling(): Vector3 { return this.babylon.mesh.scaling }
        addRotation(x: number, y: number, z: number): TransformNode { return this.babylon.mesh.addRotation(x, y, z) }
        getAbsolutePivotPoint(): Vector3 { return this.babylon.mesh.getAbsolutePivotPoint() }
        getAbsolutePivotPointToRef(result: Vector3): TransformNode { return this.babylon.mesh.getAbsolutePivotPointToRef(result) }
        getAbsolutePosition(): Vector3 { return this.babylon.mesh.getAbsolutePosition() }
        getDirection(localAxis: Vector3): Vector3 { return this.babylon.mesh.getDirection(localAxis) }
        getDirectionToRef(localAxis: Vector3, result: Vector3): TransformNode { return this.babylon.mesh.getDirectionToRef(localAxis, result) }
        getPivotPoint(): Vector3 { return this.babylon.mesh.getPivotPoint() }
        getPivotPointToRef(result: Vector3): TransformNode { return this.babylon.mesh.getPivotPointToRef(result) }
        locallyTranslate(vector3: Vector3): TransformNode { return this.babylon.mesh.locallyTranslate(vector3) }
        lookAt(targetPoint: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number, space?: Space): TransformNode { return this.babylon.mesh.lookAt(targetPoint, yawCor, pitchCor, rollCor, space) }
        rotate(axis: Vector3, amount: number, space?: Space): TransformNode { return this.babylon.mesh.rotate(axis, amount, space) }
        rotateAround(point: Vector3, axis: Vector3, amount: number): TransformNode { return this.babylon.mesh.rotateAround(point, axis, amount) }
        rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): AbstractMesh { return this.babylon.mesh.rotatePOV(flipBack, twirlClockwise, tiltRight) }
        setAbsolutePosition(absolutePosition: Vector3): TransformNode { return this.babylon.mesh.setAbsolutePosition(absolutePosition) }
        setDirection(localAxis: Vector3, yawCor?: number, pitchCor?: number, rollCor?: number): TransformNode { return this.babylon.mesh.setDirection(localAxis, yawCor, pitchCor, rollCor) }
        setPivotMatrix(matrix: DeepImmutable<Matrix>, postMultiplyPivotMatrix?: boolean): TransformNode { return this.babylon.mesh.setPivotMatrix(matrix, postMultiplyPivotMatrix) }
        setPivotPoint(point: Vector3, space?: Space): TransformNode { return this.babylon.mesh.setPivotPoint(point, space) }
        setPositionWithLocalVector(vector3: Vector3): TransformNode { return this.babylon.mesh.setPositionWithLocalVector(vector3) }
        translate(axis: Vector3, distance: number, space?: Space): TransformNode { return this.babylon.mesh.translate(axis, distance, space) }

        setMesh(babylonMesh: BabylonMesh | InstancedMesh): void {
          if (this.babylon.mesh) {
            this._release()
          }
          this.babylon.mesh = babylonMesh
          this.enabled = true
        }

        setMaterialTransparencyMode(value: number, applyToHierarchy = true) {
          let meshes: AbstractMesh[] = []
          if (applyToHierarchy) {
            meshes = this._getMeshHierarchy()
          } else {
            meshes = [this.babylon.mesh]
          }
          meshes.forEach(mesh => {
            if (mesh.material) {
              mesh.material.transparencyMode = value
            }
          })
        }

        setFrame(frame: number) {
          this._animation?.animationGroup.goToFrame(frame)
        }

        _animationCreateEvent(aniGroup: AnimationGroup): Animation {
          const eventAni = aniGroup.targetedAnimations[0].animation.clone()
          eventAni.name = `Keyframes - ${aniGroup.name}`
          const tmpTarget = this._animationCreateTemporalTarget(eventAni)
          aniGroup.addTargetedAnimation(eventAni, {
            name: 'events',
            ...tmpTarget
          })
          return eventAni
        }

        _animationCreateTemporalTarget(ani: Animation) {
          switch (ani.dataType) {
          case Animation.ANIMATIONTYPE_COLOR3:
            return { [ani.targetPropertyPath[0]]: Color3.White() }
          case Animation.ANIMATIONTYPE_COLOR4:
            return { [ani.targetPropertyPath[0]]: Color4.FromInts(0, 0, 0, 0) }
          case Animation.ANIMATIONTYPE_FLOAT:
            return { [ani.targetPropertyPath[0]]: 0 }
          case Animation.ANIMATIONTYPE_MATRIX:
            return { [ani.targetPropertyPath[0]]: Matrix.Zero() }
          case Animation.ANIMATIONTYPE_QUATERNION:
            return { [ani.targetPropertyPath[0]]: Quaternion.Zero() }
          case Animation.ANIMATIONTYPE_SIZE:
            return { [ani.targetPropertyPath[0]]: Vector3.Zero() }
          case Animation.ANIMATIONTYPE_VECTOR2:
            return { [ani.targetPropertyPath[0]]: Vector2.Zero() }
          case Animation.ANIMATIONTYPE_VECTOR3:
            return { [ani.targetPropertyPath[0]]: Vector3.Zero() }
          default:
            return {}
          }
        }

        addAnimation(animation: MeshAnimation): void {
          if (this._animations.get(animation.id)) {
            Logger.warn(`Trying to add mesh animation '${animation.id}' that has been already added:`, this.getClassName())
          }
          if (animation?.keyFrames && animation.keyFrames.length > 0) {
            animation.keyFrames.forEach(keyFrame => {
              keyFrame.frames.forEach(frame => {
                keyFrame.emitter = new Observable<void>()
                const eventAni = this._animationCreateEvent(animation.animationGroup)
                const aniEvent = new AnimationEvent(frame, () => keyFrame.emitter.notifyObservers())
                eventAni.addEvent(aniEvent)
              })
            })
          }
          this._animations.set(animation.id, animation)
        }

        playAnimation(animationId: FlexId, options?: MeshAnimationOptions, completed?: () => void): AnimationGroup {
          this.stopAnimation()
          if (!this._animations.get(animationId)) {
            Logger.error(`Animation '${animationId}' not found in mesh '${this._props.url}':`, this.getClassName())
            return null as any
          }
          const animation = this._animations.get(animationId)
          if (animation) {
            if (this._animation && this._animation.id === animation.id && !options?.restart === false) {
              return this._animation.animationGroup
            }
            this._animation = animation
            const loop = (options?.loop !== undefined ? options.loop : this._animation.loop) ?? false
            const speedRatio = options?.speedRatio ?? this._animation.speedRatio
            this._animation.animationGroup.start(loop, speedRatio, options?.from, options?.to, options?.isAdditive)
            if (completed) {
              // setTimeouts prevent crash if user plays the same animation on the completed method.
              if (loop) {
                this._animation.animationGroup.onAnimationGroupLoopObservable.add(() => setTimeout(completed, 0))
              } else {
                this._animation.animationGroup.onAnimationGroupEndObservable.add(() => {
                  this.stopAnimation()
                  setTimeout(completed, 0)
                })
              }
            }
            return this._animation.animationGroup
          } else {
            return null as any
          }
        }

        stopAnimation(): void {
          if (this._animation) {
            this._animation.animationGroup.onAnimationGroupLoopObservable.clear()
            this._animation.animationGroup.onAnimationGroupEndObservable.clear()
            this._animation.animationGroup.stop()
            this._animation = null
          }
        }

        subscribeToKeyframe(keyframeId: FlexId, callback: () => void): Observer<void>[] {
          const observers: Observer<void>[] = []
          this._animations.forEach(animation => {
            animation.keyFrames?.filter(keyframe => keyframe.id === keyframeId)
              .forEach(keyframe => observers.push(keyframe.emitter.add(callback)))
          })
          return observers
        }

        clearKeyframeSubscriptions(keyframeId: FlexId): void {
          this._animations.forEach(animation => {
            animation.keyFrames
              ?.filter(keyframe => keyframe.id === keyframeId)
              .forEach(keyframe => keyframe.emitter.clear())
          })
        }

        _getMeshHierarchy(): AbstractMesh[] {
          let meshes: AbstractMesh[] = []
          if (this.babylon.mesh) {
            meshes = [this.babylon.mesh, ...this.babylon.mesh.getChildMeshes()]
          }
          return meshes
        }

        _release(): void {
          invokeCallback(this.onDestroy, this)
          this.clearAllTimeouts()
          this.stopAnimation()
          this._animations.forEach(animation => animation.animationGroup.dispose())
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
        assetContainers: Map<SceneInterface, AssetContainer> = new Map<SceneInterface, AssetContainer>()

        _load(scene: SceneInterface): LoadingProgress {
          if (this.assetContainers.get(scene)) {
            return new LoadingProgress().complete()
          } else {
            if (this.props.url) {
              const asset = AssetsController.getAsset<AssetDataMesh>(this.props.url)
              if (asset && asset.definition.data) {
                const progress = new LoadingProgress()
                LoadAssetContainerAsync(asset.file, scene.babylon.scene)
                  .then((assetContainer) => {
                    this.assetContainers.set(scene, assetContainer)
                    progress.complete()
                  })
                  .catch(error => progress.error(error))
                return progress
              } else {
                Logger.error(`Asset '${this.props.url}' not found on mesh loading:`, this.Instance.getClassName())
                return new LoadingProgress().complete()
              }
            } else {
              return new LoadingProgress().complete()
            }
          }
        }

        _unload(scene: SceneInterface): void {
          const assetContainer = this.assetContainers.get(scene)
          assetContainer?.dispose()
          this.assetContainers.delete(scene)
        }

        spawn(scene: SceneInterface): MeshInterface {
          const mesh = new _classInterface(scene, this.props)
          return mesh
        }

        getClassName(): string {
          return className
        }
      }
      const core = new _classCore()
      MeshesController.register(_classInterface, core)
      return _classInterface
    }

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) { // Defined prototype means it is a decorated class
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof ActorInterface ||
      constructorOrTarget instanceof ActorActionInterface ||
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof SceneActionInterface ||
      constructorOrTarget instanceof ActorStateInterface ||
      constructorOrTarget instanceof SceneStateInterface ||
      constructorOrTarget instanceof ParticleInterface
    ) && !descriptor) { // Undefined descriptor means it is a decorated property, otherwiese it is a decorated method
      @Mesh(props)
      abstract class _meshInterface extends MeshInterface {
        _className = contextOrProperty as any
      }

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.meshes.push({
        propertyName: contextOrProperty as string,
        classDefinition: _meshInterface as any
      })
    } else {
      Logger.error('Cannot apply mesh decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
