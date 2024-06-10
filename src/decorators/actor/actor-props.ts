import {
  ActorEventConstructor,
  ActorStateConstructor,
  GUIConstructor,
  ParticleConstructor,
  ParticleSourceConstructor
} from '../../constructors'

export interface ActorProps {
  guis?: GUIConstructor[]
  states?: ActorStateConstructor[]
  events?: ActorEventConstructor[]
  particles?: (ParticleConstructor | ParticleSourceConstructor)[]
}
