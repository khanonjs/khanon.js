import {
  Matrix,
  Sprite as BabylonSprite
} from '@babylonjs/core'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'

import { LoadingProgress } from '../../base'
import {
  AssetsController,
  SpritesController
} from '../../controllers'
import { BabylonAccessor } from '../../models'
import { Logger } from '../../modules'
import { SpriteTransform } from '../../types'
import {
  applyDefaults,
  invokeCallback
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
    const _classInterface = class extends constructor implements SpriteInterface {
      constructor(readonly scene: SceneType, private readonly props: SpriteProps) {
        super()
      }

      // ***************
      // MeshInterface
      // ***************
      animation: SpriteAnimation = null

      /**
       * Public
       */
      babylon: Pick<BabylonAccessor, 'scene' | 'spriteManager' | 'sprite'> = { scene: null, spriteManager: null, sprite: null }

      setSprite(babylonSprite: BabylonSprite): void {
        if (this.babylon.sprite) {
          const transform = this.getTransform()
          this.babylon.sprite.dispose()
          this.babylon.sprite = babylonSprite
          this.setTransform(transform)
        } else {
          this.babylon.sprite = babylonSprite
        }
        this.transform = this.babylon.sprite
      }

      setFrame(frame: number): void {
        this.stopAnimation()
        this.visible = true
        if (frame < 0) {
          frame = this.animation.frameEnd
        }
        this.babylon.sprite.cellIndex = frame
      }

      /**
       * User defined
       */
      onSpawn?(scene: SceneInterface): void {}

      // ***************
      // DisplayObject
      // ***************
      transform: SpriteTransform
      private _visible: boolean
      private keyFramesTimeouts: number[] = []
      private endAnimationTimer: number

      set visible(value: boolean) {
        this._visible = value
      }

      get visible(): boolean {
        return this._visible
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

      playAnimation(animation: SpriteAnimation, loopOverride?: boolean, completed?: () => void): void {
        this.animation = animation
        const loop = loopOverride ?? animation.loop
        const frameStart = animation.frameStart
        const frameEnd = animation.frameEnd

        const playAnimation = () => {
          this.babylon.sprite.playAnimation(frameStart, frameEnd, false, animation.delay)
          if (completed || loop) {
            this.endAnimationTimer = setTimeout(() => onCompleted(), (frameEnd - frameStart + 1) * animation.delay, this) // 8a8f link timeouts to loop update
          }
          setKeyframesTimeouts()
        }

        // Emit subject for each keyFrame timeout
        const setKeyframesTimeouts = () => {
          this.keyFramesTimeouts = []
          if (animation.keyFrames) {
            animation.keyFrames.forEach((animationKeyFrame) => {
              animationKeyFrame.timeouts.forEach((time) => {
                this.keyFramesTimeouts.push(setTimeout(() => animationKeyFrame.linkedSubject.notifyObservers(), time, this)) // 8a8f link timeouts to loop update
              })
            })
          }
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

      private removeAnimationKeyFrames(): void {
        this.keyFramesTimeouts.forEach((timeout) => clearTimeout(timeout))
        this.keyFramesTimeouts = []
      }

      private removeEndAnimationTimer(): void {
        if (this.endAnimationTimer) {
          clearTimeout(this.endAnimationTimer)
          this.endAnimationTimer = undefined
        }
      }

      release(): void {
        this.stopAnimation()
        this.babylon.sprite.dispose()
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
            texture.setFromArrayBuffer(asset.buffer)
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
        // AssetsController. // 8a8f
      }

      spawn(scene: SceneType): SpriteInterface {
        const sprite = new _classInterface(scene, this.props)
        invokeCallback(sprite.onSpawn, sprite, scene)
        return sprite
      }
    }
    SpritesController.register(new _classCore())
    return _classInterface
  }
}
