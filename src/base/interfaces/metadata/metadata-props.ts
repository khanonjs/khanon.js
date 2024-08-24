import { ActorActionConstructor } from '../../../decorators/actor/actor-action/actor-action-constructor'
import { MeshConstructor } from '../../../decorators/mesh/mesh-constructor'
import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'
import { SceneActionConstructor } from '../../../decorators/scene/scene-action/scene-action-constructor'
import { SpriteConstructor } from '../../../decorators/sprite/sprite-constructor'

export interface MetadataProps<A extends ActorActionConstructor | SceneActionConstructor = any> {
  actions: A[]
  sprites: SpriteConstructor[]
  meshes: MeshConstructor[]
  particles: ParticleConstructor[]
}