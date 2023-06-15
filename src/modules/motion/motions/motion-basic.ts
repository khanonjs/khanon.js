import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { Motion } from '../motion'
import { MotionEndCriteria } from '../motion-end-criteria'
import { MotionProperties } from '../motion-properties'

export interface MotionBasicProperties extends MotionProperties {
    alphaStart?: number
    alphaEnd?: number
    alphaVel?: number
    posVel?: Vector3
    posSin?: Vector3
    posSinVel?: number
    posSinMoment?: number
    rotSin?: Vector3
    rotSinVel?: number
    rotSinMoment?: number
}

export class MotionBasic extends Motion {
  private stack: (() => void)[] = []

  private posSinOrigin: Vector3
  private posSinTime: number

  private rotSinOrigin: Vector3
  private rotSinTime: number

  constructor(protected readonly properties: MotionBasicProperties) {
    super(properties)
  }

  onInitialize(): void {
    this.displayObject.setAlpha(this.properties.alphaStart ?? 1)

    if (this.properties.alphaVel) {
      if (this.properties.alphaStart < this.properties.alphaEnd) {
        this.stack.push(() => this.alphaAdd())
      } else {
        this.stack.push(() => this.alphaSub())
      }
    }
    if (this.properties.posVel) {
      this.stack.push(() => this.posAdd())
    }
    if (this.properties.posSin) {
      this.posSinTime = this.properties.posSinMoment ?? 0
      this.posSinOrigin = this.displayObject.getPosition()
      this.stack.push(() => this.posSin())
    }
    if (this.properties.rotSin) {
      this.rotSinTime = this.properties.rotSinMoment ?? 0
      this.rotSinOrigin = this.displayObject.getRotation()
      this.stack.push(() => this.rotSin())
    }
  }

  loopUpdate(): void {
    this.stack.forEach((fn) => fn())
  }

  /**
     * Alpha addition
     */
  alphaAdd(): void {
    this.displayObject.setAlpha(this.displayObject.getAlpha() + this.properties.alphaVel)
    if (this.displayObject.getAlpha() >= this.properties.alphaEnd) {
      this.displayObject.setAlpha(this.properties.alphaEnd)
      if (this.properties.endCriteria === MotionEndCriteria.ALPHA_END) {
        this.done()
      }
    }
  }

  /**
     * Alpha substraction
     */
  alphaSub(): void {
    this.displayObject.setAlpha(this.displayObject.getAlpha() - this.properties.alphaVel)
    if (this.displayObject.getAlpha() <= this.properties.alphaEnd) {
      this.displayObject.setAlpha(this.properties.alphaEnd)
      if (this.properties.endCriteria === MotionEndCriteria.ALPHA_END) {
        this.done()
      }
    }
  }

  /**
     * Position movement
     */
  posAdd(): void {
    this.displayObject.babylonjs.position.addInPlace(this.properties.posVel)
  }

  /**
     * Sinusoidal position
     */
  posSin(): void {
    this.posSinTime += this.properties.posSinVel
    this.displayObject.babylonjs.position = this.posSinOrigin.add(this.properties.posSin.scale(Math.sin(this.posSinTime)))
  }

  /**
     * Sinusoidal rotation
     */
  rotSin(): void {
    this.rotSinTime += this.properties.rotSinVel
    this.displayObject.setRotation(this.rotSinOrigin.add(this.properties.rotSin.scale(Math.sin(this.rotSinTime))))
  }
}
