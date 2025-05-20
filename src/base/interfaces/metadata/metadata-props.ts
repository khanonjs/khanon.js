import { ActorActionConstructor } from '../../../decorators/actor/actor-action/actor-action-constructor'
import { MeshConstructor } from '../../../decorators/mesh/mesh-constructor'
import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'
import { SceneActionConstructor } from '../../../decorators/scene/scene-action/scene-action-constructor'
import { SoundConstructor } from '../../../decorators/sound/sound-constructor'
import { SpriteConstructor } from '../../../decorators/sprite/sprite-constructor'

export interface MetadataProps<A extends ActorActionConstructor | SceneActionConstructor = any> {
  sprites: SpriteConstructor[]
  meshes: MeshConstructor[]
  particles: ParticleConstructor[]
  sounds: SoundConstructor[]
}
