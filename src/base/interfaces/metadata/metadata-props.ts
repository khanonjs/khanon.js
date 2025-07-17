import { MeshConstructor } from '../../../decorators/mesh/mesh-constructor'
import { ParticleConstructor } from '../../../decorators/particle/particle-constructor'
import { SoundConstructor } from '../../../decorators/sound/sound-constructor'
import { SpriteConstructor } from '../../../decorators/sprite/sprite-constructor'

export interface MetadataProps {
  sprites: SpriteConstructor[]
  meshes: MeshConstructor[]
  particles: ParticleConstructor[]
  sounds: SoundConstructor[]
}
