import {
  MeshConstructor,
  SpriteConstructor
} from '../../../constructors'
import { SpritesController } from '../../../controllers'
import { MeshesController } from '../../../controllers/meshes-controller'
import { Logger } from '../../../modules'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SpriteInterface } from '../../sprite/sprite-interface'

export class ActorCompositionDefinition {
  fakeId = 0
  sprites: Map<string, SpriteInterface> = new Map<string, SpriteInterface>()
  meshes: Map<string, MeshInterface> = new Map<string, MeshInterface>()

  constructor(private readonly id: string) {}

  addSprite(spriteCtr: SpriteConstructor, name?: string): SpriteInterface {
    if (!name) {
      name = (++this.fakeId).toString()
    }
    const sprite = SpritesController.get(spriteCtr).spawn()
    Logger.trace('aki ActorCompositionDefinition addSprite', name)
    if (this.sprites.get(name)) { Logger.debugError(`ActorCompositionDefinition - Can't add a mesh with same name '${name}'`) }
    this.sprites.set(name, sprite)
    return sprite
  }

  addMesh(meshCtr: MeshConstructor, name?: string): MeshInterface {
    if (!name) {
      name = (++this.fakeId).toString()
    }
    const mesh = MeshesController.get(meshCtr).spawn()
    Logger.trace('aki ActorCompositionDefinition addMesh', name)
    if (this.meshes.get(name)) { Logger.debugError(`ActorCompositionDefinition - Can't add a mesh with same name '${name}'`) }
    this.meshes.set(name, mesh)
    return mesh
  }

  release(): void {
    Logger.trace('aki ActorCompositionDefinition release')
    // 8a8f
  }
}
