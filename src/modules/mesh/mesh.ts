import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Mesh as BabylonJsMesh } from '@babylonjs/core/Meshes/mesh'

import { DisplayObject } from '../../base/display-object'
import { MeshAnimation } from './mesh-animation'

export class Mesh extends DisplayObject {
  declare babylonjs: BabylonJsMesh

  private scale = 1

  constructor(readonly name, babylonJsMesh: BabylonJsMesh) {
    super(name)
    this.babylonjs = babylonJsMesh
  }

  get visible(): boolean {
    return this.babylonjs.isVisible
  }

  set visible(visible: boolean) {
    this.babylonjs.isVisible = visible
  }

  release(): void {
    this.babylonjs.dispose()
  }

  setRotation(rotation: Vector3): void {
    // TODO
    // this.babylonjs.rotate = rotation
  }

  getRotation(): Vector3 {
    // TODO
    return new Vector3(0, 0, 0)
  }

  setScale(scale: number): void {
    this.scale = scale
    this.babylonjs.scaling = new Vector3(this.scale, this.scale, this.scale)
  }

  getScale(): number {
    return this.scale
  }

  setAlpha(alpha: number): void {
    // TODO
  }

  getAlpha(): number {
    // TODO
    return 1
  }

  play(animation: MeshAnimation): void {
    // TODO
  }
}
