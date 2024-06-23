import {
  Vector2,
  Vector3
} from '@babylonjs/core'

import {
  MeshConstructor,
  SpriteConstructor
} from '../../../constructors'
import { SpritesController } from '../../../controllers'
import { MeshesController } from '../../../controllers/meshes-controller'
import { Logger } from '../../../modules'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SceneType } from '../../scene/scene-type'
import { SpriteInterface } from '../../sprite/sprite-interface'

export class ActorCompositionDefinition {
  fakeId = 0
  sprites: Map<string, SpriteInterface> = new Map<string, SpriteInterface>()
  meshes: Map<string, MeshInterface> = new Map<string, MeshInterface>()

  constructor(private readonly id: string, private readonly scene: SceneType) {}

  addSprite(spriteCtr: SpriteConstructor, name?: string, translation?: Vector2, rotation?: Vector2, scale?: Vector2): SpriteInterface { // 8a8f translation, rotation
    if (!name) {
      name = (++this.fakeId).toString()
    }
    const sprite = SpritesController.get(spriteCtr).spawn(this.scene)
    if (this.sprites.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding Sprite with name already defined '${name}'`) }
    this.sprites.set(name, sprite)
    return sprite
  }

  addMesh(meshCtr: MeshConstructor, name?: string, translation?: Vector3, rotation?: Vector3, scale?: Vector3): MeshInterface { // 8a8f translation, rotation
    if (!name) {
      name = (++this.fakeId).toString()
    }
    const mesh = MeshesController.get(meshCtr).spawn(this.scene)
    if (this.meshes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Adding Mesh with name already defined '${name}'`) }
    this.meshes.set(name, mesh)
    return mesh
  }

  release(): void {
    this.sprites.forEach(sprite => sprite.release())
    this.sprites.clear()
    this.meshes.forEach(mesh => mesh.release())
    this.meshes.clear()
  }
}
