import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import { Core } from '../../base/core/core'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  AssetsController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { DrawBlockProperties } from '../../models/draw-block-properties'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger'
import { FlexId } from '../../types/flex-id'
import {
  applyDefaults,
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  isFlexId,
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
import { SpriteAnimation } from './sprite-animation'
import { SpriteAnimationOptions } from './sprite-animatrion-options'
import { SpriteCore } from './sprite-core'
import { SpriteInterface } from './sprite-interface'
import { SpriteMesh } from './sprite-mesh'
import { SpriteParticleInfo } from './sprite-particle-data'
import { SpriteProps } from './sprite-props'
import { spritePropsDefault } from './sprite.props.deafult'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): SpriteInterface }>(constructorOrTarget: (T & SpriteInterface) | any, contextOrProperty: ClassDecoratorContext | string, descriptor: PropertyDescriptor) {
    const decorateClass = () => {
      const _className = constructorOrTarget.name
      const _classInterface = class extends constructorOrTarget implements SpriteInterface {
        constructor(readonly scene: SceneInterface, props: SpriteProps) {
          super()
          this.props = props
          if (scene) {
            this.babylon.scene = this.scene.babylon.scene
            if (!this.props.url) {
              const spriteMesh = new SpriteMesh(scene, this.props)
              spriteMesh.setFromBlank(_className)
              this.setSpriteMesh(spriteMesh, true)
            } else {
              if (!core.spriteMeshes.get(scene)) { Logger.debugError('Sprite texture not found for scene in sprite constructor:', _classInterface.prototype, scene.constructor.name) } // TODO get sprite and scene names
              this.setSpriteMesh(core.spriteMeshes.get(scene) as any, false)
            }
            attachLoopUpdate(this)
            attachCanvasResize(this)
            invokeCallback(this.onSpawn, this)
          }
        }

        props: SpriteProps
        spriteMesh: SpriteMesh
        exclusiveTexture: boolean
        animation: SpriteAnimation | null = null
        animations: Map<FlexId, SpriteAnimation> = new Map<FlexId, SpriteAnimation>()
        babylon: Pick<BabylonAccessor, 'mesh' | 'scene'> = { scene: null as any, mesh: null as any }
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>
        keyFramesTimeouts: Timeout[] = []
        endAnimationTimerInterval: Timeout | null
        endAnimationTimerTimeout: Timeout | null
        _visible: boolean
        _scale: number = 1

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return this._loopUpdate }

        set visibility(value: number) {
          this.babylon.mesh.visibility = value;
          (this.babylon.mesh.material as BABYLON.ShaderMaterial).setFloat('alpha', this.babylon.mesh.visibility)
        }

        get visibility(): number { return this.babylon.mesh.visibility }

        get absolutePosition(): BABYLON.Vector3 { return this.babylon.mesh.absolutePosition }
        set position(value: BABYLON.Vector3) { this.babylon.mesh.position = value }
        get position(): BABYLON.Vector3 { return this.babylon.mesh.position }
        set rotation(value: number) { this.babylon.mesh.rotation.z = value }
        get rotation(): number { return this.babylon.mesh.rotation.z }
        set scale(value: number) { this.babylon.mesh.scaling.set(value, value, 1.0) }
        get scale(): number {
          if (this.babylon.mesh.scaling.x !== this.babylon.mesh.scaling.y) { Logger.debugError(`ScaleX '${this.babylon.mesh.scaling.x}' is different than ScaleY '${this.babylon.mesh.scaling.y}', it is a mistake to setup different scales for both coordinates treating them as equals through 'get scale' method.`, _classInterface.prototype) }
          return this.babylon.mesh.scaling.x
        }

        set scaleX(value: number) { this.babylon.mesh.scaling.set(value, this.babylon.mesh.scaling.y, 1.0) }
        get scaleX(): number { return this.babylon.mesh.scaling.x }
        set scaleY(value: number) { this.babylon.mesh.scaling.set(this.babylon.mesh.scaling.x, value, 1.0) }
        get scaleY(): number { return this.babylon.mesh.scaling.y }
        getAbsolutePivotPoint(): BABYLON.Vector3 { return this.babylon.mesh.getAbsolutePivotPoint() }
        getAbsolutePivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.getAbsolutePivotPointToRef(result) }
        getAbsolutePosition(): BABYLON.Vector3 { return this.babylon.mesh.getAbsolutePosition() }
        getPivotPoint(): BABYLON.Vector3 { return this.babylon.mesh.getPivotPoint() }
        getPivotPointToRef(result: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.getPivotPointToRef(result) }
        locallyTranslate(vector3: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.locallyTranslate(vector3) }
        rotateAround(point: BABYLON.Vector3, axis: BABYLON.Vector3, amount: number): BABYLON.TransformNode { return this.babylon.mesh.rotateAround(point, axis, amount) }
        setAbsolutePosition(absolutePosition: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.setAbsolutePosition(absolutePosition) }
        setPivotMatrix(matrix: BABYLON.DeepImmutable<BABYLON.Matrix>, postMultiplyPivotMatrix?: boolean): BABYLON.TransformNode { return this.babylon.mesh.setPivotMatrix(matrix, postMultiplyPivotMatrix) }
        setPivotPoint(point: BABYLON.Vector3, space?: BABYLON.Space): BABYLON.TransformNode { return this.babylon.mesh.setPivotPoint(point, space) }
        setPositionWithLocalVector(vector3: BABYLON.Vector3): BABYLON.TransformNode { return this.babylon.mesh.setPositionWithLocalVector(vector3) }
        translate(axis: BABYLON.Vector3, distance: number, space?: BABYLON.Space): BABYLON.TransformNode { return this.babylon.mesh.translate(axis, distance, space) }

        setSpriteMesh(spriteMesh: SpriteMesh, isExclusive: boolean) {
          if (this.babylon.mesh) {
            this.release()
          }
          this.spriteMesh = spriteMesh
          this.exclusiveTexture = isExclusive
          this.babylon.mesh = spriteMesh.spawn()
          this.props.animations?.forEach(animation => this.addAnimation(animation))
        }

        setShaderMaterialTextureFrame(frame: number): void {
          (this.babylon.mesh.material as BABYLON.ShaderMaterial).setInt('frame', frame)
        }

        setEnabled(value: boolean): void {
          if (value) {
            attachLoopUpdate(this)
          } else {
            removeLoopUpdate(this)
          }
          this.babylon.mesh.setEnabled(value)
        }

        setFrame(frame: number): void {
          if (frame < this.getFirstFrame() || frame > this.getLastFrame()) { Logger.debugError(`Calling out of bound setFrame(${frame}) - Start: ${this.getFirstFrame()}, End: ${this.getLastFrame()}`) }
          this.stopAnimation()
          this.visible = true
          this.setShaderMaterialTextureFrame(frame)
        }

        private getFirstFrame(): number {
          return this.animation?.frameStart ?? 0
        }

        private getLastFrame(): number {
          return this.animation?.frameEnd ?? (this.props.numFrames ? this.props.numFrames - 1 : 0)
        }

        addAnimation(animation: SpriteAnimation): void {
          if (this.animations.get(animation.id)) { Logger.debugError(`Animation name '${animation.id}' already exists.`); return }
          if (!animation.delay) {
            animation.delay = 100
          }
          if (!animation.loop) {
            animation.loop = false
          }
          if (animation.keyFrames) {
            animation.keyFrames.forEach((keyFrame) => {
              keyFrame.emitter = new BABYLON.Observable<void>()
              keyFrame.ms = []
              keyFrame.frames.forEach((frame) => {
                keyFrame.ms.push((frame - animation.frameStart) * animation.delay)
              })
            })
          }
          this.animations.set(animation.id, animation)
        }

        playAnimation(animation: SpriteAnimation | FlexId, options?: SpriteAnimationOptions, completed?: () => void): void {
          if (isFlexId(animation)) {
            if (!this.animations.get(animation as FlexId)) { Logger.debugError(`Animation '${animation}' doesn't exist in sprite:`, _classInterface.prototype); return }
            animation = this.animations.get(animation as FlexId) as SpriteAnimation
          }
          this.animation = animation as SpriteAnimation
          const frameStart = this.getFirstFrame()
          const frameEnd = this.getLastFrame()
          const delay = this.animation.delay
          const loop = options?.loop ?? this.animation.loop
          const keyFrames = this.animation.keyFrames

          this.visible = true
          this.removeEndAnimationTimer()
          this.removeAnimationKeyFrames()

          const startKeyframes = () => {
            this.keyFramesTimeouts = []
            keyFrames?.forEach((animationKeyFrame) => {
              if (animationKeyFrame.emitter.hasObservers()) {
                animationKeyFrame.ms.forEach((ms) => {
                  this.keyFramesTimeouts.push(Core.setTimeout(() => animationKeyFrame.emitter.notifyObservers(), ms))
                })
              }
            })
          }

          const onCompleted = () => {
            if (completed) {
              completed()
            }
            if (loop) {
              startKeyframes()
            }
          }

          if (completed || (keyFrames && keyFrames.length > 0)) {
            if (loop) {
              this.endAnimationTimerInterval = Core.setInterval(() => onCompleted(), (frameEnd - frameStart + 1) * delay)
            } else {
              this.endAnimationTimerTimeout = Core.setTimeout(() => onCompleted(), (frameEnd - frameStart + 1) * delay)
            }
            startKeyframes()
          }

          this.scene.setAnimationHandler(this, {
            id: this.animation.id,
            frameStart,
            frameEnd,
            delay,
            loop
          })
        }

        stopAnimation(): void {
          this.removeEndAnimationTimer()
          this.removeAnimationKeyFrames()
          this.scene.stopAnimationHandler(this)
          this.animation = null
        }

        subscribeToKeyframe(keyframeId: FlexId, callback: () => void): BABYLON.Observer<void>[] {
          const observers: BABYLON.Observer<void>[] = []
          this.animations.forEach(animation => {
            animation.keyFrames?.filter(keyframe => keyframe.id === keyframeId)
              .forEach(keyframe => observers.push(keyframe.emitter.add(callback)))
          })
          return observers
        }

        clearKeyframeSubscriptions(keyframeId: FlexId): void {
          this.animations.forEach(animation => {
            animation.keyFrames
              ?.filter(keyframe => keyframe.id === keyframeId)
              .forEach(keyframe => keyframe.emitter.clear())
          })
        }

        removeAnimationKeyFrames(): void {
          this.keyFramesTimeouts.forEach((timeout) => Core.clearTimeout(timeout))
          this.keyFramesTimeouts = []
        }

        removeEndAnimationTimer(): void {
          if (this.endAnimationTimerInterval) {
            Core.clearInterval(this.endAnimationTimerInterval)
            this.endAnimationTimerInterval = null
          }
          if (this.endAnimationTimerTimeout) {
            Core.clearTimeout(this.endAnimationTimerTimeout)
            this.endAnimationTimerTimeout = null
          }
        }

        drawText(text: string, properties: DrawBlockProperties): void {
          // TODO This algorithm should be improved in different ways:
          // - Add CSS style or whatever.
          // - Avoid creating a secondary texture for boundaries.
          // - Improve performance.
          // - Let the user draw text over an 'url' loaded texture (not only blank textures).

          if (this.props.url) { Logger.debugError('Trying to draw text on an \'url\' texture. Texts can be only drawn on blank textures (url: undefined).', _classInterface.prototype); return }

          const font = `${properties.fontStyle} ${properties.fontSize}px ${properties.fontName}`

          const checkSizeTx = new BABYLON.DynamicTexture('DynamicTexture', 64, this.babylon.scene, false)
          const ctx = checkSizeTx.getContext()
          ctx.font = font
          const metricsFirst = ctx.measureText(text)
          let textWidth = 0
          const lineHeight = metricsFirst.actualBoundingBoxAscent + metricsFirst.actualBoundingBoxDescent
          const textHeiht = lineHeight
          checkSizeTx.dispose()
          textWidth = ctx.measureText(text).width
          const textureWidth = properties.textureSize?.width ?? textWidth
          const textureHeight = properties.textureSize?.height ?? textHeiht + properties.fontSize / 2

          const dynamicTexture = new BABYLON.DynamicTexture('draw-text-texture', { width: textureWidth, height: textureHeight }, this.babylon.scene, false)
          const ctxTx = dynamicTexture.getContext()
          if (properties.bgColor) {
            ctxTx.beginPath()
            ctxTx.rect(0, 0, textureWidth, textureHeight)
            ctxTx.fillStyle = properties.bgColor
            ctxTx.fill()
          }

          const startY = properties.centerV && properties.textureSize ? textureHeight / 2 : lineHeight

          dynamicTexture.drawText(text, properties.centerH ? null : 0, startY, font, properties.textColor, null, false)
          const spriteMesh = new SpriteMesh(this.scene, this.props)
          spriteMesh.setFromTexture(dynamicTexture, text.slice(0, 10) + (text.length > 10 ? '...' : ''))
          this.setSpriteMesh(spriteMesh, true)
        }

        release(): void {
          if (!this.babylon.mesh) { Logger.debugError('Trying to remove a Sprite that has been already removed.', _classInterface.prototype); return }
          invokeCallback(this.onDestroy, this)
          this.stopAnimation()
          if (this.exclusiveTexture) {
            this.spriteMesh?.release()
            this.spriteMesh = null as any
          }
          this.babylon.mesh?.dispose()
          this.babylon.mesh = null as any
          removeLoopUpdate(this)
          removeCanvasResize(this)
        }

        destroy(): void {
          this.scene.remove.sprite(this)
        }
      }
      const _classCore = class implements SpriteCore {
        props = applyDefaults(props, spritePropsDefault)
        Instance: SpriteInterface = new _classInterface(null as any, null as any)
        spriteMeshes: Map<SceneInterface, SpriteMesh> = new Map<SceneInterface, SpriteMesh>()

        load(scene: SceneInterface): LoadingProgress {
          const progress = new LoadingProgress()
          if (this.spriteMeshes.get(scene)) {
            return progress.complete()
          } else {
            if (this.props.url) {
              const asset = AssetsController.getAsset(this.props.url)
              if (asset) {
                const spriteMesh = new SpriteMesh(scene, this.props)
                this.spriteMeshes.set(scene, spriteMesh)
                spriteMesh.setFromAsset(asset)
                  .then(() => {
                    progress.complete()
                  })
              } else {
                Logger.error(`Asset '${this.props.url}' not found on sprite load:`, _classInterface.prototype)
              }
              return progress
            } else {
              return progress.complete()
            }
          }
        }

        unload(scene: SceneInterface): void {
          this.spriteMeshes.delete(scene)
        }

        spawn(scene: SceneInterface): SpriteInterface {
          const sprite = new _classInterface(scene, this.props)
          return sprite
        }

        getParticleInfo(scene: SceneInterface): SpriteParticleInfo {
          if (!core.spriteMeshes.get(scene)) { Logger.debugError('Sprite texture not found for scene in getParticleInfo:', _classInterface.prototype, scene.constructor.name) } // TODO get sprite and scene names
          return {
            spriteMesh: this.spriteMeshes.get(scene) as any,
            props: this.props
          }
        }
      }
      const core = new _classCore()
      SpritesController.register(core)
      return _classInterface
    }

    // Mutates decorator to class or property
    if (constructorOrTarget.prototype) { // Defined prototype means it is a decorated class
      return decorateClass()
    } else if ((
      constructorOrTarget instanceof ActorInterface ||
      constructorOrTarget instanceof ActorActionInterface ||
      constructorOrTarget instanceof ActorStateInterface ||
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof SceneActionInterface ||
      constructorOrTarget instanceof SceneStateInterface ||
      constructorOrTarget instanceof ParticleInterface
    ) && !descriptor) { // Undefined descriptor means it is a decorated property, otherwiese it is a decorated method
      @Sprite(props)
      abstract class _spriteInterface extends SpriteInterface {}
      // TODO: Store the 'className' to debug it in logs.

      if (!Reflect.hasMetadata('metadata', constructorOrTarget)) {
        Reflect.defineMetadata('metadata', new Metadata(), constructorOrTarget)
      }
      const metadata = Reflect.getMetadata('metadata', constructorOrTarget) as Metadata
      metadata.sprites.push({
        propertyName: contextOrProperty as string,
        classDefinition: _spriteInterface as any
      })
    } else {
      Logger.debugError('Cannot apply sprite decorator to non allowed property class:', constructorOrTarget, contextOrProperty)
    }
  }
}
