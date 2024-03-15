import { ParticleConstructor } from '@khanonjs/engine/constructors/particle-constructor'
import { ParticleSourceConstructor } from '@khanonjs/engine/constructors/particle-source-constructor'

import {
  ActionConstructor,
  StateConstructor
} from '../../constructors'

export interface ActorProps {
  states: StateConstructor[]
  actions: ActionConstructor[]
  particles: (ParticleConstructor | ParticleSourceConstructor)[]
}
