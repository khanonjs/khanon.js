import * as BABYLON from '@babylonjs/core'

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
              if (!assetContainer) { Logger.debugError(`AssetContainer mesh '${this._props.url}' not for spawn:`, this.getClassName(), scene.getClassName()) }
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
                const mesh = entries.rootNodes[0] as BABYLON.Mesh
                mesh.name = 'Mesh - ' + this._props.url
                this.setMesh(mesh)
              }
            }
            switchLoopUpdate(this._loopUpdate, this)
            attachCanvasResize(this)
            if (this._props.renderingGroupId) {
              if (this._props.renderingGroupId >= BABYLON.RenderingManager.MAX_RENDERINGGROUPS) { Logger.debugError(`Using a renderingGroupId higher than maximum value ${BABYLON.RenderingManager.MAX_RENDERINGGROUPS - 1}`, this.getClassName()) }
              this.babylon.mesh.renderingGroupId = this._props.renderingGroupId
              this.babylon.mesh.getChildMeshes().forEach(child => { child.renderingGroupId = this._props.renderingGroupId ?? 0 })
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
        _loopUpdate$: BABYLON.Observer<number>
        _canvasResize$: BABYLON.Observer<Rect>
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
          this.babylon.mesh.visibility = value
          this.babylon.mesh.getChildMeshes().forEach(child => { child.visibility = value })
        }

        get visibility(): number { return this.babylon.mesh.visibility }
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

        setMesh(babylonMesh: BABYLON.Mesh | BABYLON.InstancedMesh): void {
          if (this.babylon.mesh) {
            this._release()
          }
          this.babylon.mesh = babylonMesh
          this.enabled = true
        }

        setFrame(frame: number) {
          this._animation?.animationGroup.goToFrame(frame)
        }

        _animationCreateEvent(aniGroup: BABYLON.AnimationGroup): BABYLON.Animation {
          const eventAni = aniGroup.targetedAnimations[0].animation.clone()
          eventAni.name = `Keyframes - ${aniGroup.name}`
          const tmpTarget = this._animationCreateTemporalTarget(eventAni)
          aniGroup.addTargetedAnimation(eventAni, {
            name: 'events',
            ...tmpTarget
          })
          return eventAni
        }

        _animationCreateTemporalTarget(ani: BABYLON.Animation) {
          switch (ani.dataType) {
          case BABYLON.Animation.ANIMATIONTYPE_COLOR3:
            return { [ani.targetPropertyPath[0]]: BABYLON.Color3.White() }
          case BABYLON.Animation.ANIMATIONTYPE_COLOR4:
            return { [ani.targetPropertyPath[0]]: BABYLON.Color4.FromInts(0, 0, 0, 0) }
          case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
            return { [ani.targetPropertyPath[0]]: 0 }
          case BABYLON.Animation.ANIMATIONTYPE_MATRIX:
            return { [ani.targetPropertyPath[0]]: BABYLON.Matrix.Zero() }
          case BABYLON.Animation.ANIMATIONTYPE_QUATERNION:
            return { [ani.targetPropertyPath[0]]: BABYLON.Quaternion.Zero() }
          case BABYLON.Animation.ANIMATIONTYPE_SIZE:
            return { [ani.targetPropertyPath[0]]: BABYLON.Vector3.Zero() }
          case BABYLON.Animation.ANIMATIONTYPE_VECTOR2:
            return { [ani.targetPropertyPath[0]]: BABYLON.Vector2.Zero() }
          case BABYLON.Animation.ANIMATIONTYPE_VECTOR3:
            return { [ani.targetPropertyPath[0]]: BABYLON.Vector3.Zero() }
          default:
            return {}
          }
        }

        addAnimation(animation: MeshAnimation): void {
          if (this._animations.get(animation.id)) { Logger.debugError(`Trying to add mesh animation '${animation.id}' that has been already added:`, this.getClassName()) }
          if (animation?.keyFrames && animation.keyFrames.length > 0) {
            animation.keyFrames.forEach(keyFrame => {
              keyFrame.frames.forEach(frame => {
                keyFrame.emitter = new BABYLON.Observable<void>()
                const eventAni = this._animationCreateEvent(animation.animationGroup)
                const aniEvent = new BABYLON.AnimationEvent(frame, () => keyFrame.emitter.notifyObservers())
                eventAni.addEvent(aniEvent)
              })
            })
          }
          this._animations.set(animation.id, animation)
        }

        playAnimation(animationId: FlexId, options?: MeshAnimationOptions, completed?: () => void): BABYLON.AnimationGroup {
          this.stopAnimation()
          if (!this._animations.get(animationId)) { Logger.debugError(`Animation '${animationId}' not found in mesh '${this._props.url}':`, this.getClassName()) }
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

        subscribeToKeyframe(keyframeId: FlexId, callback: () => void): BABYLON.Observer<void>[] {
          const observers: BABYLON.Observer<void>[] = []
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
        assetContainers: Map<SceneInterface, BABYLON.AssetContainer> = new Map<SceneInterface, BABYLON.AssetContainer>()

        load(scene: SceneInterface): LoadingProgress {
          if (this.assetContainers.get(scene)) {
            return new LoadingProgress().complete()
          } else {
            if (this.props.url) {
              const asset = AssetsController.getAsset<AssetDataMesh>(this.props.url)
              if (asset && asset.definition.data) {
                const progress = new LoadingProgress()
                BABYLON.LoadAssetContainerAsync(asset.file, scene.babylon.scene)
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

        unload(scene: SceneInterface): void {
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
      MeshesController.register(core)
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
      // TODO: Store the 'className' to debug it in logs.

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
