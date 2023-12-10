import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Sprite as BabylonJsSprite } from '@babylonjs/core/Sprites/sprite'

import { DisplayObject } from '../../base/display-object'
import {
  Interval,
  Timeout
} from '../../types/timers'
import { Logger } from '../logger/logger'
import { SpriteAnimation } from './sprite-animation'
import { SpriteProperties } from './sprite-properties'
import { SpriteTexture } from './sprite-texture'

export class Sprite extends DisplayObject {
  declare babylonjs: BabylonJsSprite
  private spriteTexture: SpriteTexture

  private scale = 1
  private keyFramesTimeouts: Timeout[] = []
  private endAnimationTimer: Interval

  constructor(readonly name: string = '', readonly properties: SpriteProperties = {}) {
    super(name)
  }

  get visible(): boolean {
    return this.babylonjs.isVisible
  }

  set visible(visible: boolean) {
    if (!this.spriteTexture) {
      Logger.error('No SpriteTexture on sprite:', this.name)
    }
    this.babylonjs.isVisible = visible
  }

  setTexture(spriteTexture: SpriteTexture): void {
    this.spriteTexture = spriteTexture
    this.babylonjs = new BabylonJsSprite(this.name, this.spriteTexture.babylonjs)
    this.babylonjs.width = this.spriteTexture.width
    this.babylonjs.height = this.spriteTexture.height
    this.visible = false
  }

  release(): void {
    this.stop()
    this.babylonjs.dispose()
  }

  /**
     * Play an animation
     *
     * @param animation
     * @param loopOverride Override 'loop' value on animation interface
     * @param completed
     */
  play(animation: SpriteAnimation, loopOverride?: boolean, completed?: () => void): void {
    const loop = loopOverride ?? animation.loop
    const frameStart = animation.frameStart ?? 0
    const frameEnd = animation.frameEnd ?? this.properties.numFrames - 1

    const playAnimation = () => {
      this.babylonjs.playAnimation(frameStart, frameEnd, false, animation.delay)
      if (completed || loop) {
        this.endAnimationTimer = setTimeout(() => onCompleted(), (frameEnd - frameStart + 1) * animation.delay)
      }
      setKeyframesTimeouts()
    }

    // Emit subject for each keyFrame timeout
    const setKeyframesTimeouts = () => {
      this.keyFramesTimeouts = []
      if (animation.keyFrames) {
        animation.keyFrames.forEach((animationKeyFrame) => {
          animationKeyFrame.timeouts.forEach((time) => {
            this.keyFramesTimeouts.push(setTimeout(() => animationKeyFrame.linkedSubject.next(), time))
          })
        })
      }
    }

    // To support 'keyframes' and 'completed' callback for each loop tt is neccesary to do the loop manually since BabylonJs only notify the first end of animation
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

  stop(): void {
    this.removeEndAnimationTimer()
    this.removeAnimationKeyFrames()
    this.babylonjs.stopAnimation()
  }

  setFrame(frame: number): void {
    this.stop()
    this.visible = true
    if (frame < 0) {
      frame = this.properties.numFrames - 1
    }
    this.babylonjs.cellIndex = frame
  }

  /**
     * Since sprites are always facing camera, the only rotation allowed is on x axis
     *
     * @param rotation
     */
  setRotation(rotation: Vector3): void {
    this.babylonjs.angle = rotation.x
  }

  getRotation(): Vector3 {
    return new Vector3(this.babylonjs.angle, 0, 0)
  }

  setScale(scale: number): void {
    this.scale = scale
    this.babylonjs.width = this.spriteTexture.width * this.scale
    this.babylonjs.height = this.spriteTexture.height * this.scale
  }

  getScale(): number {
    return this.scale
  }

  setAlpha(alpha: number): void {
    this.babylonjs.color.a = alpha
  }

  getAlpha(): number {
    return this.babylonjs.color.a
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
}
