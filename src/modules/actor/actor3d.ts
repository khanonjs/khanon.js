import { Scene as BabylonJsScene } from '@babylonjs/core/scene'

import { Mesh } from '../mesh/mesh'
import { Actor } from './actor'
import { ActorProperties } from './actor-properties'

export abstract class Actor3D extends Actor {
  private _mesh: Mesh

  constructor(readonly name: string, protected readonly properties?: ActorProperties) {
    super(name, properties)
  }

  get mesh(): Mesh {
    return this._mesh
  }

    abstract createDisplayObject(babylonJsScene: BabylonJsScene): Mesh

    protected setDisplayObject(displayObject: Mesh): void {
      this._mesh = displayObject
    }

    setAnimation(id: number, loop = true, completed?: () => void): void {}
}
