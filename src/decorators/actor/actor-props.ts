import {
  ActionConstructor,
  ParticleConstructor,
  ParticleSourceConstructor,
  StateConstructor
} from '../../constructors'

export interface ActorProps {
  name: string
  states?: StateConstructor[]
  actions?: ActionConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
