import * as BABYLON from '@babylonjs/core'

import {
  LoadingProgress,
  StateInterface
} from '../../base'
import { Metadata } from '../../base/interfaces/metadata/metadata'
import {
  AssetsController,
  SpritesController
} from '../../controllers'
import { Core } from '../../core'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { DrawBlockProperties } from '../../models/draw-text-properties'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger'
import { MeshTransform } from '../../types'
import { FlexId } from '../../types/flex-id'
import { SpriteTransform } from '../../types/sprite-transform'
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
import { ParticleInterface } from '../particle/particle-interface'
import { SceneActionInterface } from '../scene/scene-action/scene-action-interface'
import { SceneInterface } from '../scene/scene-interface'
import { SpriteAnimation } from './sprite-animation'
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
              const texture = new SpriteMesh(scene, this.props)
              texture.setFromBlank()
              this.setMesh(texture, true)
            } else {
              if (!core.textures.get(scene)) { Logger.debugError('Sprite texture not found for scene in sprite constructor:', _classInterface.prototype, scene.constructor.name) } // TODO get sprite and scene names
              this.setMesh(core.textures.get(scene) as any, false)
            }
          }
        }

        // ***************
        // SpriteInterface
        // ***************
        props: SpriteProps
        spriteMesh: SpriteMesh
        exclusiveTexture: boolean
        animation: SpriteAnimation | null = null
        animations: Map<FlexId, SpriteAnimation> = new Map<FlexId, SpriteAnimation>()
        babylon: Pick<BabylonAccessor, 'mesh' | 'scene'> = { scene: null as any, mesh: null as any }
        loopUpdate$: BABYLON.Observer<number>
        canvasResize$: BABYLON.Observer<Rect>
        keyFramesTimeouts: Timeout[] = []
        endAnimationTimer: Timeout | null
        transform: MeshTransform
        _visible: boolean
        _scale: number = 1

        set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
        get loopUpdate(): boolean { return !!this.loopUpdate$ }

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

        /* set position(value: BABYLON.Vector3) { this.babylon.sprite.position = value }
        get position(): BABYLON.Vector3 { return this.babylon.sprite.position }
        set angle(value: number) { this.babylon.sprite.angle = value }
        get angle(): number { return this.babylon.sprite.angle }
        get width(): number { return this.babylon.sprite.width }
        get height(): number { return this.babylon.sprite.height }
        get size(): number { return this.babylon.sprite.size }
        set color(value: BABYLON.Color4) { this.babylon.sprite.color = value }
        get color(): BABYLON.Color4 { return this.babylon.sprite.color }
        set isVisible(value: boolean) { this.babylon.sprite.isVisible = value }
        get isVisible(): boolean { return this.babylon.sprite.isVisible }

        set width(value: number) {
          if (this._scale !== 1) { Logger.debugError('Changing sprite \'width\' after having scalated it. This practice is not recommended, it can drive to inconsistencies. Setting scale to 1.', _classInterface.prototype); this._scale = 1 }
          this.babylon.sprite.width = value
        }

        set height(value: number) {
          if (this._scale !== 1) { Logger.debugError('Changing sprite \'height\' after having scalated it. This practice is not recommended, it can drive to inconsistencies. Setting scale to 1.', _classInterface.prototype); this._scale = 1 }
          this.babylon.sprite.height = value
        }

        set size(value: number) {
          if (this._scale !== 1) { Logger.debugError('Changing sprite \'size\' after having scalated it. This practice is not recommended, it can drive to inconsistencies. Setting scale to 1.', _classInterface.prototype); this._scale = 1 }
          this.babylon.sprite.size = value
        }

        set scale(scale: number) {
          // TODO use diferential instead spriteTexture original size, to avoid inconsistencies if width, height, or size have been changed?
          this._scale = scale
          this.babylon.sprite.width = this.spriteTexture.width * this._scale
          this.babylon.sprite.height = this.spriteTexture.height * this.scale
        }

        get scale(): number { return this._scale }

        set visible(value: boolean) {
          this._visible = value
        }

        get visible(): boolean {
          return this._visible
        } */

        setMesh(spriteMesh: SpriteMesh, isExclusive: boolean) {
          if (this.babylon.mesh) {
            this.release()
          }
          this.spriteMesh = spriteMesh
          this.exclusiveTexture = isExclusive
          this.babylon.mesh = spriteMesh.spawn()
          this.transform = this.babylon.mesh
          this.props.animations?.forEach(animation => this.addAnimation(animation))
          attachLoopUpdate(this)
          attachCanvasResize(this)
          invokeCallback(this.onSpawn, this)
        }

        // setTexture(spriteTexture: SpriteMesh, isExclusive: boolean) {
        //   if (this.babylon.sprite) {
        //     // const transform = this.getTransform()  // TODO?
        //     this.release()
        //   }
        //   this.spriteTexture = spriteTexture
        //   this.exclusiveTexture = isExclusive
        //   const babylonSprite = new BABYLON.Sprite(_className, this.spriteTexture.babylon.spriteManager)
        //   babylonSprite.width = this.spriteTexture.width
        //   babylonSprite.height = this.spriteTexture.height
        //   babylonSprite.isVisible = true
        //   this.babylon.sprite = babylonSprite
        //   this.babylon.spriteManager = this.spriteTexture.babylon.spriteManager
        //   this.transform = this.babylon.sprite
        //   this.props.animations?.forEach(animation => this.addAnimation(animation))
        //   attachLoopUpdate(this)
        //   attachCanvasResize(this)
        //   invokeCallback(this.onSpawn, this)
        // }

        setFrame(frame: number): void {
          if (frame < this.getFirstFrame() || frame > this.getLastFrame()) { Logger.debugError(`Calling out of bound setFrame(${frame}) - Start: ${this.getFirstFrame()}, End: ${this.getLastFrame()}`) }
          this.stopAnimation()
          this.visible = true
          // this.babylon.sprite.cellIndex = frame  // 8a8f
        }

        setFrameFirst(): void {
          this.setFrame(this.getFirstFrame())
        }

        setFrameLast(): void {
          this.setFrame(this.getLastFrame())
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

        playAnimation(animation: SpriteAnimation | FlexId, loopOverride?: boolean, completed?: () => void): void {
          // if (isFlexId(animation)) { // 8a8f
          //   if (!this.animations.get(animation as FlexId)) { Logger.debugError(`Animation '${animation}' doesn't exist in sprite:`, _classInterface.prototype); return }
          //   animation = this.animations.get(animation as FlexId) as SpriteAnimation
          // }
          // this.animation = animation as SpriteAnimation
          // const frameStart = this.getFirstFrame()
          // const frameEnd = this.getLastFrame()
          // const delay = this.animation.delay
          // const loop = loopOverride ?? this.animation.loop
          // const keyFrames = this.animation.keyFrames

          // const playAnimation = () => {
          //   this.babylon.sprite.playAnimation(frameStart, frameEnd, false, delay)
          //   if (completed || loop) {
          //     this.endAnimationTimer = Core.setTimeout(() => onCompleted(), (frameEnd - frameStart + 1) * delay)
          //   }
          //   this.keyFramesTimeouts = []
          //   keyFrames?.forEach((animationKeyFrame) => {
          //     if (animationKeyFrame.emitter.hasObservers()) {
          //       animationKeyFrame.ms.forEach((ms) => {
          //         this.keyFramesTimeouts.push(Core.setTimeout(() => animationKeyFrame.emitter.notifyObservers(), ms))
          //       })
          //     }
          //   })
          // }

          // // To support 'keyframes' and 'completed' callback for each loop tt is neccesary to do the loop manually since Babylon only notify the first end of animation
          // // Otherwise would need to use setInterval for keyframes, which would't be synchronized after some loops
          // const onCompleted = () => {
          //   if (completed) {
          //     completed()
          //   }
          //   if (loop) {
          //     playAnimation()
          //   }
          // }

          // this.visible = true
          // this.removeEndAnimationTimer()
          // this.removeAnimationKeyFrames()
          // playAnimation()
        }

        stopAnimation(): void {
          this.removeEndAnimationTimer()
          this.removeAnimationKeyFrames()
          // this.babylon.sprite.stopAnimation() // 8a8f
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

        drawText(text: string, properties: DrawBlockProperties): void {
          // TODO This algorithm should be improved in different ways:
          // - Add CSS style or whatever.
          // - Avoid creating a secondary texture for boundaries.
          // - Improve performance.
          // - Let the user draw text over an 'url' loaded texture (not only blank textures).
          // 8a8f
          // if (this.props.url) { Logger.debugError('Trying to draw text on an \'url\' texture. Texts can be only drawn on blank textures (url: undefined).', _classInterface.prototype); return }

          // const font = `${properties.fontStyle} ${properties.fontSize}px ${properties.fontName}`

          // const checkSizeTx = new BABYLON.DynamicTexture('DynamicTexture', 64, this.babylon.scene, false)
          // const ctx = checkSizeTx.getContext()
          // ctx.font = font
          // const metricsFirst = ctx.measureText(text)
          // let textWidth = 0
          // const lineHeight = metricsFirst.actualBoundingBoxAscent + metricsFirst.actualBoundingBoxDescent
          // const textHeiht = lineHeight
          // checkSizeTx.dispose()
          // textWidth = ctx.measureText(text).width
          // const textureWidth = properties.textureSize?.width ?? textWidth
          // const textureHeight = properties.textureSize?.height ?? textHeiht + properties.fontSize / 2

          // const dynamicTexture = new BABYLON.DynamicTexture('draw-text-texture', { width: textureWidth, height: textureHeight }, this.babylon.scene, false)
          // const ctxTx = dynamicTexture.getContext()
          // if (properties.bgColor) {
          //   ctxTx.beginPath()
          //   ctxTx.rect(0, 0, textureWidth, textureHeight)
          //   ctxTx.fillStyle = properties.bgColor
          //   ctxTx.fill()
          // }

          // const startY = properties.centerV && properties.textureSize ? textureHeight / 2 : lineHeight

          // this.babylon.spriteManager?.texture.dispose()
          // dynamicTexture.drawText(text, properties.centerH ? null : 0, startY, font, properties.textColor, null, false)
          // const texture = new SpriteMesh(this.scene, this.props)
          // texture.setFromTexture(dynamicTexture, 'draw-text-sprite-manager')
          // this.setTexture(texture, true)
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

        private removeAnimationKeyFrames(): void {
          this.keyFramesTimeouts.forEach((timeout) => Core.clearTimeout(timeout))
          this.keyFramesTimeouts = []
        }

        private removeEndAnimationTimer(): void {
          if (this.endAnimationTimer) {
            Core.clearTimeout(this.endAnimationTimer)
            this.endAnimationTimer = null
          }
        }
      }
      const _classCore = class implements SpriteCore {
        props = applyDefaults(props, spritePropsDefault)
        Instance: SpriteInterface = new _classInterface(null as any, null as any)
        textures: Map<SceneInterface, SpriteMesh> = new Map<SceneInterface, SpriteMesh>()

        load(scene: SceneInterface): LoadingProgress {
          const progress = new LoadingProgress()
          if (this.textures.get(scene)) {
            return progress.complete()
          } else {
            if (this.props.url) {
              const asset = AssetsController.getAsset(this.props.url)
              if (!asset) { Logger.debugError(`Asset '${this.props.url}' not found on sprite load:`, _classInterface.prototype) }
              const texture = new SpriteMesh(scene, this.props)
              this.textures.set(scene, texture)
              texture.setFromAsset(asset as any)
                .then(() => {
                  progress.complete()
                })
              return progress
            } else {
              return progress.complete()
            }
          }
        }

        unload(scene: SceneInterface): void {
          this.textures.delete(scene)
        }

        spawn(scene: SceneInterface): SpriteInterface {
          const sprite = new _classInterface(scene, this.props)
          return sprite
        }

        getParticleInfo(scene: SceneInterface): SpriteParticleInfo {
          if (!core.textures.get(scene)) { Logger.debugError('Sprite texture not found for scene in getParticleInfo:', _classInterface.prototype, scene.constructor.name) } // TODO get sprite and scene names
          return {
            texture: this.textures.get(scene) as any,
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
      constructorOrTarget instanceof SceneInterface ||
      constructorOrTarget instanceof SceneActionInterface ||
      constructorOrTarget instanceof StateInterface ||
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
