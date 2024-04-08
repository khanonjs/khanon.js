import {
  ActionConstructor,
  GUIConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'

export interface ActorProps {
  guis?: GUIConstructor[]
  states?: StateConstructor[]
  actions?: ActionConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
