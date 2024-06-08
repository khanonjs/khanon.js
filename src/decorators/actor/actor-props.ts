import {
  ActionConstructor,
  GUIConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  SceneStateConstructor
} from '../../constructors'

export interface ActorProps {
  guis?: GUIConstructor[]
  states?: SceneStateConstructor[]
  actions?: ActionConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
