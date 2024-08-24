import { ControllerLoader } from '../base'
import { ParticleConstructor } from '../decorators/particle/particle-constructor'
import { ParticleCore } from '../decorators/particle/particle-core'
import { SceneInterface } from '../decorators/scene/scene-interface'

export class ParticlesController extends ControllerLoader<ParticleConstructor, ParticleCore, SceneInterface>(true) {}
