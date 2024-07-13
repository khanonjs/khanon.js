import * as BABYLON from '@babylonjs/core'

import { LoadingProgress } from '../../base'
import {
  AssetsController,
  SpritesController
} from '../../controllers'
import { Core } from '../../core'
import { BabylonAccessor } from '../../models/babylon-accessor'
import { Rect } from '../../models/rect'
import { Timeout } from '../../models/timeout'
import { Logger } from '../../modules/logger'
import { SpriteTransform } from '../../types'
import {
  applyDefaults,
  attachCanvasResize,
  attachLoopUpdate,
  invokeCallback,
  removeCanvasResize,
  removeLoopUpdate,
  switchLoopUpdate
} from '../../utils/utils'
import { SceneInterface } from '../scene/scene-interface'
import { SceneType } from '../scene/scene-type'
import { SpriteAnimation } from './sprite-animation'
import { SpriteCore } from './sprite-core'
import { SpriteInterface } from './sprite-interface'
import { SpriteProps } from './sprite-props'
import { SpriteTexture } from './sprite-texture'
import { spritePropsDefault } from './sprite.props.deafult'

export function Sprite(props: SpriteProps): any {
  return function <T extends { new (...args: any[]): SpriteInterface }>(constructor: T & SpriteInterface, context: ClassDecoratorContext) {
    const _className = constructor.name
    const _classInterface = class extends constructor implements SpriteInterface {
      constructor(readonly scene: SceneType, private readonly props: SpriteProps) {
        super()
      }

      // ***************
      // SpriteInterface
      // ***************
      spriteTexture: SpriteTexture
      animation: SpriteAnimation = null
      animations: Map<string | number, SpriteAnimation> = new Map<string | number, SpriteAnimation>()
      babylon: Pick<BabylonAccessor, 'spriteManager' | 'sprite'> = { spriteManager: null, sprite: null }
      loopUpdate$: BABYLON.Observer<number>
      canvasResize$: BABYLON.Observer<Rect>
      _scale: number = 1

      onSpawn?(scene: SceneInterface): void
      onLoopUpdate?(delta: number): void
      onCanvasResize?(size: Rect): void

      set loopUpdate(value: boolean) { switchLoopUpdate(value, this) }
      get loopUpdate(): boolean { return !!this.loopUpdate$ }

      get width(): number {
        return this.spriteTexture.width
      }

      get height(): number {
        return this.spriteTexture.height
      }

      set scale(scale: number) {
        this._scale = scale
        this.transform.width = this.width * this._scale
        this.transform.height = this.height * this.scale
      }

      get scale(): number { return this._scale }

      initialize(spriteTexture: SpriteTexture) {
        this.spriteTexture = spriteTexture
        const babylonSprite = new BABYLON.Sprite(_className, this.spriteTexture.babylon.spriteManager)
        babylonSprite.width = this.spriteTexture.width
        babylonSprite.height = this.spriteTexture.height
        babylonSprite.isVisible = true
        if (this.babylon.sprite) {
          const transform = this.getTransform()
          this.babylon.sprite.dispose()
          this.babylon.sprite = babylonSprite
          this.setTransform(transform)
        } else {
          this.babylon.sprite = babylonSprite
          this.babylon.spriteManager = this.spriteTexture.babylon.spriteManager
        }
        this.transform = this.babylon.sprite
        this.props.animations?.forEach(animation => this.addAnimation(animation))
        attachLoopUpdate(this)
        attachCanvasResize(this)
        invokeCallback(this.onSpawn, this, this.scene)
      }

      setFrame(frame: number): void {
        if (frame < this.getFirstFrame() || frame > this.getLastFrame()) { Logger.debugError(`Calling out of bound setFrame(${frame}) - Start: ${this.getFirstFrame()}, End: ${this.getLastFrame()}`) }
        this.stopAnimation()
        this.visible = true
        this.babylon.sprite.cellIndex = frame
      }

      setFirstFrame(): void {
        this.setFrame(this.getFirstFrame())
      }

      setLastFrame(): void {
        this.setFrame(this.getLastFrame())
      }

      private getFirstFrame(): number {
        return this.animation?.frameStart ?? 0
      }

      private getLastFrame(): number {
        return this.animation?.frameEnd ?? this.props.numFrames - 1 ?? 0
      }

      // ***************
      // DisplayObject
      // ***************
      transform: SpriteTransform
      private _visible: boolean
      private keyFramesTimeouts: Timeout[] = []
      private endAnimationTimer: Timeout

      set visible(value: boolean) {
        this._visible = value
      }

      get visible(): boolean {
        return this._visible
      }

      setTransform(transform: BABYLON.Matrix): void {
        // TODO
        // this.babylon.mesh.updatePoseMatrix(transform) // TODO: Test this
        // this.setPosition(transform.getTranslation())
        // this.setRotation(transform.getRotationMatrix())
        // this.babylon.mesh.scaling = transform.sca
        // this.babylon.mesh.rota = transform.getTranslation()
      }

      getTransform(): BABYLON.Matrix {
        // TODO
        return null
      }

      addAnimation(animation: SpriteAnimation): void {
        if (this.animations.get(animation.id)) { Logger.debugError(`Animation name '${animation.id}' already exists.`); return }
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

      playAnimation(animation: SpriteAnimation, loopOverride?: boolean, completed?: () => void): void {
        this.animation = animation
        const loop = loopOverride ?? animation.loop
        const frameStart = this.getFirstFrame()
        const frameEnd = this.getLastFrame()

        const playAnimation = () => {
          this.babylon.sprite.playAnimation(frameStart, frameEnd, false, animation.delay)
          if (completed || loop) {
            this.endAnimationTimer = Core.setTimeout(() => onCompleted(), (frameEnd - frameStart + 1) * animation.delay, this)
          }
          setKeyframesTimeouts()
        }

        // Emit keyframe after timeout
        const setKeyframesTimeouts = () => {
          this.keyFramesTimeouts = []
          animation.keyFrames?.forEach((animationKeyFrame) => {
            animationKeyFrame.ms.forEach((ms) => {
              this.keyFramesTimeouts.push(Core.setTimeout(() => animationKeyFrame.emitter.notifyObservers(), ms, this))
            })
          })
        }

        // To support 'keyframes' and 'completed' callback for each loop tt is neccesary to do the loop manually since Babylon only notify the first end of animation
        // Otherwise would need to use setInterval for keyframes, which would't be synchronized after some loops
        const onCompleted = () => {
          if (completed) {
            completed()
          }
          if (loop) {
            playAnimation()
          }
        }

        this.visible = true
        this.removeEndAnimationTimer()
        this.removeAnimationKeyFrames()
        playAnimation()
      }

      stopAnimation(): void {
        this.removeEndAnimationTimer()
        this.removeAnimationKeyFrames()
        this.babylon.sprite.stopAnimation()
        this.animation = null
      }

      subscribeToKeyframe(keyframeId: string | number, callback: () => void): BABYLON.Observer<void>[] {
        const observers: BABYLON.Observer<void>[] = []
        this.animations.forEach(animation => {
          animation.keyFrames
            .filter(keyframe => keyframe.id === keyframeId)
            .forEach(keyframe => observers.push(keyframe.emitter.add(callback)))
        })
        return observers
      }

      clearKeyframeSubscriptions(keyframeId: string | number): void {
        this.animations.forEach(animation => {
          animation.keyFrames
            .filter(keyframe => keyframe.id === keyframeId)
            .forEach(keyframe => keyframe.emitter.clear())
        })
      }

      release(): void {
        this.stopAnimation()
        this.babylon.sprite.dispose()
        removeLoopUpdate(this)
        removeCanvasResize(this)
      }

      private removeAnimationKeyFrames(): void {
        this.keyFramesTimeouts.forEach((timeout) => Core.clearTimeout(timeout))
        this.keyFramesTimeouts = []
      }

      private removeEndAnimationTimer(): void {
        if (this.endAnimationTimer) {
          Core.clearTimeout(this.endAnimationTimer)
          this.endAnimationTimer = undefined
        }
      }
    }
    const _classCore = class implements SpriteCore {
      props = applyDefaults(props, spritePropsDefault)
      Instance: SpriteInterface = new _classInterface(null, null)
      textures: Map<SceneType, SpriteTexture> = new Map<SceneType, SpriteTexture>()

      load(scene: SceneType): LoadingProgress {
        const progress = new LoadingProgress().complete()
        if (this.textures.get(scene)) {
          return progress.complete()
        } else {
          if (this.props.url) {
            const asset = AssetsController.getAsset(this.props.url)
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromAsset(asset)
            this.textures.set(scene, texture)
            return progress
          } else {
            const texture = new SpriteTexture(scene, this.props)
            texture.setFromBlank()
            this.textures.set(scene, texture)
            return progress.complete()
          }
        }
      }

      unload(scene: SceneType): void {
        this.textures.delete(scene)
        // AssetsController. // TODO
      }

      spawn(scene: SceneType): SpriteInterface {
        const sprite = new _classInterface(scene, this.props)
        sprite.initialize(this.textures.get(scene))
        return sprite
      }
    }
    SpritesController.register(new _classCore())
    return _classInterface
  }
}
