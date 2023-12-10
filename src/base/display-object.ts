import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Mesh as BabylonJsMesh } from '@babylonjs/core/Meshes/mesh'
import { Sprite as BabylonJsSprite } from '@babylonjs/core/Sprites/sprite'

import { MeshAnimation } from '../modules/mesh/mesh-animation'
import { SpriteAnimation } from '../modules/sprite/sprite-animation'

export abstract class DisplayObject {
  readonly babylonjs: BabylonJsSprite | BabylonJsMesh
    abstract visible: boolean

    constructor(protected readonly name: string) {}

    setPosition(position: Vector3): void {
      this.babylonjs.position = position
    }

    setPositionFromFloats(x: number, y: number, z: number): void {
      this.babylonjs.position.x = x
      this.babylonjs.position.y = y
      this.babylonjs.position.z = z
    }

    getPosition(): Vector3 {
      return this.babylonjs.position
    }

    setX(value: number): void {
      this.babylonjs.position.x = value
    }

    incX(value: number): void {
      this.babylonjs.position.x += value
    }

    getX(): number {
      return this.babylonjs.position.x
    }

    setY(value: number): void {
      this.babylonjs.position.y = value
    }

    incY(value: number): void {
      this.babylonjs.position.y += value
    }

    getY(): number {
      return this.babylonjs.position.y
    }

    setZ(value: number): void {
      this.babylonjs.position.z = value
    }

    incZ(value: number): void {
      this.babylonjs.position.z += value
    }

    getZ(): number {
      return this.babylonjs.position.z
    }

    abstract setRotation(rotation: Vector3): void
    abstract getRotation(): Vector3

    abstract setScale(scale: number): void
    abstract getScale(): number

    abstract setAlpha(alpha: number): void
    abstract getAlpha(): number

    abstract play(animation: SpriteAnimation | MeshAnimation, loopOverride?: boolean, completed?: () => void): void

    abstract release(): void
}
