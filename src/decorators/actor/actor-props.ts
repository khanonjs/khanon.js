import {
  ActionConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'

export interface ActorProps {
  states?: StateConstructor[]
  actions?: ActionConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
