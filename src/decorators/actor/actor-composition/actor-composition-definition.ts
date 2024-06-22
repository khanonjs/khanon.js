import {
  MeshConstructor,
  SpriteConstructor
} from '../../../constructors'
import { MeshInterface } from '../../mesh/mesh-interface'
import { SpriteInterface } from '../../sprite/sprite-interface'

export class ActorCompositionDefinition {
  sprites: SpriteInterface[]
  meshes: MeshInterface[]

  constructor(private readonly id: string) {}

  addSprite(sprite?: SpriteConstructor): void {
    console.log('aki ActorCompositionDefinition addSprite')
  }

  addMesh(mesh?: MeshConstructor): void {
    console.log('aki ActorCompositionDefinition addMesh')
  }

  release(): void {
    console.log('aki ActorCompositionDefinition release')
  }
}
