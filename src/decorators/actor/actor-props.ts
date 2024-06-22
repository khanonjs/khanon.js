import {
  ActorEventConstructor,
  ActorStateConstructor,
  GUIConstructor,
  MeshConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SpriteConstructor
} from '../../constructors'

export interface ActorProps {
  sprites?: SpriteConstructor[]
  meshes?: MeshConstructor[]
  guis?: GUIConstructor[]
  states?: ActorStateConstructor[]
  events?: ActorEventConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
