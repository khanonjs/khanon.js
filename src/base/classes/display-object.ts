import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Mesh as BabylonMesh } from '@babylonjs/core/Meshes/mesh'
import { Sprite as BabylonSprite } from '@babylonjs/core/Sprites/sprite'

// import { MeshAnimation } from '../modules/mesh/mesh-animation'
// import { SpriteAnimation } from '../modules/sprite/sprite-animation'

export abstract class DisplayObject {
  abstract set visible(value: boolean)
  abstract get visible(): boolean

  abstract setPosition(position: Vector3): void
  abstract setPositionFromFloats(x: number, y: number, z: number): void

  abstract getPosition(): Vector3

  abstract setX(value: number): void
  abstract incX(value: number): void
  abstract getX(): number

  abstract setY(value: number): void
  abstract incY(value: number): void
  abstract getY(): number

  abstract setZ(value: number): void
  abstract incZ(value: number): void
  abstract getZ(): number

  abstract setRotation(rotation: Vector3): void
  abstract getRotation(): Vector3

  abstract setScale(scale: number): void
  abstract getScale(): number

  abstract setAlpha(alpha: number): void
  abstract getAlpha(): number

  abstract play(animation: any/* SpriteAnimation | MeshAnimation */, loopOverride?: boolean, completed?: () => void): void
}
